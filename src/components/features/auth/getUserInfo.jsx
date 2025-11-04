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
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    name: existingName || "",
    phone: "",
    age: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Beregn nye dimensjoner (maks 400x400)
          let width = img.width;
          let height = img.height;
          const maxSize = 400;
          
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Konverter til base64 med komprimering (kvalitet 0.7)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleChange = async (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === "file" && name === "profilePicture") {
      const file = files?.[0];
      if (file) {
        // Valider filstørrelse (maks 5MB original)
        if (file.size > 5 * 1024 * 1024) {
          setError("Bildet er for stort. Maks størrelse er 5MB.");
          return;
        }
        
        // Valider filtype
        if (!file.type.startsWith("image/")) {
          setError("Vennligst velg en gyldig bildefil.");
          return;
        }
        
        setProfilePicture(file);
        
        try {
          // Komprimer og endre størrelse på bildet
          const compressedImage = await resizeImage(file);
          setProfilePicturePreview(compressedImage);
          setError(""); // Fjern eventuelle tidligere feilmeldinger
        } catch (error) {
          console.error("Feil ved behandling av bilde:", error);
          setError("Kunne ikke behandle bildet. Prøv et annet bilde.");
        }
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
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
      const dataToSend = {
        ...formData,
        profileCompleted: true,
      };
      
      // Legg til profilbilde hvis det er valgt
      if (profilePicture && profilePicturePreview) {
        dataToSend.picture = profilePicturePreview; // Base64 encoded image
      }
      
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Kunne ikke lagre profil");
      }

      router.push("/bruker");
    } catch (err) {
      console.error("Feil ved lagring av profil:", err);
      setError(err.message || "Kunne ikke lagre profilen. Prøv igjen.");
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
        <div>
          <Label htmlFor="profilePicture">
            Profilbilde (valgfritt)
          </Label>
          <Input
              id="profilePicture"
              name="profilePicture"
              type="file"
              accept="image/*"
              onChange={handleChange}
              disabled={loading}
              className="mt-2 border"
          />
          <p className="text-xs text-gray-500 mt-1">Maks 5MB. Støttede formater: JPG, PNG, GIF</p>
          
          {profilePicturePreview && (
              <div className="mt-3">
                <p className="text-sm text-gray-700 mb-2">Forhåndsvisning:</p>
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
                  <img 
                    src={profilePicturePreview} 
                    alt="Profilbilde forhåndsvisning" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
          )}
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
