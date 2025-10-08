"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOutEverywhere } from "@/lib/auth/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOutEverywhere();
      router.push("/");
    } catch (error) {
      console.error("Feil ved utlogging:", error);
      alert("Kunne ikke logge ut. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={loading}
      variant="outline"
      className="w-full sm:w-auto"
    >
      {loading ? "Logger ut..." : "Logg ut"}
    </Button>
  );
}

