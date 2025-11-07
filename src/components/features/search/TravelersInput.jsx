import React from "react";
import {FormItem, FormLabel, FormControl, FormField} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { cn } from "@/utils/cn";

export const TravelersInput = ({ label, form }) => {
    const currentForm = form;

    return (
        <FormField
            control={currentForm.control}
            name="travelers"
            render={({ field }) => (
                <FormItem className="relative flex flex-col justify-start w-full md:w-2/5 min-w-32 gap-y-1">
                    <FormLabel className="font-bold text-sm text-card">{label}</FormLabel>
                    <User
                        strokeWidth={2.5}
                        className="absolute left-2.25 top-9 h-4"
                        color={field.value ? "var(--foreground)" : "var(--muted-foreground)"}
                    />
                    <FormControl>
                        <Input
                            type="number"
                            placeholder="Antall..."
                            min={1}
                            max={10}
                            className={cn(
                                "w-full bg-card text-foreground text-md font-medium pl-10.25 md:rounded-l-none md:rounded-r-md",
                                currentForm.formState.errors.travelers && "ring-[3px] ring-destructive/40"
                            )}
                            {...field}
                        />
                    </FormControl>
                </FormItem>
                )
            }
        />
    )
};
