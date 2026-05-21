# Pulse

Foundational MVP of **Pulse** — a cinematic, spatial social experience centered on human activity in your city, in real time.

## Stack

- Next.js (App Router) + TypeScript
- React Three Fiber + Three.js (intro cinematic)
- Mapbox GL JS (globe projection, 3D terrain & buildings)
- Framer Motion (UI motion & swipeable panel)
- Tailwind CSS v4

## Phase 1 features

- Intro cinematic: pulsing Earth, heartbeat audio, solar-system pullback, deep space, rush back to city
- 3D Mapbox globe landing on user location
- Subtle building pulse animation
- Frosted-glass floating UI (profile, search, filters, event panel, bottom nav)
- Mock event pins & listings
- Location permission flow

## Setup

```bash
cd ~/pulse
cp .env.local.example .env.local
# Add your Mapbox public token to .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Mapbox

1. Create a token at [https://account.mapbox.com/](https://account.mapbox.com/)
2. Set `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env.local`

Without a token, the globe view shows a setup prompt after the intro.

## Project structure

```
src/
  app/              # Next.js routes
  components/
    intro/          # R3F cinematic sequence
    globe/          # Mapbox 3D city view
    ui/             # Frosted glass overlays
  hooks/            # Geolocation, pulse audio
  lib/              # Mock data
  types/
```

## Notes

- **Skip** on the intro bypasses the full ~31s sequence during development.
- Location uses the browser Geolocation API; denied access falls back to Chicago.
- All events and search results are mock data — no backend yet.
