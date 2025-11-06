"use client";
import { useEffect, useRef } from "react";

export function useDetailsFetcher(plannedIds, detailsCache, setDetailsCache) {
    const inFlightRef = useRef(new Set());
    const cacheRef = useRef(detailsCache);
    cacheRef.current = detailsCache;

    useEffect(() => {
        if (!plannedIds?.length) return;

        let cancelled = false;
        const controller = new AbortController();
        const pending = {}; // batch updates here

        // Find IDs that still need fetching
        const missing = plannedIds.filter(
            (id) => !cacheRef.current[id] && !inFlightRef.current.has(id)
        );
        if (!missing.length) return;

        // Mark them as in-flight
        missing.forEach((id) => inFlightRef.current.add(id));

        const CONCURRENCY = 1;
        const DELAY_MS = 250;
        const queue = [...missing];

        const fetchOne = async (id) => {
            try {
                // 1) Fetch details
                const infoRes = await fetch(`/api/location/details?locationId=${id}`, {
                    signal: controller.signal,
                });
                if (!infoRes.ok) throw new Error(`Details failed for ${id}`);
                const info = await infoRes.json();

                // 2) Fetch image (optional)
                let image = null;
                try {
                    const imgRes = await fetch(`/api/location/image?locationId=${id}`, {
                        signal: controller.signal,
                    });
                    if (imgRes.ok) {
                        const data = await imgRes.json();
                        image = typeof data === "string" ? data : data?.url || null;
                    }
                } catch (err) {
                    console.warn("Image fetch failed for", id, err);
                }

                if (!cancelled) {
                    const existing = cacheRef.current[id];

                    // ✅ Merge logic — ensures image is not skipped
                    pending[id] = {
                        ...existing,          // keep any existing info/image
                        info: existing?.info || info,
                        image: image !== null ? image : existing?.image || null,
                    };
                }
            } catch (e) {
                if (!cancelled) console.error("Details fetch failed:", id, e);
            } finally {
                inFlightRef.current.delete(id);
            }
        };

        const runWorker = async () => {
            while (queue.length && !cancelled) {
                const id = queue.shift();
                await fetchOne(id);
                await new Promise((res) => setTimeout(res, DELAY_MS));
            }
        };

        Promise.all(
            Array.from({ length: Math.min(CONCURRENCY, queue.length) }, runWorker)
        )
            .then(() => {
                if (!cancelled && Object.keys(pending).length > 0) {
                    setDetailsCache((prev) => ({
                        ...prev,
                        ...pending,
                    }));
                }
            })
            .catch(console.error);

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [plannedIds, setDetailsCache]);
}
