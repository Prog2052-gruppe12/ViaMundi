"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DatePicker } from "./DatePicker";
import { DestinationSelect } from "./DestinationSelect";
import { TravelersInput } from "./TravelersInput";
import { formSchema } from "./schema";
import {addDays, addYears} from "date-fns";

export const SearchForm = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            destination: "",
            dateFrom: undefined,
            dateTo: undefined,
            travelers: "",
        },
    });

    const [today, setToday] = useState(null);
    const [dateMax, setDateMax] = useState(null);

    useEffect(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        setToday(d);
        setDateMax(addYears(d, 5));
    }, []);

    useEffect(() => {
        if (today && dateMax) setLoading(false);
    }, [today, dateMax]);

    const dateFromValue = form.watch("dateFrom");

    useEffect(() => {
        const dateTo = form.getValues("dateTo");
        if (dateFromValue && dateTo && dateTo < dateFromValue) {
            form.setValue("dateTo", addDays(dateFromValue, 1));
        }
    }, [dateFromValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                destination: data.destination,
                dateFrom: data.dateFrom?.toISOString(),
                dateTo: data.dateTo?.toISOString(),
                travelers: data.travelers.toString(),
            });
            router.push(`/interesse?${params.toString()}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex xl:flex-row flex-col w-full py-4 px-4 rounded-xl bg-card/20 ring-2 ring-card/30 gap-2"
            >
                <DestinationSelect label="Hvor går reisen?" form={form}/>
                <div className="flex flex-col md:flex-row w-full items-center md:items-end gap-2">

                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <DatePicker label="Dato fra" form={form} today={today} dateMax={dateMax}
                                    dateFromWatch={dateFromValue}/>

                        <DatePicker label="Dato til" form={form} today={dateFromValue} dateMax={dateMax}
                                    dateFromWatch={dateFromValue}/>
                    </div>

                    <TravelersInput label="Antall reisende" form={form}/>

                    <Button type="submit" variant="secondary" className="w-full md:w-fit mt-2" disabled={loading}>
                        {loading ? "Laster..." : "Søk"}
                    </Button>
                </div>
            </form>
        </Form>
);
};

export default SearchForm;
