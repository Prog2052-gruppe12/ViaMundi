import React from "react";
import {Nav} from "@/components/layout/Nav"
import {AuthButtons} from "@/components/layout/AuthButtons"

export const Header = () => {
    return (
        <header className="fixed top-0 left-0 w-full h-20 px-4 md:px-16 lg:px-32 py-5 flex items-center justify-between bg-popover shadow z-50">
            <div className="flex flex-row gap-14 items-center">
                <a href="/"
                   className="flex items-center justify-center bg-primary h-10 aspect-square text-primary-foreground font-bold rounded-md bg-gradient-to-br from-[#F38C7F] to-[#F37456]">
                    V
                </a>

                <Nav />
            </div>

            <AuthButtons/>
        </header>
    )
}