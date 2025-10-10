"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import { Section } from "@/components/common/Section";
import { SearchParameters } from "@/components/features/searchParameters/SearchParameters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { ChevronDown, ChevronUp, X } from "lucide-react";

function InterestInner() {
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    const destination = searchParams.get("destination") || "";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";
    const travelers = searchParams.get("travelers") || "";

    const options = [
        { id: "nightLife", label: "Nattliv" },
        { id: "history", label: "Historie" },
        { id: "nature", label: "Natur" },
        { id: "food", label: "Mat" },
        { id: "culture", label: "Kultur" },
    ];

    const [selectedOptions, setSelectedOptions] = useState({
        nightLife: false,
        history: false,
        nature: false,
        food: false,
        culture: false,
    });

    const [open, setOpen] = useState(false);

    const handleCheckedChange = (id, value) => {
        const updated = { ...selectedOptions, [id]: value };
        setSelectedOptions(updated);
        form.setValue("interests", updated);
    };

    const clearSelections = (e) => {
        e.preventDefault();
        const cleared = Object.keys(selectedOptions).reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {});
        setSelectedOptions(cleared);
    };

    const selectedLabels = options
        .filter((opt) => selectedOptions[opt.id])
        .map((opt) => opt.label);

    const displayText =
        selectedLabels.length > 0 ? selectedLabels.join(", ") : "Velg...";

    const textColorClass =
        selectedLabels.length > 0 ? "text-primary" : "text-muted-foreground";

    const formSchema = z.object({
        interests: z
            .object({
                nightLife: z.boolean(),
                history: z.boolean(),
                nature: z.boolean(),
                food: z.boolean(),
                culture: z.boolean(),
            })
            .refine(
                (interests) => Object.values(interests).some(Boolean),
                { message: "Velg minst én interesse" }
            ),
        other: z.string().optional(),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            interests: selectedOptions,
            other: "",
        },
        shouldFocusError: false,
    });

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const onSubmit = async (data) => {
        setLoading(true);
        await sleep(500);

        try {
            formSchema.parse(data);

            const params = new URLSearchParams({
                destination,
                dateFrom,
                dateTo,
                travelers,
                interests: selectedLabels,
                other: data.other || "",
            });

            router.push(`/result?${params.toString()}`);
        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col items-center w-full h-fit gap-y-12"
            >
                <SearchParameters
                    destination={destination}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    travelers={travelers}
                />
                <Section>
                    <h1 className="font-bold text-4xl text-center text-primary-foreground">
                        Hva er dine interesser?
                    </h1>
                    <div className="flex md:flex-row md:items-end flex-col w-full h-full py-4 px-4 rounded-xl bg-card/20 text-popover-foreground gap-x-2 gap-y-4">
                        {/* Interesser dropdown */}
                        <FormField
                            control={form.control}
                            name="interests"
                            render={() => (
                                <FormItem className="w-full">
                                    <div className="flex flex-col w-full gap-2">
                                        <FormLabel className="text-card font-bold">
                                            Interesser
                                        </FormLabel>
                                        <DropdownMenu open={open} onOpenChange={setOpen}>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="fake"
                                                    type="button"
                                                    className={`bg-card w-full justify-between rounded-md py-5 text-md px-3 ${textColorClass} ${
                                                        form.formState.errors.interests
                                                            ? "ring-[3px] ring-destructive/30"
                                                            : ""
                                                    }`}
                                                >
                                                    <span className="truncate text-left">{displayText}</span>
                                                    {open ? <ChevronUp /> : <ChevronDown />}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
                                                <DropdownMenuLabel>Interesser</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                {options.map((option) => (
                                                    <DropdownMenuCheckboxItem
                                                        key={option.id}
                                                        checked={selectedOptions[option.id]}
                                                        onCheckedChange={(value) =>
                                                            handleCheckedChange(option.id, value)
                                                        }
                                                        className="hover:bg-accent/20"
                                                    >
                                                        {option.label}
                                                    </DropdownMenuCheckboxItem>
                                                ))}
                                                {selectedLabels.length > 0 && (
                                                    <>
                                                        <DropdownMenuSeparator />
                                                        <div className="flex justify-center py-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                type="button"
                                                                className="rounded-full border border-destructive/80 hover:border-accent text-destructive hover:text-card"
                                                                onClick={clearSelections}
                                                            >
                                                                <X className="w-4 h-4 mr-1" />
                                                                Fjern valg
                                                            </Button>
                                                        </div>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Annet input */}
                        <FormField
                            control={form.control}
                            name="other"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <div className="flex flex-col w-full gap-2">
                                        <FormLabel className="text-card font-bold">Annet</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                className="bg-card text-md font-medium w-full"
                                                placeholder="Interesser..."
                                            />
                                        </FormControl>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Submit button */}
                        <Button
                            variant="secondary"
                            type="submit"
                            className="w-full md:w-fit"
                            disabled={loading}
                        >
                            {loading ? "Laster..." : "Lag reiseplan"}
                        </Button>
                    </div>
                </Section>
            </form>
        </Form>
    );
}

export default function Interest() {
    return (
        <Suspense fallback={<div>Laster interesser...</div>}>
            <InterestInner />
        </Suspense>
    );
}
