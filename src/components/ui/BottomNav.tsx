"use client";

import type { NavTab } from "@/types/pulse";
import { Glass } from "./Glass";

const TABS: { id: NavTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "groups",
    label: "Groups",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="9" cy="8" r="3" />
        <circle cx="16" cy="9" r="2.5" />
        <path d="M4 19c0-2.5 2.2-4 5-4M13 19c0-2 1.5-3.5 3.5-3.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "chats",
    label: "Chats",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M5 6h14v9H9l-4 4V6z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "other",
    label: "Other",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="6" cy="12" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="18" cy="12" r="1.5" />
      </svg>
    ),
  },
];

interface BottomNavProps {
  active: NavTab;
  onChange: (tab: NavTab) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <Glass variant="panel" className="relative mx-auto flex w-full max-w-sm justify-between px-6 py-3">
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex flex-col items-center gap-1 transition ${
              isActive ? "text-cyan-300" : "text-white/45 hover:text-white/70"
            }`}
          >
            {tab.icon}
            <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
          </button>
        );
      })}
    </Glass>
  );
}
