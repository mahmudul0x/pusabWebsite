/**
 * Canonical Executive Committee designation hierarchy. Members should always
 * be listed in this order — President down to Executive Member — rather than
 * alphabetically, so the roster reads the way a real org chart would.
 */
export const DESIGNATION_ORDER = [
  "President",
  "Vice President",
  "General Secretary",
  "Joint General Secretary",
  "Treasurer",
  "Organizing Secretary",
  "Office Secretary",
  "Assistant Office Secretary",
  "Publicity Secretary",
  "Assistant Publicity Secretary",
  "Human Resource Development Secretary",
  "Assistant Human Resource Development Secretary",
  "Compilation and Publication Secretary",
  "Assistant Compilation and Publication Secretary",
  "Schooling Secretary",
  "Assistant Schooling Secretary",
  "Scholarship Secretary",
  "Assistant Scholarship Secretary",
  "Information and Technology Secretary",
  "Assistant Information and Technology Secretary",
  "Hospitality Secretary",
  "Assistant Hospitality Secretary",
  "Cultural Secretary",
  "Assistant Cultural Secretary",
  "Sports Secretary",
  "Assistant Sports Secretary",
  "Health Secretary",
  "Assistant Health Secretary",
  "Assistant Secretary",
  "Executive Member",
] as const;

const RANK = new Map(DESIGNATION_ORDER.map((role, i) => [role.toLowerCase(), i]));

/** Rank of a role in the designation hierarchy — unknown roles sort last, alphabetically among themselves. */
export function designationRank(role: string): number {
  return RANK.get(role.trim().toLowerCase()) ?? DESIGNATION_ORDER.length;
}

/** Comparator for sorting members by designation hierarchy, then by name. */
export function byDesignation<T extends { role: string; name: string }>(a: T, b: T): number {
  const diff = designationRank(a.role) - designationRank(b.role);
  if (diff !== 0) return diff;
  return a.role.localeCompare(b.role) || a.name.localeCompare(b.name);
}
