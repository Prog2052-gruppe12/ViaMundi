import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function OmOssHero() {
  return (
          <div className="w-full px-4">
            <Badge className="bg-white/20 text-white hover:bg-white/25 backdrop-blur">
              Om oss
            </Badge>

            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-white">
              Veien til din drømmereise – med ViaMundi
            </h1>
            <p className="mt-4 md:mt-5 text-white/90 md:text-lg leading-relaxed max-w-3xl">
              Vi bygger en AI-basert reiseassistent som forstår preferansene dine
              (budsjett, tidsrom, interesser) og foreslår en personlig reiseplan du kan finjustere.
            </p>

            <Separator className="mt-8 md:mt-10 bg-white/20" />
            <div className="pt-6 flex flex-wrap items-center gap-6 text-white/75 text-xs">
              <span>Tripadvisor</span>
              <span>GROQ</span>
              <span>GET YOUR GUIDE</span>
              <span>Open meto</span>
            </div>
          </div>
  );
}
