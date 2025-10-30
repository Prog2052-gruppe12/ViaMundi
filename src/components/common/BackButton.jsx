"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BackButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleBack = async () => {
        setLoading(true);
        try {
            router.push("/");
        } catch (error) {
            console.error("Feil ved utlogging:", error);
            alert("Kunne ikke logge ut. Prøv igjen.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleBack}
            disabled={loading}
            variant="other"
            className="w-fit"
            size="sm"
        >
            ← Tilbake til forsiden
        </Button>
    );
}