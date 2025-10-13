import {Header} from "@/components/layout/Header"
import {Footer} from "@/components/layout/Footer"
import {Section} from "@/components/common/Section"
import {SearchForm} from "@/components/features/landing/SearchForm"
import {Separator} from "@/components/ui/separator";
import {SidebarProvider} from "@/components/ui/sidebar";
import SidebarNav from "@/components/layout/SidebarNav";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full h-fit gap-y-12">
        <Section>
            <h1 className="font-bold text-4xl md:text-5xl text-center text-primary-foreground">Veien til din drømmereise</h1>
            <SearchForm/>
        </Section>
    </div>
  );
}
