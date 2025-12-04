"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "lucide-react"

export function AuthButtons() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      // Hent profilbilde fra Firestore hvis bruker er innlogget
      if (currentUser) {
        try {
          const response = await fetch("/api/user/profile");
          if (response.ok) {
            const data = await response.json();
            setProfilePicture(data.userData?.picture || currentUser.photoURL);
          } else {
            setProfilePicture(currentUser.photoURL);
          }
        } catch (error) {
          console.error("Feil ved henting av profilbilde:", error);
          setProfilePicture(currentUser.photoURL);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (user) {
    // Bruker er innlogget - vis bruker-ikon eller profilbilde
    return (
      <Button asChild variant="outline" className="rounded-full !py-1.5 !h-fit px-2 pr-3">
        <Link href="/bruker" className="flex items-center gap-2">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Bruker bilde"
              width={24}
              height={24}
              className="rounded-full w-6 h-6 object-cover"
            />
          ) : (
            <User className="h-4 w-4" />
          )}
          <span>Min bruker</span>
        </Link>
      </Button>
    );
  }

  // Bruker er ikke innlogget - vis registrerings- og innloggingsknapper
  return (
    <div className="flex gap-3 items-center">
      <div className="hidden lg:block">
        <Button asChild variant="outline" className="!h-fit !py-1.5 px-5 rounded-md">
          <Link href="/signup">Registrer</Link>
        </Button>
      </div>
      <Button asChild className="!h-fit !py-1.5 px-5 rounded-md">
        <Link href="/login">Logg inn</Link>
      </Button>
    </div>
  );
}

