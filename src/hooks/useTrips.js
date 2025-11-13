"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to fetch user's saved trips
 * @returns {Object} trips array, loading state, error state, and refetch function
 */
export function useTrips() {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrips = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user/trips");
      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error || "Failed to fetch trips");
      }

      setTrips(result.trips || []);
    } catch (err) {
      setError(err.message);
      setTrips([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return { 
    trips, 
    isLoading, 
    error, 
    refetch: fetchTrips 
  };
}
