"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useGeolocation } from "@/hooks/useGeolocation";
import { DEFAULT_CITY, DEFAULT_COORDS, MOCK_EVENTS } from "@/lib/mockData";
import type { AppPhase, NavTab, SearchResult, UserLocation } from "@/types/pulse";
import { ProfileChip } from "./ui/ProfileChip";
import { TopActions } from "./ui/TopActions";
import { SearchBar } from "./ui/SearchBar";
import { BottomNav } from "./ui/BottomNav";
import { EventPanel } from "./ui/EventPanel";
import { LocationPrompt } from "./ui/LocationPrompt";

const IntroSequence = dynamic(
  () => import("./intro/IntroSequence").then((m) => m.IntroSequence),
  { ssr: false },
);

const PulseGlobe = dynamic(
  () => import("./globe/PulseGlobe").then((m) => m.PulseGlobe),
  { ssr: false },
);

export function PulseApp() {
  const [phase, setPhase] = useState<AppPhase>("intro");
  const [navTab, setNavTab] = useState<NavTab>("groups");
  const [activeCity, setActiveCity] = useState(DEFAULT_CITY);
  const { location, status, error, requestLocation, setLocation } =
    useGeolocation();

  const userLocation: UserLocation = location ?? {
    ...DEFAULT_COORDS,
    city: DEFAULT_CITY,
  };

  const handleIntroComplete = useCallback(() => {
    setPhase("location");
  }, []);

  const handleLocationResolved = useCallback(() => {
    if (location) setActiveCity(location.city);
    setPhase("globe");
  }, [location]);

  const handleSearchSelect = useCallback((result: SearchResult) => {
    if (result.category === "city") {
      setActiveCity(result.label);
    }
  }, []);

  const skipLocation = useCallback(() => {
    setLocation({
      ...DEFAULT_COORDS,
      city: DEFAULT_CITY,
    });
    setActiveCity(DEFAULT_CITY);
    setPhase("globe");
  }, [setLocation]);

  useEffect(() => {
    if (phase === "location" && (status === "granted" || status === "denied")) {
      const t = setTimeout(handleLocationResolved, 600);
      return () => clearTimeout(t);
    }
  }, [phase, status, handleLocationResolved]);

  return (
    <div className="pulse-root relative h-[100dvh] w-full overflow-hidden bg-[#030308]">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <IntroSequence key="intro" onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {phase === "location" && (
        <LocationPrompt
          onAllow={requestLocation}
          onSkip={skipLocation}
          error={error}
        />
      )}

      {phase === "globe" && (
        <>
          <div className="absolute inset-0">
            <PulseGlobe location={userLocation} events={MOCK_EVENTS} />
          </div>

          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
            <header className="pointer-events-auto safe-top flex items-start justify-between gap-3 px-4 pt-4">
              <ProfileChip />
              <TopActions />
            </header>

            <div className="pointer-events-auto flex justify-center px-4 pt-3">
              <SearchBar onSelect={handleSearchSelect} />
            </div>

            <div className="flex-1" />

            <footer className="pointer-events-auto safe-bottom flex flex-col gap-3 px-4 pb-4">
              <EventPanel city={activeCity} />
              <BottomNav active={navTab} onChange={setNavTab} />
            </footer>
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-24 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-40 bg-gradient-to-t from-black/60 to-transparent" />
        </>
      )}
    </div>
  );
}
