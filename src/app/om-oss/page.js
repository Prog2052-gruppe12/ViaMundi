"use client";

import { Nav } from "@/components/layout/Nav";
import { FiGithub, FiMail } from "react-icons/fi";

const teamMembers = [
  {
    name: "Fredrik Andreas Wiik",
    role: "Gruppeleder · Hoved frontend · Ekstra backend",
    description:
      "Ansvarlig for UI/UX, komponenter (shadcn/ui) og kvalitet i frontend. Bidrar i backend ved behov.",
    picture: "/fredrik.jpg",
    kontakt: "fredrik.wiik@gmail.com",
    github: "https://github.com/fredrikandreas"
  },
  {
    name: "Tim Harseth",
    role: "Hoved backend · Database · Ekstra frontend",
    description:
      "Fokuserer på API-ruter i Next.js, Firestore-datamodell og integrasjoner. Bidrar i frontend ved behov.",
    picture: "/tim.jpg",
    kontakt: "tim@harseth.no",
    github: "https://github.com/TimHarseth"
  },
  {
    name: "Nahom Berhane",
    role: "Dokumentasjon · Infrastruktur/DB · Backend-støtte",
    description:
      "Holder prosjektplan/rapport oppdatert, setter opp miljø (Vercel/Firebase) og støtter backend-arbeid.",
    picture: "/nahom.jpg",
    kontakt: "nahom@berhane.no",
    github: "https://github.com/Nahom101-1"
  }
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 w-full h-20 px-8 py-5 flex items-center justify-between bg-white shadow-sm z-50">
        <a href="/" className="flex items-center justify-center bg-black h-10 aspect-square text-white font-bold rounded-md">
          V
        </a>

        <div className="absolute left-1/2 -translate-x-1/2">
          <Nav />
        </div>
      </header>

      <div className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-black">
              ViaMundi
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              Vi bygger en AI-basert reiseassistent som gjør
              reiseplanlegging enklere: brukeren legger inn preferanser
              (budsjett, tidsrom, interesser) og får en personlig plan som kan
              justeres.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-white shadow p-8"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-black rounded-full mb-6 flex items-center justify-center">
                    <span className="text-3xl text-white">
                      {member.name.split(" ")[0].charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-black">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{member.role}</p>
                  <p className="mt-4 text-gray-600">
                    {member.description}
                  </p>
                  <div className="mt-6 flex gap-6">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-black flex items-center gap-2"
                    >
                      <FiGithub className="w-5 h-5" />
                      <span className="text-sm">GitHub</span>
                    </a>
                    <a
                      href={`mailto:${member.kontakt}`}
                      className="text-gray-600 hover:text-black flex items-center gap-2"
                    >
                      <FiMail className="w-5 h-5" />
                      <span className="text-sm">E-post</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-2xl text-center">
            <h3 className="text-2xl font-bold text-black">
              Prosjekt
            </h3>
            <div className="mt-4 flex justify-center">
              <a
                href="https://github.com/Prog2052-gruppe12/PROG2053-Semester-project"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black font-medium flex items-center gap-2"
              >
                <FiGithub className="w-5 h-5" />
                <span>Se kildekoden på GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;