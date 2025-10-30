"use client";

import { Section } from "@/components/common/Section";
import { useSearchParams } from "next/navigation";
import { SearchParameters } from "@/components/features/searchParameters/SearchParameters";
import React, { useEffect, useState } from "react";
import { getCityName } from "@/utils/cityFromDest";
import LoadingPage from "@/app/loading";
import LocationView from "@/components/features/travelPlan/LocationInfo";

export default function ResultContent() {
    const searchParams = useSearchParams();
    const destination = searchParams.get("destination");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const travelers = searchParams.get("travelers");
    const interests = searchParams.get("interests");

    // Store location data in an object keyed by ID
    const [locations, setLocations] = useState({});
    const [locationIds, setLocationIds] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Helper to update one location entry
    const updateLocation = (id, data) => {
        setLocations(prev => ({ ...prev, [id]: { ...prev[id], ...data } }));
    };

    // Load cached data from localStorage (if available)
    useEffect(() => {
        const cacheKey = `travelResults_${destination}_${interests}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
            const parsed = JSON.parse(cached);
            setLocationIds(parsed.locationIds || []);
            setLocations(parsed.locations || {});
            setLoading(false);
            return;
        }

        async function fetchAttractions() {
            try {
                setLoading(true);
                const city = getCityName(destination);
                const params = new URLSearchParams({
                    destination: city || "",
                    interests: interests || "",
                });

                const res = await fetch(`/api/attractions?${params.toString()}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Failed to fetch attractions");
                setLocationIds(data["location_ids"]);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (destination && interests) fetchAttractions().then();
    }, [destination, interests]);

    // Fetch location details + images if not cached
    useEffect(() => {
        if (locationIds.length === 0) return;

        const cacheKey = `travelResults_${destination}_${interests}`;
        const fetchData = async () => {
            try {
                setLoading(true);
                for (const locationId of locationIds) {
                    // Skip fetch if we already have cached data
                    if (locations[locationId]?.info && locations[locationId]?.image) continue;

                    const [infoRes, imgRes] = await Promise.all([
                        fetch(`/api/location/details?locationId=${locationId}`),
                        fetch(`/api/location/image?locationId=${locationId}`),
                    ]);

                    const infoData = await infoRes.json();
                    const imgData = await imgRes.json();

                    if (!infoRes.ok) throw new Error(infoData.error || "Failed to fetch location info");
                    if (!imgRes.ok) throw new Error(imgData.error || "Failed to fetch location image");

                    updateLocation(locationId, { info: infoData, image: imgData });
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData().then();
    }, [locationIds]);

    // Persist fetched data to localStorage
    useEffect(() => {
        if (locationIds.length > 0 && Object.keys(locations).length > 0) {
            const cacheKey = `travelResults_${destination}_${interests}`;
            const dataToCache = {
                locationIds,
                locations,
                cachedAt: Date.now(),
            };
            localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
        }
    }, [locationIds, locations]);

    if (loading) return <LoadingPage />;

    return (
        <div className="flex flex-col items-center w-full h-fit gap-y-12">
            <Section>
                <SearchParameters
                    destination={destination}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    travelers={travelers}
                    interests={interests}
                />

                <h1 className="font-bold text-4xl text-center text-primary-foreground">Reiseplan</h1>

                {error && <p className="text-red-500 mt-4">Error: {error}</p>}

                {/*
                {!loading && locationIds.length > 0 && (
                    <div className="mt-4 text-sm text-gray-700 bg-gray-100 p-4 rounded-xl w-full">
                        <h2 className="text-lg font-semibold mb-2">Attraction Results</h2>
                        {locationIds.map(id => (
                            <p key={id}>LocationID: <span>{id}</span></p>
                        ))}
                    </div>
                )}
                */}

                {!loading && locationIds.length > 0 && (
                    <div className="w-full h-fit flex flex-col gap-4">
                        {locationIds.map(id => {
                            const loc = locations[id];
                            if (!loc?.info) return null;
                            return (
                                <div key={id}>
                                    <LocationView info={loc.info} image={loc.image} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </Section>
        </div>
    );
}
