"use client";

import {Section} from "@/components/common/Section";
import { Loader2 } from "lucide-react"; // spinner-ikon

export default function LoadingPage() {
    return (
        <Section type="transparent">
            <div className="flex flex-col items-center justify-center w-fit px-16 py-16 text-center rounded-xl">
                <Loader2 className="w-10 h-10 animate-spin text-gray-700 mb-4" />
                <p className="text-gray-700 text-lg font-medium">Laster innhold...</p>
            </div>
        </Section>
    );
}