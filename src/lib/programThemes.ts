import {
  Users,
  GraduationCap,
  HeartHandshake,
  Trees,
  Stethoscope,
  Radio,
  Award,
  type LucideIcon,
} from "lucide-react";

/**
 * Per-program visual identity for /programs/<slug>. Colors stay within the
 * site's existing palette (no new brand colors) but each program gets its
 * own accent pairing, icon and section emphasis so the 7 pages read as
 * distinct places rather than one template recolored.
 */
export interface ProgramTheme {
  Icon: LucideIcon;
  /** CSS color values (not var() names) used for this page's accent gradient. */
  colorA: string;
  colorB: string;
  /** Which optional section renders first, right after the overview. */
  emphasis: "stats" | "highlights" | "eligibility";
  /** Short one-word mood label shown as a kicker above the title. */
  mood: string;
}

export const PROGRAM_THEMES: Record<string, ProgramTheme> = {
  reunion: {
    Icon: Users,
    colorA: "#f59e0b",
    colorB: "#ef4444",
    emphasis: "stats",
    mood: "Celebration",
  },
  schooling: {
    Icon: GraduationCap,
    colorA: "#0ea5e9",
    colorB: "#22c55e",
    emphasis: "highlights",
    mood: "Education",
  },
  scholarship: {
    Icon: Award,
    colorA: "#22c55e",
    colorB: "#0ea5e9",
    emphasis: "stats",
    mood: "Opportunity",
  },
  felicitation: {
    Icon: Award,
    colorA: "#a855f7",
    colorB: "#ec4899",
    emphasis: "highlights",
    mood: "Recognition",
  },
  humanity: {
    Icon: Stethoscope,
    colorA: "#ef4444",
    colorB: "#f59e0b",
    emphasis: "eligibility",
    mood: "Relief",
  },
  picnic: {
    Icon: Trees,
    colorA: "#f97316",
    colorB: "#eab308",
    emphasis: "highlights",
    mood: "Togetherness",
  },
  online: {
    Icon: Radio,
    colorA: "#6366f1",
    colorB: "#06b6d4",
    emphasis: "eligibility",
    mood: "Digital",
  },
};

export const DEFAULT_THEME: ProgramTheme = {
  Icon: HeartHandshake,
  colorA: "var(--color-accent-1)",
  colorB: "var(--color-accent-2)",
  emphasis: "highlights",
  mood: "Program",
};

export function themeFor(slug: string): ProgramTheme {
  return PROGRAM_THEMES[slug] ?? DEFAULT_THEME;
}
