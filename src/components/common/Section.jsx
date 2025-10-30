import React from "react";
import {Card, CardContent} from "@/components/ui/card";
import {cn} from "@/utils/cn";

export const Section = (props) => {
    const type = props.type;
    let bgColor = "bg-gradient-primary"
    let px = "px-4 md:px-6 lg:px-16 2xl:px-32"
    let py = "py-12 lg:py-20"
    let border = "border-2 border-card/20"
    if (type === "secondary") {
        bgColor = "bg-gradient-secondary"
    } else if (type === "transparent") {
        bgColor = "bg-transparent";
        px = "px-0";
        py = "py-0";
        border = "border-none"
    }
    return (
        <section className={cn(
            "w-full px-4 md:px-16 lg:px-32 shadow-none flex justify-center border-none"
        )}>
            <Card className={cn(
                `w-full ${px} ${py} rounded-2xl shadow-none ${border} max-w-[1700px] ${bgColor}`,
                props.className,
            )}>
                <CardContent className="w-full flex flex-col items-center p-0 gap-y-8">
                    {props.children}
                </CardContent>
            </Card>
        </section>
    )
}