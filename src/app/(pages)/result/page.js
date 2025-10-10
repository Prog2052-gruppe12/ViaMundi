"use client";

import {Section} from "@/components/common/Section";
import { useSearchParams } from "next/navigation";
import {SearchParameters} from "@/components/features/searchParameters/SearchParameters";
import React from "react";

import { usePathname } from 'next/navigation'

import { getAttractions } from "@/app/api/getAttractions/route"

export default function Result() {
    const searchParams = useSearchParams();
    const destination = searchParams.get("destination");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const travelers = searchParams.get("travelers");
    const interests = searchParams.get("interests");

    console.log(getAttractions(searchParams));

    return (
        <div className="flex flex-col items-center w-full h-fit gap-y-12">
            <SearchParameters
                destination={destination}
                dateFrom={dateFrom}
                dateTo={dateTo}
                travelers={travelers}
                interests={interests}
            />
            <Section>
                <h1 className="font-bold text-4xl text-center text-primary-foreground">
                    Reiseplan
                </h1>

            </Section>
        </div>
    );
}