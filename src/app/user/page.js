import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/features/auth/LogoutButton";
import Link from "next/link";

export const metadata = {
  title: "Min konto – ViaMundi",
  description: "Se og administrer din ViaMundi-konto",
};

async function getUser() {
  try {
    const jar = await cookies();
    const sessionCookie = jar.get("firebase_session")?.value;

    if (!sessionCookie) {
      return null;
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    // Hent brukerdata fra Firestore
    const userDoc = await adminDb.collection("users").doc(decodedClaims.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};
    
    return {
      ...decodedClaims,
      ...userData,
    };
  } catch (error) {
    console.error("Feil ved henting av bruker:", error);
    return null;
  }
}

export default async function UserPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login?returnTo=/user");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link 
          href="/" 
          className="inline-block mb-4 text-sm text-gray-600 hover:text-gray-900"
        >
          ← Tilbake til forsiden
        </Link>
        
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Min konto</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Navn</label>
              <p className="mt-1 text-lg">{user.name || "Ikke oppgitt"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">E-post</label>
              <p className="mt-1 text-lg">{user.email}</p>
            </div>

            {user.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefonnummer</label>
                <p className="mt-1 text-lg">{user.phone}</p>
              </div>
            )}

            {user.age && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Alder</label>
                <p className="mt-1 text-lg">{user.age} år</p>
              </div>
            )}

            {user.address && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Adresse</label>
                <p className="mt-1 text-lg">{user.address}</p>
                {(user.postalCode || user.city) && (
                  <p className="text-gray-600">
                    {user.postalCode} {user.city}
                  </p>
                )}
              </div>
            )}

            <div className="pt-4 border-t">
              <label className="block text-sm font-medium text-gray-700">Bruker ID</label>
              <p className="mt-1 text-sm text-gray-600 font-mono">{user.uid}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Konto opprettet</label>
              <p className="mt-1 text-sm text-gray-600">
                {new Date(user.auth_time * 1000).toLocaleDateString("nb-NO")}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

