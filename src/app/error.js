"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

// global error page. Alle uhåndterete feil blir sendt her.
export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-20 w-20 text-gray-400" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-700 mb-6">
          Noe gikk galt
        </h1>
        <p className="text-gray-600 mb-8">
          Beklager, det oppstod en feil. Prøv å laste siden på nytt.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          Prøv igjen
        </button>
      </div>
    </div>
  );
}
