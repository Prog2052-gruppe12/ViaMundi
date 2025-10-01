import React from "react";
import {Nav} from "@/components/layout/Nav"
import {Button} from "@/components/ui/button";

export const Header = () => {
    return (
        <header className="fixed top-0 left-0 w-full h-20 px-38 py-5 flex items-center justify-between bg-popover backdrop-blur-md shadow z-50">
            <a href="" className="flex items-center justify-center bg-primary h-10 aspect-square text-primary-foreground font-bold rounded-md">
                V
            </a>

            <div className="absolute left-1/2 transform -translate-x-1/2"><Nav/></div>

            <Button>Logg inn</Button>
        </header>
    )
}