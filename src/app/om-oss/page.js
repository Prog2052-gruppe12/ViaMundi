"use client";

import { Footer } from "@/components/layout/Footer";
import { OmOssHeader } from "@/components/features/about/OssHeader";
import { OmOssHero } from "@/components/features/about/OmOssHero";
import { GruppeMedlemmer } from "@/components/features/about/GruppeMedlemmer";
import { ProjektRepo } from "@/components/features/about/ProjektRepo";


export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <OmOssHeader />
      
      <main className="pt-28 md:pt-32 pb-24">
        <OmOssHero />
        <GruppeMedlemmer />
        <ProjektRepo />
        <Footer />
      </main>
    </div>
  );
}