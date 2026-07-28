/**
 * Session/EC label helpers.
 *
 * A PUSAB session spans two calendar years, so a session that starts in 2026
 * is written "2026-2027". Keep every label going through these helpers so the
 * site never shows a bare start year.
 */

export const FOUNDING_YEAR = 2014;

const ORDINAL_WORDS = [
  "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth",
  "Ninth", "Tenth", "Eleventh", "Twelfth", "Thirteenth", "Fourteenth", "Fifteenth",
];

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/** 2014 -> "1st", 2015 -> "2nd" — the EC's number since founding. */
export function ecOrdinal(year: number) {
  return ordinal(year - FOUNDING_YEAR + 1);
}

/** 2014 -> "First", 2015 -> "Second" — spelled-out EC number. */
export function ecOrdinalWord(year: number) {
  const n = year - FOUNDING_YEAR + 1;
  if (n < 1) return null;
  return ORDINAL_WORDS[n - 1] ?? ordinal(n);
}

/** 2026 -> "2026-2027". The canonical way to render a session year. */
export function sessionSpan(year: number) {
  return `${year}-${year + 1}`;
}

/** 2026 -> "Session 2026-2027". */
export function sessionLabel(year: number) {
  return `Session ${sessionSpan(year)}`;
}

/** 2014 -> "First EC (2014-2015)"; falls back to a plain session label. */
export function ecSessionLabel(year: number) {
  const word = ecOrdinalWord(year);
  return word ? `${word} EC (${sessionSpan(year)})` : sessionLabel(year);
}
