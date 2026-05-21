"use client";

import Image from "next/image";
import { Glass } from "./Glass";
import { MOCK_USER } from "@/lib/mockData";

export function ProfileChip() {
  return (
    <Glass variant="chip" className="relative flex items-center gap-2.5 px-2.5 py-1.5 pr-4">
      <div className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-white/25">
        <Image
          src={MOCK_USER.avatar}
          alt={MOCK_USER.name}
          width={36}
          height={36}
          className="h-full w-full object-cover"
          unoptimized
        />
      </div>
      <span className="text-sm font-medium tracking-tight text-white/90">
        {MOCK_USER.name}
      </span>
    </Glass>
  );
}
