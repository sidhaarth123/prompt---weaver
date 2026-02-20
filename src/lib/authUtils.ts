import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

/**
 * Typed error thrown when auth is required but no session exists.
 * Callers can catch and check for this specific code.
 */
export class AuthRequiredError extends Error {
    readonly code = "AUTH_REQUIRED";
    constructor() {
        super("Authentication required. Please log in.");
        this.name = "AuthRequiredError";
    }
}

/**
 * Gets the current valid session.
 * - Supabase's client will auto-refresh the token if needed before returning.
 * - Throws AuthRequiredError if no session exists (user is logged out / token unrecoverable).
 *
 * Use this as the single source of truth before any authenticated API call.
 */
export async function getValidSession(): Promise<Session> {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        if (import.meta.env.DEV) {
            console.debug("[Auth] getSession error:", error.message);
        }
        throw new AuthRequiredError();
    }

    if (!data.session?.access_token) {
        throw new AuthRequiredError();
    }

    return data.session;
}
