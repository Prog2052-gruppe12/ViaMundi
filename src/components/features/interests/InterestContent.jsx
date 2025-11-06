"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Section } from "@/components/common/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import LoadingPage from "@/app/loading";

import { formSchema } from "./schema";
import { INTEREST_OPTIONS } from "./constants";
import { InterestDropdown } from "./InterestDropdown";

export default function InterestContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            interests: Object.fromEntries(INTEREST_OPTIONS.map((opt) => [opt.id, false])),
            other: "",
        },
    });

    const selected = form.watch("interests");
    const clearInterests = () => {
        form.setValue(
            "interests",
            Object.fromEntries(INTEREST_OPTIONS.map((opt) => [opt.id, false]))
        );
    };

    const onSubmit = (data) => {
        setLoading(true);
        const selectedLabels = INTEREST_OPTIONS.filter((opt) => data.interests[opt.id]).map(
            (opt) => opt.label
        );

        const params = new URLSearchParams({
            destination: searchParams.get("destination") || "",
            dateFrom: searchParams.get("dateFrom") || "",
            dateTo: searchParams.get("dateTo") || "",
            travelers: searchParams.get("travelers") || "",
            interests: selectedLabels.join(","),
            other: data.other || "",
        });

        router.push(`/resultat?${params.toString()}`);
        setLoading(false);
    };

    if (loading) return <LoadingPage />;

    return (
        <Section>
            <h1 className="font-bold text-4xl md:text-5xl text-center text-primary-foreground">
                Hva er dine interesser?
            </h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center w-full h-fit gap-y-12">
                    <div className="flex md:flex-row md:items-end flex-col w-full h-full py-4 px-4 rounded-xl bg-card/20 ring-2 ring-card/30 text-popover-foreground gap-2">
                        <InterestDropdown form={form} selected={selected} onClear={clearInterests} />
                        <FormField
                            control={form.control}
                            name="other"
                            render={({ field }) => (
                                <FormItem className="w-full md:w-2/3">
                                    <div className="flex flex-col w-full gap-1">
                                        <FormLabel className="text-card font-bold text-sm">Annet</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                className="bg-card text-md font-medium"
                                                placeholder="Annet..."
                                            />
                                        </FormControl>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <Button variant="secondary" type="submit" className="mt-2 md:m-0">
                            Videre
                        </Button>
                    </div>
                </form>
            </Form>
        </Section>
    );
}
