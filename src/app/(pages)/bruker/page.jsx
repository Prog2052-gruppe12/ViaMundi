'use client';
import { LogoutButton } from "@/components/features/auth/LogoutButton";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Section } from "@/components/common/Section"
import { Label } from "@/components/ui/label";
import LoadingPage from "@/app/loading";
import { BackButton } from "@/components/common/BackButton";


/**
 * Brukerprofilside
 * @returns {JSX.Element} 
 */
export default function UserPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Hent brukerdata fra backend profil
  useEffect(() => {
    fetch("/api/user/profile")
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.userData) {
          setUser(data.userData);
        } else {
          router.push("/login?returnTo=/bruker");
        }
      })
      .catch(err => {
        console.error("Feil ved henting av bruker:", err);
        router.push("/login?returnTo=/bruker");
      })
      .finally(() => setLoading(false));
  }, [router]);


  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return null;
  }

  return (
    <Section type="transparent">
      <div className="flex flex-col overflow-hidden w-full max-w-[1000px] gap-2">
        <BackButton />

        <div className="bg-white px-8 lg:px-24 py-16 w-full rounded-2xl">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-4">
              <div className="rounded-full overflow-hidden w-10 h-10">
                <img
                  src={user.picture}
                  alt="Profilbilde"
                  className="object-cover"
                />
              </div>
              <h1 className="text-4xl font-bold">{user.name || "Ikke oppgitt"}</h1>
            </div>
            <LogoutButton loading={loading} setLoading={setLoading}/>
          </div>

          <div className="space-y-4 mt-6">
            <div>
              <Label>E-post</Label>
              <div className="py-2 px-4 rounded-md border mt-2 text-md">{user.email}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {user.age && (
                <div>
                  <Label>Alder</Label>
                  <div className="py-2 px-4 rounded-md border mt-2 text-md">{user.age} år</div>
                </div>
              )}

              {user.phone && (
                <div>
                  <Label>Telefonnummer</Label>
                  <div className="py-2 px-4 rounded-md border mt-2 text-md">{user.phone}</div>
                </div>
              )}
            </div>
            {user.address && (
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Adresse</Label>
                    <div className="py-2 px-4 rounded-md border mt-2 text-md">
                      {user.address}
                    </div>
                  </div>
                  {(user.postalCode || user.city) && (
                    <div>
                      <Label>Sted</Label>
                      <div className="py-2 px-4 rounded-md border mt-2 text-md">
                        {user.postalCode} {user.city}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}

