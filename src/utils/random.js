/** Small stable hash for seeding random picks (no crypto, just stable) */
export function hashString(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

/** Simple seeded RNG (mulberry32) */
export function rng(seed) {
    return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** Pick N items from array using seeded randomness, allowing repeats if needed */
export function pickSeeded(arr, count, seedKey) {
    const r = rng(hashString(seedKey));
    const copy = [...arr];
    const chosen = [];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    for (let i = 0; i < count; i++) {
        if (i < copy.length) chosen.push(copy[i]);
        else if (copy.length > 0) chosen.push(copy[Math.floor(r() * copy.length)]);
        else chosen.push(undefined);
    }
    return chosen;
}
