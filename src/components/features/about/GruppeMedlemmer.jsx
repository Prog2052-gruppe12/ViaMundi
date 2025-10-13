import { GruppeCard } from "./GruppeCard";

const GruppeData = [
  {
    navn: "Fredrik Andreas Wiik",
    stilling: "Gruppeleder · frontend · backend · Dokumentasjon",
    bilde: "/fredrik.jpg",
    epost: "fredrik.wiik@gmail.com",
    github: "https://github.com/fredrikandreas",
  },
  {
    navn: "Tim Harseth",
    stilling: "backend · Database ·  frontend · Dokumentasjon",
    bilde: "/tim.jpg",
    epost: "tim@harseth.no",
    github: "https://github.com/TimHarseth",
  },
  {
    navn: "Nahom Berhane",
    stilling: "Dokumentasjon · Infrastruktur/DB · Backend · Frontend",
    bilde: "/nahom.jpg",
    epost: "nahom@berhane.no",
    github: "https://github.com/Nahom101-1",
  },
];

export function GruppeMedlemmer() {
  return (
      <div className="w-full flex flex-col gap-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-card"/>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-10 py-3 bg-gradient-primary text-primary-foreground rounded-lg border">
              <h2 className="text-2xl md:text-3xl font-bold text-center">
                Hvem er vi?
              </h2>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {GruppeData.map((medlem) => (
              <GruppeCard key={medlem.navn} medlem={medlem}/>
          ))}
        </div>
      </div>
  );
}