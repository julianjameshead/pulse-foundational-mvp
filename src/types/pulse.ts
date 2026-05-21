export type AppPhase = "intro" | "location" | "globe";

export type NavTab = "groups" | "chats" | "profile" | "other";

export interface UserLocation {
  latitude: number;
  longitude: number;
  city: string;
  accuracy?: number;
}

export interface PulseEvent {
  id: string;
  title: string;
  venue: string;
  area: string;
  city: string;
  date: string;
  time: string;
  type: "music" | "art" | "food" | "nightlife" | "community" | "sports";
  latitude: number;
  longitude: number;
  attendees: number;
  isLive?: boolean;
}

export interface SearchResult {
  id: string;
  label: string;
  category: "city" | "event" | "group" | "chat" | "friend" | "location";
  meta?: string;
}
