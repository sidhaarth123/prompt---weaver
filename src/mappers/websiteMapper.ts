/**
 * Safely maps the Assistant's final JSON response to the Website Generator state.
 */
export function mapWebsiteResponseToState(final: any, currentState: any, setField: (field: string, value: any) => void) {
    if (!final) return;

    const updateIfUnlocked = (field: string, newValue: any) => {
        if (newValue !== undefined && newValue !== null) {
            setField(field, newValue);
        }
    };

    const e = final.brand || final.ecom || final;

    updateIfUnlocked('brandName', e.name || e.brand_name);
    updateIfUnlocked('productType', e.type || e.product_type);
    updateIfUnlocked('businessModel', e.model || e.business_model);
    updateIfUnlocked('targetMarket', e.target || e.target_market);
    updateIfUnlocked('priceRange', e.price || e.price_range);
    updateIfUnlocked('usp', e.usp);
    updateIfUnlocked('brandPersonality', e.personality || e.brand_personality);

    const b = final.business || final;
    updateIfUnlocked('currency', b.currency);
    updateIfUnlocked('shippingRegions', b.shipping || b.shipping_regions);

    if (b.payments || b.payment_integrations) {
        updateIfUnlocked('paymentIntegrations', b.payments || b.payment_integrations);
    }

    const t = final.tech || final;
    updateIfUnlocked('techStack', t.stack || t.tech_stack);
    updateIfUnlocked('ecomPlatform', t.platform || t.ecommerce_platform);
    updateIfUnlocked('style', t.visual_style || t.style);

    const s = final.strategy || final;
    updateIfUnlocked('conversionGoal', s.goal || s.conversion_goal);
    updateIfUnlocked('funnelType', s.funnel || s.funnel_type);
    updateIfUnlocked('trafficSource', s.traffic || s.traffic_source);

    if (final.structure || final.structure_sections) {
        updateIfUnlocked('selectedSections', final.structure || final.structure_sections);
    }

    const c = final.conversion || final;
    updateIfUnlocked('psychologyStyle', c.psychology || c.psychology_style);
    updateIfUnlocked('urgencyStrategy', c.urgency || c.urgency_strategy);
    updateIfUnlocked('upsellStrategy', c.upsell || c.upsell_strategy);

    if (c.trust || c.trust_elements) {
        updateIfUnlocked('trustElements', c.trust || c.trust_elements);
    }
}
