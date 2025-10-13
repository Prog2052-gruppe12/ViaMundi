"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpWithEmail, signInWithGoogle } from "@/lib/auth/client";
import Link from "next/link";
import {FcGoogle} from "react-icons/fc";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passordene matcher ikke");
      return;
    }

    if (password.length < 6) {
      setError("Passordet må være minst 6 tegn");
      return;
    }

    setLoading(true);

    try {
      await signUpWithEmail({ email, password, displayName: name });
      router.push("/onboarding");
    } catch (err) {
      console.error("Registreringsfeil:", err);
      setError("Registrering feilet. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
      const response = await fetch("/api/user/profile");
      const data = await response.json();
      
      router.push(data.profileCompleted ? "/bruker" : "/");
    } catch (err) {
      console.error("Google registreringsfeil:", err);
      if (err.message !== 'POPUP_CLOSED') {
        setError("Google registrering feilet.");
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
          <h1 className="text-center text-4xl font-bold">Opprett konto</h1>
          <p className="mt-2 text-center text-primary/75 font-medium">
            Allerede bruker? {" "}
            <Link href="/login" className="text-sky-700 hover:underline underline-offset-2">
              Logg inn
            </Link>
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4 mt-8">
          <div>
            <Label htmlFor="name">Fullt navn</Label>
            <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ola Nordman"
                disabled={loading}
                className="mt-2 border"
            />
          </div>

          <div>
            <Label htmlFor="email">E-post</Label>
            <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ola@nordman.no"
                disabled={loading}
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
                placeholder="********"
                disabled={loading}
                className="mt-2 border"
            />
            <p className="text-xs text-gray-500 mt-1">Minst 6 tegn</p>
          </div>

          <div>
            <Label htmlFor="confirmPassword">Bekreft passord</Label>
            <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="********"
                disabled={loading}
                className="mt-2 border"
            />
          </div>

          <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2"
          >
            {loading ? "Oppretter konto..." : "Opprett konto"}
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
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full mt-4 text-primary border-primary"
          >
            <FcGoogle className="scale-120 mr-1" />
            <span>{loading ? "Registrerer med google..." : "Registrer med Google"}</span>
          </Button>
        </div>
      </div>
  );
}
