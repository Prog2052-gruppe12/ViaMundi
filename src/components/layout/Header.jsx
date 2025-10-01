import React from "react";
import {Nav} from "@/components/layout/Nav"
import {Button} from "@/components/ui/button";

export const Header = () => {
    return (
        <main className="fixed top-0 left-0 w-full h-[80px] px-sides py-5 flex items-center justify-between bg-white shadow z-50">
            <div className="flex items-center justify-center bg-primary h-full aspect-square text-white font-bold rounded-md">
                V
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2"><Nav/></div>

            <Button>Logg inn</Button>
        </main>
    )
}