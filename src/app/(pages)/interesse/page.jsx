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
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form";
import {ChevronDown, ChevronUp, CircleX, Trash, X, Volleyball} from "lucide-react";
import {cn} from "@/utils/cn";

function InterestContent() {
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
        { id: "culture", label: "Kultur" }
    ];

    const [selectedOptions, setSelectedOptions] = useState({
        nightLife: false,
        history: false,
        nature: false,
        food: false,
        culture: false
    });

    const handleCheckedChange = (id, value) => {
        const updated = {
            ...selectedOptions,
            [id]: value,
        };
        setSelectedOptions(updated);
        form.setValue("interests", updated);
    };

    const clearSelections = e => {
        e.preventDefault();
        const cleared = Object.keys(selectedOptions).reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {});
        setSelectedOptions(cleared);
    };

    const selectedLabels = options
        .filter(opt => selectedOptions[opt.id])
        .map(opt => opt.label);

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
                culture: z.boolean()
            })
            .refine(
                interests => Object.values(interests).some(Boolean),
                { message: "Velg minst én interesse" }
            ),
        other: z.string().optional()
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            interests: selectedOptions,
            other: ""
        },
        shouldFocusError: false
    });

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const onSubmit = async data => {
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
                other: data.other || ""
            });

            router.push(`/resultat?${params.toString()}`);
        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col items-center w-full h-fit gap-y-12"
                >

                    <Section>
                        <h1 className="font-bold text-4xl md:text-5xl text-center text-primary-foreground">
                            Hva er dine interesser?
                        </h1>
                        <div
                            className="flex md:flex-row md:items-end flex-col w-full h-full py-4 px-4 rounded-xl bg-card/20 text-popover-foreground gap-2">
                            {/* Interesser dropdown */}
                            <FormField
                                control={form.control}
                                name="interests"
                                render={() => {
                                    const [open, setOpen] = useState(false);

                                    return (
                                        <FormItem className="w-full">
                                        <div className="flex flex-col w-full gap-1">
                                            <FormLabel className="text-card font-bold text-sm">Interesser</FormLabel>
                                            <DropdownMenu open={open} onOpenChange={setOpen}>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="fake"
                                                        type="button"
                                                        className={cn(
                                                            `bg-card w-full justify-between rounded-md py-5 !px-3 text-md ${textColorClass} ${
                                                                form.formState.errors.interests ? "ring-[3px] ring-destructive/30" : ""
                                                            }`
                                                        )
                                                        }
                                                    >
                                                        <div className="flex flex-row items-center gap-3">
                                                            <Volleyball strokeWidth={2}/>
                                                            {displayText}
                                                        </div>
                                                        {open ? <ChevronUp/> : <ChevronDown/>}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) border-none !p-0">
                                                    <div className="pt-3 pb-2 px-3 text-xs text-muted-foreground font-bold">
                                                        Interesser
                                                    </div>
                                                    <div className="px-1 pb-2">
                                                        {options.map(option => (
                                                            <DropdownMenuCheckboxItem
                                                                key={option.id}
                                                                checked={selectedOptions[option.id]}
                                                                onSelect={(e) => e.preventDefault()}
                                                                onCheckedChange={value =>
                                                                    handleCheckedChange(option.id, value)
                                                                }
                                                            >
                                                                {option.label}
                                                            </DropdownMenuCheckboxItem>
                                                        ))}
                                                    </div>

                                                    {/* Clear and close buttons */}
                                                    <div className="bg-popover border-t w-full p-2 flex justify-between gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="default"
                                                            className="rounded-md"
                                                            size="sm"
                                                            onClick={() => {
                                                                setOpen(false);
                                                            }}
                                                        >
                                                            <CircleX /> Lukk
                                                        </Button>
                                                        {selectedLabels.length > 0 && (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                className="rounded-md"
                                                                size="sm"
                                                                onClick={clearSelections}
                                                            >
                                                                <Trash /> Tøm
                                                            </Button>
                                                        )}
                                                    </div>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </FormItem>
                                    )
                                }}
                            />

                            {/* Annet input */}
                            <FormField
                                control={form.control}
                                name="other"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <div className="flex flex-col w-full gap-1">
                                            <FormLabel className="text-card font-bold text-sm">Annet</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    className="bg-card text-md font-medium w-full"
                                                    placeholder="Annet..."
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
                                className="w-full md:w-fit mt-2"
                                disabled={loading}
                            >
                                Søk
                            </Button>
                        </div>
                    </Section>
                </form>
            </Form>
        </div>
    );
}

export default function Interest() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Laster...</div>}>
            <InterestContent />
        </Suspense>
    );
}
