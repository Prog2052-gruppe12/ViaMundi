import React from 'react';
import {Logo} from "@/components/common/Logo";
import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="flex flex-col gap-6 items-center w-full h-fit py-12 bg-white/75 mt-24">
            <div>
                <Logo/>
            </div>
            <div className="flex flex-row gap-6">
                <Link href="/" className="hover:underline underline-offset-2">Hjem</Link>
                <Link href="/finn-reise" className="hover:underline underline-offset-2">Finn reise</Link>
                <Link href="/sporsmal" className="hover:underline underline-offset-2">Spørsmål</Link>
                <Link href="/teknologi" className="hover:underline underline-offset-2">Teknologi</Link>
                <Link href="/om-oss" className="hover:underline underline-offset-2">Om oss</Link>
            </div>
            <div>
                <span>© 2025 ViaMundi. Alle rettigheter forbeholdes.</span>
            </div>
        </footer>
    )
}