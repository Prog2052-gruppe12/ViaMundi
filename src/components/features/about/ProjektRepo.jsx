import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FiGithub } from "react-icons/fi";

export function ProjektRepo() {
  return (
    <div className="px-4">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">Prosjekt & kildekode</h3>
              <p className="mt-3 text-white/80 md:text-lg leading-relaxed">
                Utforsk hvordan vi har bygget ViaMundi med Next.js, shadcn/ui og Firebase/Firestore,
                og følg utviklingen vår.
              </p>
            </div>
            <div className="flex md:justify-end">
              <Button asChild variant="outline" className="text-white border-white">
                <a
                  href="https://github.com/Prog2052-gruppe12/PROG2053-Semester-project"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <FiGithub className="mr-2 h-5 w-5" />
                  Se kildekoden på GitHub
                </a>
              </Button>
            </div>
          </div>

          <Separator className="mt-8 bg-white/10" />
          <div className="pt-6 text-xs text-white/70 flex flex-wrap gap-x-6 gap-y-2">
            <span>Designsystem: React tailwindcss og shadcn/ui</span>
            <span>Deploy: Vercel</span>
            <span>Database: Firestore</span>
            <span>Språk: Javascript</span>
          </div>
    </div>
  );
}