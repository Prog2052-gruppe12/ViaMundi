import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { redirect } from "next/navigation";
import { getUserInfo } from "@/components/features/auth/getUserInfo";

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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Fullfør registreringen</h1>
          <p className="text-gray-600 mb-6">
            Vi trenger litt mer informasjon for å gi deg den beste opplevelsen.
          </p>
          
          <getUserInfo 
            userId={user.uid}
            existingEmail={user.email}
            existingName={user.name}
          />
        </div>
      </div>
    </div>
  );
}

