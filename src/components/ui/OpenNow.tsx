"use client";

import { useEffect, useState } from "react";
import { getSite } from "@/lib/content";

const TZ = "America/Los_Angeles";

function parseHM(hm: string): number {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
}

function minutesNowInTz(): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return (h % 24) * 60 + m;
}

function fmt(hm: string): string {
  const [h, m] = hm.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const hr = h % 12 || 12;
  return m ? `${hr}:${String(m).padStart(2, "0")} ${period}` : `${hr}:00 ${period}`;
}

/**
 * Live "Open now / Opens at …" chip, computed in the restaurant's timezone
 * (open daily, so only the clock matters). Renders nothing until mounted so
 * the server HTML never disagrees with the client.
 */
export default function OpenNow({
  className = "",
  compact = false,
}: {
  className?: string;
  /** Short two-line label for tight spots (e.g. the mobile order bar). */
  compact?: boolean;
}) {
  const { hours } = getSite();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(minutesNowInTz());
    const id = setInterval(() => setNow(minutesNowInTz()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (now === null) return null;

  const open = now >= parseHM(hours.opens) && now < parseHM(hours.closes);
  const label = compact
    ? open
      ? ["Open now", `until ${fmt(hours.closes)}`]
      : ["Closed", `opens ${fmt(hours.opens)}`]
    : open
      ? [`Open now · until ${fmt(hours.closes)}`]
      : [`Closed · opens ${fmt(hours.opens)}`];

  return (
    <span
      className={`inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] ${className}`}
    >
      <span
        aria-hidden
        className={`h-[7px] w-[7px] shrink-0 rounded-full ${open ? "bg-olive" : "bg-sand"}`}
      />
      {compact ? (
        <span className="whitespace-nowrap leading-normal">
          {label[0]}
          <span className="block text-[11px] font-medium normal-case tracking-normal opacity-80">
            {label[1]}
          </span>
        </span>
      ) : (
        label[0]
      )}
    </span>
  );
}
