import React from "react";
import Link from "next/link";

export const Nav = () => {
    return (
        <nav className="flex items-center justify-center space-x-8 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-full shadow-sm">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Hjem
            </Link>
            <Link href="/finn-reise" className="text-gray-600 hover:text-gray-900 transition-colors">
                Finn reise
            </Link>
            <Link href="/sporsmal" className="text-gray-600 hover:text-gray-900 transition-colors">
                Spørsmål
            </Link>
            <Link href="/teknologi" className="text-gray-600 hover:text-gray-900 transition-colors">
                Teknologi
            </Link>
            <Link href="/om-oss" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Om oss
            </Link>
        </nav>
    )
}