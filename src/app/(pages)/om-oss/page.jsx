"use client";

import { Footer } from "@/components/layout/Footer";
import { OmOssHeader } from "@/components/features/about/OssHeader";
import {Section} from "@/components/common/Section"
import { OmOssHero } from "@/components/features/about/OmOssHero";
import { GruppeMedlemmer } from "@/components/features/about/GruppeMedlemmer";
import { ProjektRepo } from "@/components/features/about/ProjektRepo";


export default function AboutPage() {
  return (
    <div className="flex flex-col items-center w-full h-fit gap-y-12">
        <Section>
            <OmOssHero />
        </Section>
        <Section type="transparent">
            <GruppeMedlemmer />
        </Section>
        <Section type="secondary">
            <ProjektRepo />
        </Section>
    </div>
  );
}