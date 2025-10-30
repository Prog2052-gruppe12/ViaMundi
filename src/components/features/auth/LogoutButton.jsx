"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOutEverywhere } from "@/lib/auth/client";
import LoadingPage from "@/app/loading";
import ErrorPage from "@/app/error";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOutEverywhere();
      router.push("/");
    } catch (error) {
      setError(true);
      console.error("Feil ved utlogging:", error);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <ErrorPage />
  }

  if (loading) {
    return <LoadingPage/>;
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={loading}
      className="w-fit"
    >
      {loading ? "Logger ut..." : "Logg ut"}
    </Button>
  );
}

