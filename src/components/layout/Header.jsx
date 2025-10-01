import React from "react";
import {Nav} from "@/components/layout/Nav"

export const Header = () => {
    return (
        <main className="flex items-center justify-between border pl-sides pr-sides pt-5 pb-5 w-full h-[80px]">
            <div className="flex items-center justify-center bg-primary h-full aspect-square text-white font-bold rounded-md">V</div>
            <Nav />
        </main>
    )
}