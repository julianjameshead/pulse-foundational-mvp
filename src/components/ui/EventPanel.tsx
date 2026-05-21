"use client";

import { useEffect, useMemo, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { GlassMotion } from "./Glass";
import { CITIES, EVENT_TYPES, MOCK_EVENTS } from "@/lib/mockData";
import type { PulseEvent } from "@/types/pulse";

const COLLAPSED = 52;

interface EventPanelProps {
  city: string;
}

export function EventPanel({ city }: EventPanelProps) {
  const [panelHeight, setPanelHeight] = useState(480);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const update = () =>
      setPanelHeight(Math.min(520, window.innerHeight * 0.58));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const EXPANDED = panelHeight;
  const [dateFilter, setDateFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState(city);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const y = useMotionValue(0);
  const height = useTransform(y, [-EXPANDED + COLLAPSED, 0], [EXPANDED, COLLAPSED]);

  const areas = useMemo(() => {
    const set = new Set(MOCK_EVENTS.map((e) => e.area));
    return ["all", ...set];
  }, []);

  const dates = useMemo(() => {
    const set = new Set(MOCK_EVENTS.map((e) => e.date));
    return ["", ...set];
  }, []);

  const filtered = useMemo(() => {
    return MOCK_EVENTS.filter((e) => {
      if (cityFilter !== "all" && e.city !== cityFilter) return false;
      if (areaFilter !== "all" && e.area !== areaFilter) return false;
      if (typeFilter !== "all" && e.type !== typeFilter) return false;
      if (dateFilter && e.date !== dateFilter) return false;
      return true;
    });
  }, [cityFilter, areaFilter, typeFilter, dateFilter]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -80 || info.velocity.y < -400) {
      setExpanded(true);
      y.set(-EXPANDED + COLLAPSED);
    } else if (info.offset.y > 40 || info.velocity.y > 300) {
      setExpanded(false);
      y.set(0);
    }
  };

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    y.set(next ? -EXPANDED + COLLAPSED : 0);
  };

  return (
    <motion.div
      style={{ height }}
      className="relative mx-auto w-full max-w-lg touch-pan-y"
    >
      <GlassMotion
        variant="panel"
        drag="y"
        dragConstraints={{ top: -(EXPANDED - COLLAPSED), bottom: 0 }}
        dragElastic={0.08}
        style={{ y }}
        onDragEnd={onDragEnd}
        className="absolute bottom-0 left-0 right-0 flex max-h-full flex-col overflow-hidden"
      >
        <button
          type="button"
          onClick={toggle}
          className="flex w-full shrink-0 flex-col items-center pt-3 pb-2"
          aria-expanded={expanded}
        >
          <div className="mb-2 h-1 w-10 rounded-full bg-white/25" />
          {!expanded && (
            <p className="text-[11px] font-medium tracking-[0.2em] text-white/45 uppercase">
              Tonight in {city}
            </p>
          )}
        </button>

        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-1 flex-col gap-4 overflow-hidden px-4 pb-4"
          >
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white/95">
                What&apos;s alive tonight
              </h2>
              <p className="text-xs text-white/40">Swipe down to collapse</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <FilterSelect
                label="Date"
                value={dateFilter}
                onChange={setDateFilter}
                options={dates.map((d) => ({
                  value: d,
                  label: d ? formatDate(d) : "All dates",
                }))}
              />
              <FilterSelect
                label="Area"
                value={areaFilter}
                onChange={setAreaFilter}
                options={areas.map((a) => ({
                  value: a,
                  label: a === "all" ? "All areas" : a,
                }))}
              />
              <FilterSelect
                label="City"
                value={cityFilter}
                onChange={setCityFilter}
                options={[
                  { value: "all", label: "All cities" },
                  ...CITIES.map((c) => ({ value: c.name, label: c.name })),
                ]}
              />
              <FilterSelect
                label="Type"
                value={typeFilter}
                onChange={setTypeFilter}
                options={EVENT_TYPES.map((t) => ({
                  value: t,
                  label: t === "all" ? "All types" : t,
                }))}
              />
            </div>

            <ul className="flex-1 space-y-2 overflow-y-auto pr-1">
              {filtered.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
              {filtered.length === 0 && (
                <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-white/45">
                  No events match — pin something new on the globe.
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </GlassMotion>
    </motion.div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-wider text-white/35">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-white/10 bg-black/30 px-2 py-2 text-xs text-white/85 outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function EventRow({ event }: { event: PulseEvent }) {
  return (
    <li className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition hover:bg-white/[0.07]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-white/92">{event.title}</p>
          <p className="text-xs text-white/45">
            {event.venue} · {event.area}
          </p>
        </div>
        {event.isLive && (
          <span className="shrink-0 rounded-full bg-cyan-400/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
            Live
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center gap-3 text-[11px] text-white/40">
        <span>{event.time}</span>
        <span>{formatDate(event.date)}</span>
        <span>{event.attendees} going</span>
      </div>
    </li>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
