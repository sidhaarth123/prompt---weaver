import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side client with service role
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: any, res: any) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get user from session token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const token = authHeader.replace('Bearer ', '');

        // Verify the user
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({ error: 'Invalid session' });
        }

        // Ensure profiles row exists
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: user.id,
                email: user.email,
            }, {
                onConflict: 'id',
                ignoreDuplicates: false
            });

        if (profileError) {
            console.error('Profile upsert error:', profileError);
        }

        // Ensure credits row exists (default 10 credits for free plan)
        const { error: creditsError } = await supabaseAdmin
            .from('credits')
            .upsert({
                user_id: user.id,
                balance: 10, // Default free tier credits
            }, {
                onConflict: 'user_id',
                ignoreDuplicates: true // Don't override existing balance
            });

        if (creditsError) {
            console.error('Credits upsert error:', creditsError);
        }

        // Ensure entitlements row exists (default free plan)
        const { error: entitlementsError } = await supabaseAdmin
            .from('entitlements')
            .upsert({
                user_id: user.id,
                plan: 'free',
                status: 'active',
            }, {
                onConflict: 'user_id',
                ignoreDuplicates: true // Don't override existing plan
            });

        if (entitlementsError) {
            console.error('Entitlements upsert error:', entitlementsError);
        }

        // Fetch current state
        const { data: entitlement } = await supabaseAdmin
            .from('entitlements')
            .select('plan, status')
            .eq('user_id', user.id)
            .single();

        const { data: creditsData } = await supabaseAdmin
            .from('credits')
            .select('balance')
            .eq('user_id', user.id)
            .single();

        return res.status(200).json({
            success: true,
            plan: entitlement?.plan || 'free',
            status: entitlement?.status || 'active',
            balance: creditsData?.balance || 0,
        });

    } catch (error: any) {
        console.error('Ensure user error:', error);
        return res.status(500).json({ error: error.message });
    }
}
