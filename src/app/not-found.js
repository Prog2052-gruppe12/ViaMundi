"use client";

import Link from "next/link";
import { MapPinOff } from "lucide-react";


// global not found page alle ikke valid routs/url blir sendt her.
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <MapPinOff className="h-20 w-20 text-gray-400" />
        </div>
        <h2 className="text-6xl font-bold text-gray-900 mb-4">404</h2>
        <h1 className="text-2xl font-semibold text-gray-700 mb-6">
          Siden finnes ikke
        </h1>
        <p className="text-gray-600 mb-8">
          Beklager, men siden du leter etter eksisterer ikke.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          Gå til forsiden
        </Link>
      </div>
    </div>
  );
}