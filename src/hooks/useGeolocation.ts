"use client";

import { useCallback, useState } from "react";
import { CITIES, DEFAULT_CITY, DEFAULT_COORDS } from "@/lib/mockData";
import type { UserLocation } from "@/types/pulse";

function nearestCity(lat: number, lng: number): string {
  let best = DEFAULT_CITY;
  let min = Infinity;
  for (const c of CITIES) {
    const d =
      (c.latitude - lat) ** 2 + (c.longitude - lng) ** 2;
    if (d < min) {
      min = d;
      best = c.name;
    }
  }
  return best;
}

export function useGeolocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [status, setStatus] = useState<
    "idle" | "prompting" | "granted" | "denied" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("error");
      setError("Geolocation is not supported on this device.");
      setLocation({
        ...DEFAULT_COORDS,
        city: DEFAULT_CITY,
      });
      return;
    }

    setStatus("prompting");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setLocation({
          latitude,
          longitude,
          city: nearestCity(latitude, longitude),
          accuracy,
        });
        setStatus("granted");
      },
      (err) => {
        setStatus("denied");
        setError(err.message);
        setLocation({
          ...DEFAULT_COORDS,
          city: DEFAULT_CITY,
        });
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }, []);

  return { location, status, error, requestLocation, setLocation };
}
