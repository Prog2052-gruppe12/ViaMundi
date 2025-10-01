import {LandingPage} from "@/pages/LandingPage"
import {Header} from "@/components/layout/Header"
import {Footer} from "@/components/layout/Footer"

export default function Home() {
  return (
    <main className="font-sans min-h-screen flex items-start justify-center bg-background">
        <Header />
        <LandingPage />
        <Footer />
    </main>
  );
}
