/**
 * Safely maps the Assistant's final JSON response to the Banner Generator state.
 */
export function mapBannerResponseToState(final: any, currentState: any, setField: (field: string, value: any) => void) {
    if (!final) return;

    const updateIfUnlocked = (field: string, newValue: any) => {
        if (newValue !== undefined && newValue !== null) {
            setField(field, newValue);
        }
    };

    // Handle common field names from different API versions
    updateIfUnlocked('brandName', final.brand_name || final.brand);
    updateIfUnlocked('productName', final.product_name || final.product);
    updateIfUnlocked('category', final.category);
    updateIfUnlocked('targetAudience', final.target_audience || final.audience);
    updateIfUnlocked('offer', final.offer);
    updateIfUnlocked('cta', final.cta);
    updateIfUnlocked('primaryMessage', final.primary_message || final.headline);

    updateIfUnlocked('placement', final.placement);
    updateIfUnlocked('sizePreset', final.size_preset || final.dimensions);
    updateIfUnlocked('safeArea', final.safe_area);

    updateIfUnlocked('style', final.style || final.aesthetic);
    updateIfUnlocked('backgroundType', final.background_type || final.background);
    updateIfUnlocked('brandColors', final.brand_colors || final.colors);
    updateIfUnlocked('props', final.props || final.elements);

    if (final.rules) {
        updateIfUnlocked('noWatermark', final.rules.no_watermark);
        updateIfUnlocked('noArtifacts', final.rules.no_artifacts);
        updateIfUnlocked('noDistortedLogos', final.rules.no_distorted_logos);
        updateIfUnlocked('avoidMisleading', final.rules.avoid_misleading);
    }
}
