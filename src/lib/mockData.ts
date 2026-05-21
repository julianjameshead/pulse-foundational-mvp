import type { PulseEvent, SearchResult } from "@/types/pulse";

export const MOCK_USER = {
  name: "Alex Rivera",
  avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=AlexRivera",
};

export const DEFAULT_CITY = "Chicago";
export const DEFAULT_COORDS = { latitude: 41.8781, longitude: -87.6298 };

export const CITIES = [
  { name: "Chicago", latitude: 41.8781, longitude: -87.6298 },
  { name: "San Francisco", latitude: 37.7749, longitude: -122.4194 },
  { name: "New York", latitude: 40.7128, longitude: -74.006 },
  { name: "Los Angeles", latitude: 34.0522, longitude: -118.2437 },
  { name: "Miami", latitude: 25.7617, longitude: -80.1918 },
];

export const EVENT_TYPES = [
  "all",
  "music",
  "art",
  "food",
  "nightlife",
  "community",
  "sports",
] as const;

function tonightISO(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export const MOCK_EVENTS: PulseEvent[] = [
  {
    id: "e1",
    title: "Neon Jazz Loft",
    venue: "The Violet Room",
    area: "River North",
    city: "Chicago",
    date: tonightISO(),
    time: "9:30 PM",
    type: "music",
    latitude: 41.8902,
    longitude: -87.6284,
    attendees: 84,
    isLive: true,
  },
  {
    id: "e2",
    title: "Midnight Gallery Walk",
    venue: "Pulse Arts District",
    area: "West Loop",
    city: "Chicago",
    date: tonightISO(),
    time: "10:00 PM",
    type: "art",
    latitude: 41.8819,
    longitude: -87.6501,
    attendees: 132,
  },
  {
    id: "e3",
    title: "Rooftop Synth Night",
    venue: "Skyline Terrace",
    area: "South Loop",
    city: "Chicago",
    date: tonightISO(1),
    time: "8:00 PM",
    type: "nightlife",
    latitude: 41.8676,
    longitude: -87.6244,
    attendees: 210,
  },
  {
    id: "e4",
    title: "Lakefront Run Club",
    venue: "Grant Park",
    area: "Loop",
    city: "Chicago",
    date: tonightISO(2),
    time: "6:30 AM",
    type: "sports",
    latitude: 41.8756,
    longitude: -87.6189,
    attendees: 48,
  },
  {
    id: "e5",
    title: "Chef's Table: Ember",
    venue: "Ember House",
    area: "Fulton Market",
    city: "Chicago",
    date: tonightISO(),
    time: "7:45 PM",
    type: "food",
    latitude: 41.8865,
    longitude: -87.6522,
    attendees: 26,
  },
  {
    id: "e6",
    title: "Community Signal Jam",
    venue: "Pulse Hub",
    area: "Wicker Park",
    city: "Chicago",
    date: tonightISO(3),
    time: "5:00 PM",
    type: "community",
    latitude: 41.9088,
    longitude: -87.6794,
    attendees: 61,
  },
];

export const SEARCH_INDEX: SearchResult[] = [
  ...CITIES.map((c) => ({
    id: `city-${c.name}`,
    label: c.name,
    category: "city" as const,
    meta: "City",
  })),
  ...MOCK_EVENTS.map((e) => ({
    id: `event-${e.id}`,
    label: e.title,
    category: "event" as const,
    meta: `${e.city} · ${e.time}`,
  })),
  { id: "g1", label: "Night Owls", category: "group", meta: "24 members" },
  { id: "g2", label: "Lakefront Creatives", category: "group", meta: "89 members" },
  { id: "c1", label: "Maya Chen", category: "friend", meta: "Online" },
  { id: "c2", label: "Jordan Lee", category: "friend", meta: "At an event" },
  { id: "ch1", label: "Weekend Plans", category: "chat", meta: "3 unread" },
  { id: "l1", label: "The Violet Room", category: "location", meta: "River North" },
];
