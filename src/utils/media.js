export const resolveMediaUrl = (value, fallback = "") => {
    if (typeof value !== "string") return fallback;
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
        return trimmed;
    }
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

export const getProductImageUrl = (product, fallback = "") => {
    return resolveMediaUrl(product?.image || product?.imageUrl, fallback);
};

// Inline SVG placeholder — never triggers another network request, so it can't itself fail.
export const PLACEHOLDER_IMAGE =
    "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' fill='%239ca3af' font-family='sans-serif' font-size='20' text-anchor='middle' dominant-baseline='middle'%3EImage unavailable%3C/text%3E%3C/svg%3E";

// Attach as <img onError={handleImageError}>. Swaps in the placeholder and clears the
// handler so a permanently-broken URL can't retry-loop.
export const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = PLACEHOLDER_IMAGE;
};