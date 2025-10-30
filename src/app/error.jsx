"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {Section} from "@/components/common/Section";
import {RefreshCcw} from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
  <Section type="transparent">
    <div className="bg-card px-8 lg:px-24 py-16 w-fit flex flex-col items-center rounded-2xl">
      <div className="flex justify-center mb-6">
        <div className="h-20 w-20 text-primary-foreground flex items-center text-4xl font-bold justify-center bg-accent rounded-full">
          !
        </div>
      </div>
      <h2 className="text-6xl font-bold mb-4 text-center">Ukjent feil</h2>
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Noe gikk galt
      </h1>
      <p className="mb-8 text-center">
        Beklager, det oppstod en feil. Prøv å laste siden på nytt.
      </p>
      <Button className="font-bold" onClick={() => reset()}>
        Prøv igjen <RefreshCcw/>
      </Button>
    </div>
  </Section>
  );
}