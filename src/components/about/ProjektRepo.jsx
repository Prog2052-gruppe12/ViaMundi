import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FiGithub } from "react-icons/fi";

export function ProjektRepo() {
  return (
    <section className="mx-auto mb-20 max-w-7xl px-4 md:px-8 mt-12 md:mt-16">
      <Card className="rounded-2xl border-none shadow-sm text-white bg-gradient-to-b from-[#13324B] to-[#0A1E2F]">
        <CardContent className="px-6 md:px-10 py-10 md:py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">Prosjekt & kildekode</h3>
              <p className="mt-3 text-white/80 md:text-lg leading-relaxed">
                Utforsk hvordan vi har bygget ViaMundi med Next.js, shadcn/ui og Firebase/Firestore,
                og følg utviklingen vår.
              </p>
            </div>
            <div className="flex md:justify-end">
              <Button asChild variant="secondary" className="rounded-full">
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
            <span>Designsystem: shadcn/ui</span>
            <span>Deploy: Vercel</span>
            <span>Database: Firestore</span>
            <span>Språk: TypeScript</span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}