/**
 * Safely maps the Assistant's final JSON response to the Image Generator state.
 */
export function mapImageResponseToState(final: any, currentState: any, setField: (field: string, value: any) => void) {
    if (!final) return;

    const updateIfUnlocked = (field: string, newValue: any) => {
        // Only update if value exists in response and isn't null/undefined
        if (newValue !== undefined && newValue !== null) {
            setField(field, newValue);
        }
    };

    if (final.context_format) {
        updateIfUnlocked('platform', final.context_format.platform);
        updateIfUnlocked('aspectRatio', final.context_format.aspect_ratio);
    }

    if (final.product_brief) {
        updateIfUnlocked('productName', final.product_brief.product_name);
        updateIfUnlocked('category', final.product_brief.category);
        updateIfUnlocked('brandName', final.product_brief.brand_name);
        updateIfUnlocked('targetCustomer', final.product_brief.target_customer);
        updateIfUnlocked('benefits', final.product_brief.key_benefits_usp);
        updateIfUnlocked('offerBadge', final.product_brief.offer_badge);
        updateIfUnlocked('variants', final.product_brief.product_variants);
    }

    if (final.listing_ad_specs) {
        updateIfUnlocked('useCase', final.listing_ad_specs.use_case);
        updateIfUnlocked('shootType', final.listing_ad_specs.shoot_type);
        updateIfUnlocked('amazonCompliant', final.listing_ad_specs.amazon_compliant_mode);
        updateIfUnlocked('textOverlay', final.listing_ad_specs.text_overlay);
        updateIfUnlocked('brandColors', final.listing_ad_specs.brand_colors);
        updateIfUnlocked('surface', final.listing_ad_specs.background_surface);
        updateIfUnlocked('props', final.listing_ad_specs.props);
        updateIfUnlocked('lightingMood', final.listing_ad_specs.lighting_mood);
        updateIfUnlocked('framing', final.listing_ad_specs.camera_framing);
        updateIfUnlocked('compositionNotes', final.listing_ad_specs.composition_notes);
        updateIfUnlocked('headline', final.listing_ad_specs.headline_text);
        updateIfUnlocked('cta', final.listing_ad_specs.cta_text);

        // Safety check for rules
        const rules = final.listing_ad_specs;
        if (rules.no_watermark !== undefined) setField('rule_noWatermark', rules.no_watermark);
        if (rules.no_extra_text !== undefined) setField('rule_noExtraText', rules.no_extra_text);
        if (rules.no_distorted_logos !== undefined) setField('rule_noDistortedLogos', rules.no_distorted_logos);
        if (rules.avoid_claims !== undefined) setField('rule_avoidClaims', rules.avoid_claims);
    }

    if (final.subject_details) {
        updateIfUnlocked('subject', final.subject_details.subject_description);
        updateIfUnlocked('style', final.subject_details.art_style);
        updateIfUnlocked('background', final.subject_details.background_scene);
    }

    if (final.composition) {
        updateIfUnlocked('lighting', final.composition.lighting);
        updateIfUnlocked('camera', final.composition.camera_angle);
        updateIfUnlocked('negative', final.composition.negative_prompt);
    }
}
