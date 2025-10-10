import Link from "next/link";
import {Button} from "@/components/ui/button";
import React from "react";

export const Logo = () => {
    return (
        <Button className="w-10 p-0 aspect-square rounded-md">
            <Link className="font-logo leading-none translate-y-0.25 -translate-x-0.25 text-[24px] text-shadow-sm" href="/">V</Link>
        </Button>
    )
}