export const CACHE_VERSION = 1;
export const MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes

export function makeCacheKey({ destination, dateFrom, dateTo, interests }) {
    return `tripcache/v${CACHE_VERSION}:${destination || ""}|${dateFrom || ""}|${dateTo || ""}|${interests || ""}`;
}

export function safeGetLS(key) {
    try {
        if (typeof window === "undefined") return null;
        const raw = window.localStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function safeSetLS(key, value) {
    try {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Ignore quota / privacy errors
    }
}
