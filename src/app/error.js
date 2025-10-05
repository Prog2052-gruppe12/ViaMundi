"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <Card className="text-center max-w-md border-none shadow-none">
        <CardHeader>
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 flex items-center justify-center rounded-full text-white text-3xl font-bold bg-gradient-to-br from-[#F38C7F] to-[#F37456]">
              !
            </div>
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900">
            Noe gikk galt
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-gray-600 mb-8 mt-3">
            Beklager, det oppstod en feil. Prøv å laste siden på nytt.
          </p>

          <Button
            onClick={() => reset()}
            className="rounded-full text-white bg-gradient-to-br from-[#F38C7F] to-[#F37456] hover:opacity-95 transition"
          >
            Prøv igjen
          </Button>

          <Separator className="my-8" />

          <p className="text-sm text-gray-500">
            © 2025 ViaMundi — Din personlige AI-reiseassistent
          </p>
        </CardContent>
      </Card>
    </div>
  );
}