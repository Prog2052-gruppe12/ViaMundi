"use client";

import { Nav } from "@/components/layout/Nav";
import { Github, Mail } from "lucide-react";

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
      <header className="fixed top-0 left-0 w-full h-20 px-8 py-5 flex items-center justify-between bg-white/80 backdrop-blur-md shadow-sm z-50">
        <a href="/" className="flex items-center justify-center bg-primary h-10 aspect-square text-primary-foreground font-bold rounded-md">
          V
        </a>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Nav />
        </div>
      </header>

      <div className="pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              ViaMundi
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Vi bygger en AI-basert reiseassistent som gjør
              reiseplanlegging enklere: brukeren legger inn preferanser
              (budsjett, tidsrom, interesser) og får en personlig plan som kan
              justeres.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6 flex items-center justify-center">
                    <span className="text-3xl text-white">
                      {member.name.split(" ")[0].charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-sm text-blue-600 mt-1">{member.role}</p>
                  <p className="mt-4 text-gray-600 leading-6">
                    {member.description}
                  </p>
                  <div className="mt-6 flex gap-6">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                    >
                      <Github2 className="w-5 h-5" />
                      <span className="text-sm">GitHub</span>
                    </a>
                    <a
                      href={`mailto:${member.kontakt}`}
                      className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                    >
                      <Mail className="w-5 h-5" />
                      <span className="text-sm">E-post</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="mx-auto mt-16 max-w-2xl text-center animate-fade-in"
          >
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">
              Prosjekt
            </h3>
            <div className="mt-4 flex justify-center">
              <a
                href="https://github.com/Prog2052-gruppe12/PROG2053-Semester-project"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium flex items-center gap-2"
              >
                <Github2 className="w-5 h-5" />
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
