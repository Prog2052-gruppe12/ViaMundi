"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";

// Enkel Firestore test side
export default function TestPage() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("Test Dokument");
  const [description, setDescription] = useState("Test Beskrivelse");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Hent data fra Firestore
  async function load() {
    try {
      const snapshot = await getDocs(collection(db, "test"));
      setItems(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
      setLoading(false);
    } catch (e) {
      setErr("Feil: " + e.message);
      setLoading(false);
    }
  }

  // Lag nytt dokument
  async function create() {
    try {
      await addDoc(collection(db, "test"), {
        title,
        description,
        createdAt: serverTimestamp()
      });
      await load();
    } catch (e) {
      setErr("Feil: " + e.message);
    }
  }

  // Last data når siden åpnes
  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="p-8">Laster...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl mb-4">Firestore Test</h1>

      <div className="grid gap-2 sm:grid-cols-2 mb-4">
        <input
          className="border rounded px-3 py-2"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Tittel"
        />
        <input
          className="border rounded px-3 py-2"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Beskrivelse"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <Button onClick={create}>Lagre</Button>
        <Button variant="outline" onClick={load}>Oppdater</Button>
      </div>

      {err && <p className="text-red-600 mb-4">{err}</p>}

      <div className="grid gap-3">
        {items.map(item => (
          <div key={item.id} className="border rounded p-4">
            <div className="font-bold">{item.title}</div>
            <div>{item.description}</div>
          </div>
        ))}
        {items.length === 0 && <p>Ingen dokumenter enda</p>}
      </div>
    </div>
  );
}