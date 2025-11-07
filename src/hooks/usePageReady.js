"use client";

import { useEffect, useState } from "react";

/**
 * Tracks when the page is ready to render:
 * - requires isHydrated
 * - interests fetch finished
 * - ids ready
 * - details ready
 */
export function usePageReady({ isHydrated, isFetchingInterests, idsReady, isDetailsReady }) {
    const [pageReady, setPageReady] = useState(false);

    useEffect(() => {
        if (isHydrated && !isFetchingInterests && idsReady && isDetailsReady) {
            setPageReady(true);
        }
    }, [isHydrated, isFetchingInterests, idsReady, isDetailsReady]);

    return { pageReady };
}
