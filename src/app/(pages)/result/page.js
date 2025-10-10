"use client";

import {Section} from "@/components/common/Section";
import { useSearchParams } from "next/navigation";

export default function Result() {
    const searchParams = useSearchParams();
    const destination = searchParams.get("destination");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const travelers = searchParams.get("travelers");
    const interests = searchParams.get("interests");

    return (
        <div className="flex flex-col items-center w-full h-fit gap-y-12">
            <Section>
                <h1 className="font-bold text-4xl text-center text-primary-foreground">Hva er dine interesser?</h1>
                <p>Reisemål: {destination}</p>
                <p>Fra: {new Date(dateFrom).toLocaleDateString()}</p>
                <p>Til: {new Date(dateTo).toLocaleDateString()}</p>
                <p>Antall reisende: {travelers}</p>
                <p>Interesser: {interests}</p>
            </Section>
        </div>
    );
}