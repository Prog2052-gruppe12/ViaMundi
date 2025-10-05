import {Header} from "@/components/layout/Header"
import {Footer} from "@/components/layout/Footer"
import {Section} from "@/components/common/Section"
import {SearchForm} from "@/components/features/landing/SearchForm"

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-baseline font-sans min-h-screen h-fit bg-background pt-20">
        <Header />
        <div className="flex flex-col items-center px-38 py-12 w-full h-fit min-h-screen gap-y-12">
            <Section>
                <h1 className="font-bold text-5xl text-center text-primary-foreground">Veien til din drømmereise</h1>
                <SearchForm/>
            </Section>
        </div>
        <Footer />
    </main>
  );
}
