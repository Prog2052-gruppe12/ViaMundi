import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { redirect } from "next/navigation";
import { GetUserInfo } from "@/components/features/auth/getUserInfo";

import { Section } from "@/components/common/Section"

export const dynamic = "force-dynamic";

async function getUser() {
  try {
    const jar = await cookies();
    const sessionCookie = jar.get("firebase_session")?.value;

    if (!sessionCookie) {
      return null;
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    console.error("Feil ved henting av bruker:", error);
    return null;
  }
}

export default async function OnboardingPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <Section type="transparent">
      <div className="overflow-hidden w-full max-w-[1000px] rounded-2xl">
        <div className="bg-white px-8 lg:px-24 py-16 w-full">
          <h1 className="text-4xl font-bold">Fullfør registreringen</h1>
          <p className="text-primary/75 mt-2 font-medium">
            Vi trenger litt mer informasjon for å gi deg den beste opplevelsen.
          </p>
          
          <GetUserInfo 
            userId={user.uid}
            existingEmail={user.email}
            existingName={user.name}
          />
        </div>
      </div>
    </Section>
  );
}

