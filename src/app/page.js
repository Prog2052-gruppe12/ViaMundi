import {LandingPage} from "@/pages/LandingPage"
import {Header} from "@/components/layout/Header"
import {Footer} from "@/components/layout/Footer"

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-baseline font-sans min-h-screen h-fit bg-background pt-20">
        <Header />
        <LandingPage />
        <Footer />
    </main>
  );
}
