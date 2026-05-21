"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { PulseEvent, UserLocation } from "@/types/pulse";
import { addPulseBuildingLayer, setupBuildingPulse } from "./buildingPulse";

interface PulseGlobeProps {
  location: UserLocation;
  events: PulseEvent[];
  onMapReady?: (map: mapboxgl.Map) => void;
}

const PULSE_STYLE_OVERRIDES = {
  background: "#030308",
  water: "#0a1628",
  fog: "#030308",
};

export function PulseGlobe({ location, events, onMapReady }: PulseGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!containerRef.current || !token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [location.longitude, location.latitude],
      zoom: 15.2,
      pitch: 62,
      bearing: -18,
      antialias: true,
      projection: "globe",
    });

    mapRef.current = map;
    let cleanupPulse: (() => void) | undefined;

    map.on("style.load", () => {
      map.setFog({
        color: PULSE_STYLE_OVERRIDES.fog,
        "high-color": "#1a2844",
        "horizon-blend": 0.08,
        "space-color": "#020208",
        "star-intensity": 0.35,
      });

      if (map.getSource("mapbox-dem")) {
        map.setTerrain({ source: "mapbox-dem", exaggeration: 1.15 });
      }

      const buildingLayerId = addPulseBuildingLayer(map);
      cleanupPulse = setupBuildingPulse(map, buildingLayerId);

      map.addSource("pulse-events", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: events.map((e) => ({
            type: "Feature",
            properties: {
              id: e.id,
              title: e.title,
              isLive: e.isLive ?? false,
            },
            geometry: {
              type: "Point",
              coordinates: [e.longitude, e.latitude],
            },
          })),
        },
      });

      map.addLayer({
        id: "pulse-event-glow",
        type: "circle",
        source: "pulse-events",
        paint: {
          "circle-radius": ["case", ["get", "isLive"], 14, 10],
          "circle-color": [
            "case",
            ["get", "isLive"],
            "rgba(120, 220, 255, 0.35)",
            "rgba(180, 140, 255, 0.28)",
          ],
          "circle-blur": 0.85,
        },
      });

      map.addLayer({
        id: "pulse-event-pins",
        type: "circle",
        source: "pulse-events",
        paint: {
          "circle-radius": ["case", ["get", "isLive"], 6, 5],
          "circle-color": "#e8f4ff",
          "circle-stroke-width": 2,
          "circle-stroke-color": [
            "case",
            ["get", "isLive"],
            "rgba(80, 200, 255, 0.9)",
            "rgba(160, 120, 255, 0.85)",
          ],
        },
      });

      // User pinpoint
      map.addSource("pulse-user", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: [location.longitude, location.latitude],
          },
        },
      });

      map.addLayer({
        id: "pulse-user-ring",
        type: "circle",
        source: "pulse-user",
        paint: {
          "circle-radius": 18,
          "circle-color": "rgba(100, 200, 255, 0.15)",
          "circle-stroke-width": 1,
          "circle-stroke-color": "rgba(100, 200, 255, 0.5)",
        },
      });

      map.addLayer({
        id: "pulse-user-dot",
        type: "circle",
        source: "pulse-user",
        paint: {
          "circle-radius": 5,
          "circle-color": "#7dd3fc",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });
    });

    map.on("load", () => {
      map.flyTo({
        center: [location.longitude, location.latitude],
        zoom: 16,
        pitch: 64,
        bearing: -24,
        speed: 0.6,
        curve: 1.4,
        essential: true,
      });
      onMapReady?.(map);
    });

    return () => {
      cleanupPulse?.();
      map.remove();
      mapRef.current = null;
    };
  }, [location.latitude, location.longitude, events, onMapReady]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#030308] p-8 text-center">
        <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <p className="text-lg font-medium text-white/90">Mapbox token required</p>
          <p className="mt-2 text-sm text-white/50">
            Copy <code className="text-cyan-300/90">.env.local.example</code> to{" "}
            <code className="text-cyan-300/90">.env.local</code> and add your{" "}
            <code className="text-cyan-300/90">NEXT_PUBLIC_MAPBOX_TOKEN</code>.
          </p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full" />;
}
