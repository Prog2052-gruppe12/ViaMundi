"use client";

import { Footer } from "@/components/layout/Footer";
import { OmOssHeader } from "@/components/about/OssHeader";
import { OmOssHero } from "@/components/about/OmOssHero";
import { GruppeMedlemmer } from "@/components/about/GruppeMedlemmer";
import { ProjektRepo } from "@/components/about/ProjektRepo";


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