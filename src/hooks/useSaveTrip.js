"use client";

import { useState } from "react";

/**
 * Custom hook for saving trips to user's collection
 * @returns {Object} saveTrip function, loading state, and error state
 */
export function useSaveTrip() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const saveTrip = async (tripData) => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/user/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
      });

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error || "Failed to save trip");
      }

      return { success: true, tripId: result.tripId };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsSaving(false);
    }
  };

  return { saveTrip, isSaving, error };
}
