import {
  BookOpen,
  GraduationCap,
  Coins,
  Brain,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { optimizeImage, type ProgramWebinar } from "@/lib/api";

const BLUE = "var(--color-accent-1)";
const GRADIENT = `linear-gradient(120deg, var(--color-accent-1), var(--color-accent-2))`;

// Each event card gets its own banner gradient + icon based on its tag, so
// the grid reads with the same visual variety as the reference (talk show =
// navy books, workshop = purple growth, seminar = teal chart, discussion =
// green brain), independent of site-wide accent tokens.
const TAG_STYLE: Record<string, { gradient: string; Icon: LucideIcon }> = {
  "Talk Show": { gradient: "linear-gradient(135deg, #1E3A8A, #1D4ED8)", Icon: BookOpen },
  Workshop: { gradient: "linear-gradient(135deg, #4C1D95, #7C3AED)", Icon: GraduationCap },
  Seminar: { gradient: "linear-gradient(135deg, #0F3D3E, #0E7490)", Icon: Coins },
  Discussion: { gradient: "linear-gradient(135deg, #14532D, #15803D)", Icon: Brain },
};
const DEFAULT_TAG_STYLE = { gradient: GRADIENT, Icon: Sparkles };

export function EventCard({ w }: { w: ProgramWebinar }) {
  const style = TAG_STYLE[w.tag] ?? DEFAULT_TAG_STYLE;
  const isLive = w.status === "live";
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)] transition-all duration-300 hover:-translate-y-1">
      <div className="relative flex aspect-[16/10] items-center justify-center p-5" style={{ background: style.gradient }}>
        <span
          className={
            "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white " +
            (isLive ? "bg-red-600" : "bg-white/20 backdrop-blur")
          }
        >
          {isLive && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          )}
          {isLive ? "Live" : "Upcoming"}
        </span>
        <style.Icon size={40} className="text-white/85" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: BLUE }}>
          {w.tag}
        </p>
        <h3 className="mt-2 font-display text-base font-bold leading-snug tracking-tight">{w.title}</h3>

        {w.speaker_name && (
          <div className="mt-4 flex items-center gap-2.5">
            {w.speaker_photo_url ? (
              <img src={optimizeImage(w.speaker_photo_url, 80)} alt={w.speaker_name} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold text-white" style={{ background: style.gradient }}>
                {w.speaker_name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold leading-tight">{w.speaker_name}</p>
              {w.speaker_role && <p className="text-[11px] text-muted-foreground">{w.speaker_role}</p>}
            </div>
          </div>
        )}

        {(w.event_date || w.event_time) && (
          <p className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
            {w.event_date}
            {w.event_date && w.event_time && <span className="mx-1.5 text-foreground/30">·</span>}
            {w.event_time}
          </p>
        )}

        <div className="mt-4 flex items-center gap-2.5">
          <button className="flex-1 rounded-lg border border-border px-3 py-2 text-xs font-bold text-foreground/80 transition-colors hover:text-foreground">
            View Details
          </button>
          <a
            href={w.register_url || "#"}
            className="flex-1 rounded-lg px-3 py-2 text-center text-xs font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: GRADIENT }}
          >
            Register Now
          </a>
        </div>
      </div>
    </div>
  );
}
