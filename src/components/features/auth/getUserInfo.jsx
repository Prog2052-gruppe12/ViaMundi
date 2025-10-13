"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GetUserInfo({ userId, existingEmail, existingName }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: existingName || "",
    phone: "",
    age: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validering
    if (!formData.name || !formData.phone || !formData.age) {
      setError("Vennligst fyll ut alle obligatoriske felt");
      setLoading(false);
      return;
    }

    if (formData.age < 18 || formData.age > 120) {
      setError("Alder må være mellom 18 og 120");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          profileCompleted: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Kunne ikke lagre profil");
      }

      router.push("/bruker");
    } catch (err) {
      console.error("Feil ved lagring av profil:", err);
      setError("Kunne ikke lagre profilen. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-4 mt-8">
        {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
              {error}
            </div>
        )}

        <div>
          <Label htmlFor="name">
            Fullt navn <span className="text-red-500">*</span>
          </Label>
          <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-2 border"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">
              Alder <span className="text-red-500">*</span>
            </Label>
            <Input
                id="age"
                name="age"
                type="number"
                min="18"
                max="120"
                value={formData.age}
                onChange={handleChange}
                required
                disabled={loading}
                className="mt-2 border"
            />
          </div>
          <div>
            <Label htmlFor="phone">
              Telefonnummer <span className="text-red-500">*</span>
            </Label>
            <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+47 123 45 678"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={loading}
                className="mt-2 border"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Adresse (valgfritt)</Label>
          <Input
              id="address"
              name="address"
              type="text"
              placeholder="Gateadresse"
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
              className="mt-2 border"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="postalCode">Postnummer (valgfritt)</Label>
            <Input
                id="postalCode"
                name="postalCode"
                type="text"
                placeholder="0000"
                value={formData.postalCode}
                onChange={handleChange}
                disabled={loading}
                className="mt-2 border"
            />
          </div>

          <div>
            <Label htmlFor="city">By (valgfritt)</Label>
            <Input
                id="city"
                name="city"
                type="text"
                placeholder="Oslo"
                value={formData.city}
                onChange={handleChange}
                disabled={loading}
                className="mt-2 border"
            />
          </div>
        </div>

        <div className="pt-4">
          <Button
              type="submit"
              disabled={loading}
              className="w-full"
          >
            {loading ? "Lagrer..." : "Fullfør registrering"}
          </Button>
        </div>
      </form>
  );
}
