import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import { Nav } from "@/components/layout/Nav";

export function OmOssHeader() {
  return (
    <header className="fixed top-0 left-0 w-full h-16 md:h-20 px-4 md:px-8 flex items-center justify-between bg-white/90 backdrop-blur shadow-sm z-50">
      <Button
        asChild
        className="h-10 w-10 p-0 rounded-md text-white font-bold bg-gradient-to-br from-[#F38C7F] to-[#F37456]"
      >
        <NextLink href="/">V</NextLink>
      </Button>

      <div className="absolute left-1/2 -translate-x-1/2">
        <Nav />
      </div>
    </header>
  );
}
