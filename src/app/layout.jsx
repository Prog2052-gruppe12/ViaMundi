import {Geist, Geist_Mono, Oleo_Script, Oleo_Script_Swash_Caps} from "next/font/google";
import "./globals.css";
import {Header} from "@/components/layout/Header";
import {Footer} from "@/components/layout/Footer";
import {SidebarProvider} from "@/components/ui/sidebar";
import SidebarNav from "@/components/layout/SidebarNav";
import {DynamicBreadcrumb} from "@/components/common/DynamicBreadcrumb";

const geistSans = Geist({
    variable: "--font-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
});

const fontLogo = Oleo_Script_Swash_Caps({
    variable: "--font-logo",
    weight: "400",
    subsets: ["latin"],
})

export const metadata = {
    title: "ViaMundi",
    description: "Semester Project 2025 - gruppe 12",
};

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} ${fontLogo.variable} antialiased flex flex-col min-h-screen\``}
            style={{
                backgroundImage: `
        radial-gradient(circle at 20% 80%, rgba(255, 182, 153, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 244, 214, 0.5) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(255, 182, 153, 0.1) 0%, transparent 50%)`,
            }}
        >
        <SidebarProvider defaultOpen={false}>
            <SidebarNav/>
            <main className="w-full h-min-full">
                <Header/>
                {/* <DynamicBreadcrumb/> */}
                {children}
            </main>
        </SidebarProvider>
        <Footer/>
        </body>
        </html>
    );
}
