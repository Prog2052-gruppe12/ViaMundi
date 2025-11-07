"use client";

import { useMemo } from "react";

/**
 * Determines if details are ready for rendering.
 * - Requires idsReady to be true first.
 * - If no plannedIds, considered ready.
 * - Otherwise, every plannedId must have detailsCache entry with info or image.
 */
export function useDetailsReady({ idsReady, plannedIds, detailsCache }) {
    const plannedIdsKey = Array.isArray(plannedIds)
        ? plannedIds.join("|")
        : String(plannedIds ?? "");

    const isDetailsReady = useMemo(() => {
        if (!idsReady) return false;
        if (!plannedIds || plannedIds.length === 0) return true;

        return plannedIds.every((id) => {
            const entry = detailsCache?.[id];
            return Boolean(entry && (entry.info || entry.image));
        });
    }, [idsReady, plannedIds, detailsCache]);

    return { isDetailsReady };
}
