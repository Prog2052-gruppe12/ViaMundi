"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmail, signInWithGoogle } from "@/lib/auth/client";
import Link from "next/link";

import { FcGoogle } from "react-icons/fc";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmail({ email, password });
      const response = await fetch("/api/user/profile");
      const data = await response.json();
      
      router.push(data.profileCompleted ? "/bruker" : "/onboarding");
    } catch (err) {
      console.error("Innloggingsfeil:", err);
      
      // Håndter spesifikke Firebase feil
      if (err.code === "auth/user-not-found") {
        setError("Ingen bruker funnet med denne e-postadressen. Opprett en konto?");
      } else if (err.code === "auth/wrong-password") {
        setError("Feil passord. Prøv igjen.");
      } else if (err.code === "auth/invalid-email") {
        setError("Ugyldig e-postadresse.");
      } else if (err.code === "auth/user-disabled") {
        setError("Denne kontoen er deaktivert. Kontakt support.");
      } else if (err.code === "auth/too-many-requests") {
        setError("For mange forsøk. Prøv igjen senere.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Ugyldig e-post eller passord. Sjekk informasjonen din.");
      } else {
        setError("Innlogging feilet. Sjekk e-post og passord.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
      const response = await fetch("/api/user/profile");
      const data = await response.json();
      
      router.push(data.profileCompleted ? "/bruker" : "/onboarding");
    } catch (err) {
      console.error("Google innloggingsfeil:", err);
      
      if (err.message === 'POPUP_CLOSED') {
        // Brukeren lukket popup, vis ingen feilmelding
        return;
      }
      
      // Håndter spesifikke Firebase feil
      if (err.code === "auth/popup-blocked") {
        setError("Popup ble blokkert. Vennligst tillat popup-vinduer for denne siden.");
      } else if (err.code === "auth/cancelled-popup-request") {
        // Ignorér, brukeren avbrøt
        return;
      } else if (err.code === "auth/account-exists-with-different-credential") {
        setError("En konto eksisterer allerede med samme e-post men annen innloggingsmetode.");
      } else {
        setError("Google innlogging feilet. Prøv igjen.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="bg-white px-8 lg:px-24 py-16 w-full">
        {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
              {error}
            </div>
        )}

        <div>
          <h1 className="text-center text-4xl font-bold">Logg inn</h1>
          <p className="mt-2 text-center text-primary/75 font-medium">
            Ingen bruker? {" "}
            <Link href="/signup" className="text-sky-700 hover:underline underline-offset-2">
              Opprett en ny konto
            </Link>
          </p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4 mt-8">
          <div>
            <Label htmlFor="email">E-post</Label>
            <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="ola@nordman.no"
                className="mt-2 border"
            />
          </div>

          <div>
            <Label htmlFor="password">Passord</Label>
            <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="********"
                className="mt-2 border"
            />
          </div>

          <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2"
          >
            {loading ? "Logger inn..." : "Logg inn"}
          </Button>
        </form>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"/>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Eller</span>
            </div>
          </div>

          <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full mt-4 text-primary border-primary"
          >
            <FcGoogle className="scale-120 mr-1" />
            <span>{loading ? "Logger inn med Google..." : "Logg inn med Google"}</span>
          </Button>
        </div>
      </div>
  );
}
