/**
 * Safely maps the Assistant's final JSON response to the Video Generator state.
 */
export function mapVideoResponseToState(final: any, currentState: any, setField: (field: string, value: any) => void) {
    if (!final) return;

    const updateIfUnlocked = (field: string, newValue: any) => {
        if (newValue !== undefined && newValue !== null) {
            setField(field, newValue);
        }
    };

    if (final.production) {
        updateIfUnlocked('platform', final.production.placement || final.production.platform);
        updateIfUnlocked('style', final.production.style || final.production.video_style);
        updateIfUnlocked('aspectRatio', final.production.aspect_ratio);

        if (final.production.duration) {
            const durationVal = typeof final.production.duration === 'string'
                ? parseInt(final.production.duration.replace(/[^0-9]/g, ''))
                : final.production.duration;
            if (!isNaN(durationVal)) {
                updateIfUnlocked('duration', [durationVal]);
            }
        }
    }

    if (final.product) {
        updateIfUnlocked('productName', final.product.name || final.product.product_name);
        updateIfUnlocked('category', final.product.category);
        updateIfUnlocked('brandName', final.product.brand || final.product.brand_name);
        updateIfUnlocked('targetCustomer', final.product.target_customer);
        updateIfUnlocked('benefits', final.product.benefits);
        updateIfUnlocked('offer', final.product.offer || final.product.offer_badge);
        updateIfUnlocked('price', final.product.price);
    }

    if (final.campaign) {
        updateIfUnlocked('objective', final.campaign.objective || final.campaign.campaign_objective);
        updateIfUnlocked('hookStyle', final.campaign.hook_style);
        updateIfUnlocked('cta', final.campaign.cta);
        updateIfUnlocked('urgency', final.campaign.urgency);
        updateIfUnlocked('socialProof', final.campaign.social_proof);
    }

    if (final.script) {
        updateIfUnlocked('hook', final.script.hook_text || final.script.hook);
        updateIfUnlocked('beats', final.script.beats || final.script.scene_beats);
        updateIfUnlocked('visuals', final.script.visual_notes || final.script.visual_details);

        if (final.script.audio) {
            updateIfUnlocked('voiceover', !!final.script.audio.voiceover);
            updateIfUnlocked('music', !!final.script.audio.music);
        }
    }

    // Fallback for direct 'fill' object if provided
    if (final.ecom) {
        const e = final.ecom;
        updateIfUnlocked('productName', e.product_name);
        updateIfUnlocked('brandName', e.brand_name);
        updateIfUnlocked('amazonCompliant', !!e.amazon_compliant);
    }
}
