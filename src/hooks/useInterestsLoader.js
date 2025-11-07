"use client";

import { useEffect, useState } from "react";

/**
 * Loads AI-summarized interests (with cache + fallbacks).
 * Returns { interests, isFetchingInterests }.
 */
export function useInterestsLoader({
                                       destination,
                                       dateFrom,
                                       dateTo,
                                       travelers,
                                       interestsFromUrl,
                                       isHydrated,
                                       interestsCache,
                                       setInterestsCache,
                                   }) {
    const [interests, setInterests] = useState(null);
    const [isFetchingInterests, setIsFetchingInterests] = useState(false);

    useEffect(() => {
        // prerequisites
        if (!destination || !dateFrom || !dateTo || !isHydrated) return;

        // cached value wins
        if (interestsCache) {
            setInterests(interestsCache);
            return;
        }

        const ctrl = new AbortController();

        const run = async () => {
            try {
                setIsFetchingInterests(true);
                const res = await fetch("/api/ai/summarize", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        destination,
                        dateFrom,
                        dateTo,
                        travelers,
                        interests: interestsFromUrl,
                    }),
                    signal: ctrl.signal,
                });

                if (!res.ok) {
                    // fall back to using raw URL interests downstream
                    setInterests(null);
                    return;
                }

                const data = await res.json();
                const value = data?.data?.queries?.[0] || "";
                setInterests(value || null);
                setInterestsCache?.(value || "");
            } catch (e) {
                if (e.name !== "AbortError") {
                    // fallback: allow fetching with interestsFromUrl
                    setInterests(null);
                }
            } finally {
                setIsFetchingInterests(false);
            }
        };

        run().then();
        return () => ctrl.abort();
    }, [
        destination,
        dateFrom,
        dateTo,
        travelers,
        interestsFromUrl,
        isHydrated,
        interestsCache,
        setInterestsCache,
    ]);

    return { interests, isFetchingInterests };
}
