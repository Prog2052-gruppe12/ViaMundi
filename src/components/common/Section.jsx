import React from "react";
import {Card, CardContent} from "@/components/ui/card";

export const Section = (props) => {
    const type = props.type;
    let bgColor = "bg-gradient-primary"
    let px = "px-4 md:px-6 lg:px-16 2xl:px-32"
    let py = "py-12 lg:py-20"
    if (type === "secondary") {
        bgColor = "bg-gradient-secondary"
    } else if (type === "transparent") {
        bgColor = "bg-transparent";
        px = "px-0";
        py = "py-0";
    }
    return (
        <section className="w-full px-4 md:px-16 lg:px-32 pt-2 shadow-none">
            <Card className={`w-full ${px} ${py} rounded-2xl shadow-none border-none ${bgColor}`}>
                <CardContent className="w-full flex flex-col items-center p-0 gap-y-8">
                    {props.children}
                </CardContent>
            </Card>
        </section>
    )
}