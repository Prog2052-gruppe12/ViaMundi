"use client";

import React, { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ChevronDown, ChevronUp, ClipboardList, CircleX, Trash } from "lucide-react";
import { INTEREST_OPTIONS } from "./constants";
import { cn } from "@/utils/cn";

export const InterestDropdown = ({ form, selected, onClear }) => {
    const [open, setOpen] = useState(false);

    const selectedLabels = INTEREST_OPTIONS.filter((opt) => selected[opt.id]).map(
        (opt) => opt.label
    );
    const displayText = selectedLabels.length ? selectedLabels.join(", ") : "Velg...";
    const textColor = selectedLabels.length ? "text-primary" : "text-muted-foreground";

    return (
        <div className={cn(open && "overlay-active", "w-full xl:w-4/5 gap-y-1")}>
            <FormField
                control={form.control}
                name="interests"
                render={() => (
                    <FormItem className="w-full gap-1 relative">
                        <FormLabel className="text-card font-bold text-sm">Interesser</FormLabel>

                        <DropdownMenu open={open} onOpenChange={setOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="fake"
                                    className={cn(
                                        `bg-card w-full justify-between rounded-md py-5 !px-3 text-md ${textColor}`,
                                        form.formState.errors.interests && "ring-[3px] ring-destructive/30"
                                    )}
                                >
                                    <div className="flex items-center justify-baseline gap-3">
                                        <ClipboardList strokeWidth={2.5} />
                                        {displayText}
                                    </div>
                                    {open ? <ChevronUp /> : <ChevronDown />}
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) border-none !p-0">
                                <div className="px-3 py-2 text-xs font-bold text-muted-foreground">Interesser</div>

                                <div className="px-1 pb-2">
                                    {INTEREST_OPTIONS.map((opt) => (
                                        <DropdownMenuCheckboxItem
                                            key={opt.id}
                                            checked={selected[opt.id]}
                                            onSelect={(e) => e.preventDefault()}
                                            onCheckedChange={(value) => form.setValue(`interests.${opt.id}`, value)}
                                        >
                                            {opt.label}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </div>

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
                                            onClick={onClear}
                                        >
                                            <Trash /> Tøm
                                        </Button>
                                    )}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};
