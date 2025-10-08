import {Header} from "@/components/layout/Header"
import {Footer} from "@/components/layout/Footer"
import {Section} from "@/components/common/Section"
import {SearchForm} from "@/components/features/landing/SearchForm"
import {Separator} from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
        <Header />
        <main className="flex flex-col items-center w-full h-fit min-h-screen mt-20 gap-y-12">
            <Section>
                <h1 className="font-bold text-5xl text-center text-primary-foreground">Veien til din drømmereise</h1>
                <SearchForm/>
            </Section>
        </main>
        <Footer />
    </div>
  );
}
