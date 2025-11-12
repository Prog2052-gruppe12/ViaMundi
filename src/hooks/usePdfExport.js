"use client";

import { useState } from "react";

/**
 * Custom hook for exporting trip data to PDF using @react-pdf/renderer
 * @returns {Object} exportPdf function, loading state, and error state
 */
export function usePdfExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  const exportPdf = async (trip) => {
    setIsExporting(true);
    setError(null);

    try {
      // Dynamic import to avoid SSR issues
      const { pdf } = await import("@react-pdf/renderer");
      const { TripPdfDocument } = await import("@/components/features/trips/TripPdfDocument");

      // Generate PDF blob
      const blob = await pdf(<TripPdfDocument trip={trip} />).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      const cityName = trip.metadata?.cityName || trip.destination;
      link.download = `${cityName.replace(/[^a-z0-9]/gi, "_")}_${trip.dateFrom}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { success: true };
    } catch (err) {
      console.error("PDF export error:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsExporting(false);
    }
  };

  return { exportPdf, isExporting, error };
}
