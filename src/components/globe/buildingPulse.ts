import type mapboxgl from "mapbox-gl";

export const PULSE_BUILDING_LAYER = "3d-buildings";

export function setupBuildingPulse(map: mapboxgl.Map, layerId: string) {
  if (!map.getLayer(layerId)) return () => undefined;

  let phase = 0;
  let raf = 0;
  const pulsingIds: (number | string)[] = [];

  const pickBuildings = () => {
    pulsingIds.length = 0;
    const canvas = map.getCanvas();
    const features = map.queryRenderedFeatures(
      [
        [0, 0],
        [canvas.width, canvas.height],
      ],
      { layers: [layerId] },
    );
    const seen = new Set<string>();
    for (const f of features) {
      if (f.id == null) continue;
      const key = String(f.id);
      if (seen.has(key)) continue;
      seen.add(key);
      pulsingIds.push(f.id);
      if (pulsingIds.length >= 28) break;
    }
  };

  map.on("idle", pickBuildings);

  const animate = () => {
    phase += 0.018;
    for (let i = 0; i < pulsingIds.length; i++) {
      const pulse = (Math.sin(phase + i * 0.7) + 1) / 2;
      map.setFeatureState(
        { source: "composite", sourceLayer: "building", id: pulsingIds[i] },
        { pulse },
      );
    }
    raf = requestAnimationFrame(animate);
  };

  animate();

  return () => {
    cancelAnimationFrame(raf);
    map.off("idle", pickBuildings);
    for (const id of pulsingIds) {
      try {
        map.removeFeatureState(
          { source: "composite", sourceLayer: "building", id },
          "pulse",
        );
      } catch {
        /* layer may be gone */
      }
    }
  };
}

export function addPulseBuildingLayer(map: mapboxgl.Map): string {
  const layers = map.getStyle()?.layers ?? [];
  const existing = layers.find(
    (l) =>
      l.type === "fill-extrusion" &&
      "source-layer" in l &&
      l["source-layer"] === "building",
  );

  const paint = {
    "fill-extrusion-color": "#0a0a0c",
    "fill-extrusion-height": [
      "+",
      ["get", "height"],
      ["*", 6, ["coalesce", ["feature-state", "pulse"], 0]],
    ] as mapboxgl.Expression,
    "fill-extrusion-opacity": 0.92,
  };

  if (existing?.id) {
    map.setPaintProperty(existing.id, "fill-extrusion-color", "#0a0a0c");
    map.setPaintProperty(existing.id, "fill-extrusion-height", paint["fill-extrusion-height"]);
    map.setPaintProperty(existing.id, "fill-extrusion-opacity", 0.92);
    return existing.id;
  }

  if (map.getLayer(PULSE_BUILDING_LAYER)) return PULSE_BUILDING_LAYER;

  const labelLayerId = layers.find(
    (l) => l.type === "symbol" && l.layout?.["text-field"],
  )?.id;

  map.addLayer(
    {
      id: PULSE_BUILDING_LAYER,
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 14,
      paint: {
        ...paint,
        "fill-extrusion-base": ["get", "min_height"],
      },
    },
    labelLayerId,
  );

  return PULSE_BUILDING_LAYER;
}
