import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/cn";

export const Section = ({ type = "default", className, children }) => {
    const styles = {
        default: {
            sect: "px-4 md:px-16 lg:px-32",
            bgColor: "bg-gradient-primary",
            px: "px-4 md:px-6 lg:px-16 2xl:px-32",
            py: "py-12 lg:py-20",
            border: "border-2 border-card/20",
            rounded: "rounded-2xl",
        },
        secondary: {
            bgColor: "bg-gradient-secondary",
        },
        transparent: {
            bgColor: "bg-transparent",
            px: "px-0",
            py: "py-0",
            border: "border-none",
        },
        plan: {
            px: "px-4",
            py: "py-4",
            border: "border-none",
            rounded: "rounded-none",
            bgColor: "bg-transparent",
            sect: "p-0",
        },
        image: {
            bgColor: "bg-transparent",
            border: "border-none",
        },
    };

    const { sect, bgColor, px, py, border, rounded } = {
        ...styles.default,
        ...styles[type],
    };

    return (
        <section
            className={cn(
                "w-full shadow-none flex justify-center border-none",
                sect
            )}
        >
            <Card
                className={cn(
                    "w-full shadow-none max-w-[1700px] relative overflow-hidden",
                    px,
                    py,
                    rounded,
                    border,
                    bgColor,
                    className
                )}
            >
                <CardContent className="w-full flex flex-col items-center p-0 gap-y-6">
                    {children}
                </CardContent>
            </Card>
        </section>
    );
};