"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { VscAccount } from "react-icons/vsc";

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
      <Link href="/user">
        <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <VscAccount className="w-8 h-8 text-gray-700" />
        </div>
      </Link>
    );
  }

  // Bruker er ikke innlogget - vis registrerings- og innloggingsknapper
  return (
    <div className="flex gap-3">
      <Button variant="outline">
        <Link href="/signup">Registrer deg</Link>
      </Button>
      <Button>
        <Link href="/login">Logg inn</Link>
      </Button>
    </div>
  );
}

