"use client";

import { FiAlertTriangle } from "react-icons/fi";
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
          <FiAlertTriangle className="h-20 w-20 text-gray-600" />
        </div>
        <h1 className="text-2xl font-semibold text-black mb-6">
          Noe gikk galt
        </h1>
        <p className="text-gray-600 mb-8">
          Beklager, det oppstod en feil. Prøv å laste siden på nytt.
        </p>
        <button
          onClick={() => reset()}
          className="bg-black text-white px-6 py-2 rounded-md"
        >
          Prøv igjen
        </button>
      </div>
    </div>
  );
}