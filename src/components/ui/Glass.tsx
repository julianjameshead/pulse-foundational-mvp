"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GlassProps {
  children: ReactNode;
  className?: string;
  variant?: "bubble" | "panel" | "chip";
}

const variants = {
  bubble:
    "rounded-full border border-white/20 bg-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl",
  panel:
    "rounded-[28px] border border-white/18 bg-white/[0.07] shadow-[0_12px_48px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-3xl",
  chip:
    "rounded-2xl border border-white/15 bg-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl",
};

export function Glass({ children, className = "", variant = "bubble" }: GlassProps) {
  return (
    <div className={`relative ${variants[variant]} ${className}`}>
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/[0.14] to-transparent opacity-60" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function GlassMotion({
  children,
  className = "",
  variant = "panel",
  ...props
}: GlassProps & React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div className={`relative ${variants[variant]} ${className}`} {...props}>
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/[0.12] to-transparent" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
