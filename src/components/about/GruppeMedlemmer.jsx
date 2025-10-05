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
    <section className="mx-auto max-w-7xl px-4 md:px-8 mt-10 md:mt-16">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 md:mb-12 text-center">
        Teamet
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {GruppeData.map((medlem) => (
          <GruppeCard key={medlem.navn} medlem={medlem} />
        ))}
      </div>
    </section>
  );
}