"use client";
import {useEffect, useRef, useState} from "react";
import { safeGetLS, safeSetLS } from "@/utils/cache";
import {id} from "zod/locales";

export function useDetailsFetcher(
    plannedIds,
    detailsCache,
    setDetailsCache,
    isHydrated = true,
    cacheKey = null,
    isIdsReady = true
) {
    const inFlightRef = useRef(new Set());
    const cacheRef = useRef(detailsCache);
    cacheRef.current = detailsCache;

    const retryCountRef = useRef(0);
    const [retryTick, setRetryTick] = useState(0);

    useEffect(() => {
        if (!isHydrated || !isIdsReady || !plannedIds?.length) return;

        let cancelled = false;
        const controller = new AbortController();
        const pendingUpdates = {};
        let anyFetchFailed = false;

        // Load cached data from localStorage if available
        const loadPersistedCache = () => {
            try {
                if (!cacheKey) return {};
                const raw = safeGetLS(cacheKey);
                return raw?.detailsCache && typeof raw.detailsCache === "object"
                    ? raw.detailsCache
                    : {};
            } catch {
                return {};
            }
        };

        // Combine LS cache + in-memory cache
        const persisted = loadPersistedCache();

        // Merge persisted into React state so UI can use cached details immediately.
        // Only skip merging when prev already has meaningful data (info/image) for each persisted key.
        if (Object.keys(persisted).length > 0) {
            setDetailsCache((prev) => {
                const missing = Object.keys(persisted).some((k) => {
                    const p = prev?.[k];
                    // consider prev missing if it lacks info AND image
                    return !(p && (p.info || p.image));
                });
                if (!missing) return prev;
                // persisted first so local state (possibly partial) gets overridden by persisted real details
                return { ...persisted, ...prev };
            });
        }

        const currentCache = { ...persisted, ...cacheRef.current };
        cacheRef.current = currentCache;

        // Find IDs that still need fetching — treat an entry as "satisfied" only when it has info or image.
        const toFetch = plannedIds.filter((id) => {
            const entry = currentCache[id];
            const hasUseful = entry && (entry.info || entry.image);
            return !hasUseful && !inFlightRef.current.has(id);
        });

        if (!toFetch.length) return;

        // Mark IDs as in-progress
        toFetch.forEach((id) => inFlightRef.current.add(id));

        // Fetch location details + image
        const fetchDetails = async (id) => {
            try {
                // Details
                const infoRes = await fetch(`/api/location/details?locationId=${id}`, {
                    signal: controller.signal,
                });
                if (!infoRes.ok) throw new Error(`Failed details for ${id}`);
                const info = await infoRes.json();

                // Optional image
                let image = null;
                try {
                    const imgRes = await fetch(`/api/location/image?locationId=${id}`, {
                        signal: controller.signal,
                    });
                    if (imgRes.ok) {
                        const data = await imgRes.json();
                        image = typeof data === "string" ? data : data?.url || null;
                    }
                } catch {
                    // Ignore image errors
                }

                if (!cancelled) {
                    pendingUpdates[id] = {
                        ...cacheRef.current[id],
                        info: cacheRef.current[id]?.info || info,
                        image: image ?? cacheRef.current[id]?.image ?? null,
                    };
                }
            } catch (err) {
                anyFetchFailed = true;
                if (!cancelled) console.error(`Details fetch failed: ${id}`, err);
            } finally {
                inFlightRef.current.delete(id);
            }
        };

        // Process queue, one at a time with delay
        const CONCURRENCY = 1;
        const DELAY = 25;
        const queue = [...toFetch];

        const worker = async () => {
            while (!cancelled && queue.length) {
                const id = queue.shift();
                await fetchDetails(id);
                await new Promise((res) => setTimeout(res, DELAY));
            }
        };

        Promise.all(Array.from({ length: CONCURRENCY }, worker))
            .then(() => {
                if (cancelled) return;

                if (Object.keys(pendingUpdates).length > 0) {
                    setDetailsCache((prev) => {
                        const updated = { ...prev, ...pendingUpdates };

                        if (cacheKey) {
                            try {
                                const raw = safeGetLS(cacheKey) || {};
                                safeSetLS(cacheKey, {
                                    ...raw,
                                    ts: Date.now(),
                                    detailsCache: { ...(raw.detailsCache || {}), ...updated },
                                });
                            } catch {
                                // ignore storage errors
                            }
                        }
                        return updated;
                    });
                    // reset retry counter on success
                    retryCountRef.current = 0;
                } else if (anyFetchFailed && retryCountRef.current < 3) {
                    // schedule a retry after a short delay
                    retryCountRef.current += 1;
                    setTimeout(() => {
                        if (!cancelled) setRetryTick((t) => t + 1);
                    }, 1500 * retryCountRef.current);
                }
            })
            .catch((err) => !cancelled && console.error("Worker error:", err));

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [cacheKey, isHydrated, isIdsReady, plannedIds, setDetailsCache]);
}
