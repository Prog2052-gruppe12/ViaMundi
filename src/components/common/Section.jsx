import React from "react";
import {Card, CardContent} from "@/components/ui/card";

export const Section = (props) => {
    const type = props.type;
    let bgColor = "bg-gradient-to-br from-[#F38C7F] to-[#F37456]"
    if (type === "secondary") {
        bgColor = "bg-gradient-to-br from-[#13324B] to-[#0A1E2F]"
    } else if (type === "transparent") {
        bgColor = "";
    }
    return (
        <section className="w-full px-4 md:px-16 lg:px-32 pt-10">
            <Card className={`px-4 lg:px-12 2xl:px-32 pt-10 overflow-hidden rounded-2xl shadow-sm border-none ${bgColor}`}>
                <CardContent className="flex flex-col px-6 md:px-10 py-10 md:py-14 gap-y-8">
                    {props.children}
                </CardContent>
            </Card>
        </section>
    )
}