import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FiGithub, FiMail } from "react-icons/fi";

export function GruppeCard({ medlem }) {
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="items-center text-center">
        <Avatar className="h-24 w-24 ring-4 ring-white shadow mx-auto">
          <AvatarImage src={medlem.bilde} alt={medlem.navn} />
          <AvatarFallback className="bg-gradient-to-br from-[#F38C7F] to-[#F37456] text-white text-3xl">
            {medlem.navn.split(" ")[0].charAt(0)}
          </AvatarFallback>
        </Avatar>

        <CardTitle className="text-lg md:text-xl">{medlem.navn}</CardTitle>
        <CardDescription className="text-sm">{medlem.stilling}</CardDescription>
      </CardHeader>
      <CardFooter className="justify-center gap-3">
        <Button asChild variant="outline" className="rounded-full">
          <a href={medlem.github} target="_blank" rel="noopener noreferrer">
            <FiGithub className="mr-2 h-4 w-4" />
            GitHub
          </a>
        </Button>
        <Button
          asChild
          className="rounded-full text-white bg-gradient-to-br from-[#F38C7F] to-[#F37456] hover:opacity-95"
        >
          <a href={`mailto:${medlem.epost}`}>
            <FiMail className="mr-2 h-4 w-4" />
            E-post
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}