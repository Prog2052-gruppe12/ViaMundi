"use client";

import Link from "next/link";
import { Section } from "@/components/common/Section"
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";

export default function NotFound() {
  return (
    <Section type="transparent">
      <div className="bg-card px-8 lg:px-24 py-16 w-fit flex flex-col items-center rounded-2xl">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 text-primary-foreground flex items-center text-2xl font-bold justify-center bg-accent rounded-full">
            404
          </div>
        </div>
        <h2 className="text-6xl font-bold mb-4 text-center">404</h2>
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Siden finnes ikke
        </h1>
        <p className="mb-8 text-center">
          Beklager, men siden du leter etter eksisterer ikke.
        </p>
        <Button className="font-bold">
          <ArrowLeft/>
          <Link href="/">
            Gå til forsiden
          </Link>
        </Button>
      </div>
    </Section>
  );
}