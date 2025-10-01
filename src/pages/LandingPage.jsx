import React from "react";
import {Section} from "@/components/Section"
import {SearchForm} from "@/components/SearchForm";

const LandingPage = () => {
    return (
        <div className="flex flex-col items-center px-38 py-12 w-full h-fit min-h-screen gap-y-12">
            <Section>
                <h1 className="font-bold text-5xl text-center text-primary-foreground">Veien til din drømmereise</h1>
                <SearchForm/>
            </Section>
        </div>
    )
}

export default LandingPage;
