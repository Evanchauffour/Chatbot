/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

interface ForecastDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicule: {
    make: string;
    model: string;
    year: number;
    mileage: number;
  };
}

interface ForecastItem {
  name: string;
  recommendedInKm: number;
}

export default function ForecastDialog({
  open,
  onOpenChange,
  vehicule,
}: ForecastDialogProps) {
  const [forecasts, setForecasts] = useState<ForecastItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    async function fetchForecasts() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("http://localhost:8000/api/previsions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ vehicule }),
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Erreur HTTP ${res.status}`);
        }

        const data = await res.json();

        if (data.error) {
          setError(data.error);
          setForecasts([]);
        } else {
          const mappedForecasts = data.predictions.map((p: any) => ({
            name: p.operation,
            recommendedInKm: p.predicted_km - vehicule.mileage,
          }));
          setForecasts(mappedForecasts);
        }
      } catch (e: any) {
        setError(e.message || "Erreur inconnue");
        setForecasts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchForecasts();
  }, [open, vehicule]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Prévisions futures</DialogTitle>
          <DialogDescription>
            Affichage des opérations recommandées selon le kilométrage actuel du
            véhicule.
          </DialogDescription>
        </DialogHeader>

        {loading && <p>Chargement des prévisions...</p>}

        {error && <p className="text-red-600">Erreur : {error}</p>}

        {!loading && !error && (
          <ul className="space-y-2 mt-2">
            {forecasts.length === 0 && <li>Aucune prévision disponible</li>}
            {forecasts.map((item, i) => (
              <li key={i} className="text-sm">
                {item.name} → Dans environ{" "}
                <strong>{item.recommendedInKm} km</strong>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
