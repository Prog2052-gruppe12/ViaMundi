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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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
    // Bruker er innlogget - vis bruker-ikon
    return (
        <Button asChild variant="outline">
            <Link href="/bruker">
                <User/> Min bruker
            </Link>
        </Button>
    );
  }

  // Bruker er ikke innlogget - vis registrerings- og innloggingsknapper
  return (
    <div className="flex gap-3">
        <div className="hidden lg:block">
            <Button variant="other" className="hidden">
                <Link href="/signup">Registrer</Link>
            </Button>
        </div>
      <Button asChild className="h-9 md:h-10">
        <Link href="/login">Logg inn</Link>
      </Button>
    </div>
  );
}

