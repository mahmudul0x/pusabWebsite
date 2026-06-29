import { useQuery } from "@tanstack/react-query";
import { committeeApi, type EcMember } from "@/lib/api";

const STALE_MS = 5 * 60 * 1000; // 5 minutes

/** Fetch ALL committee members once and cache. All pages share this result. */
export function useAllMembers() {
  return useQuery<EcMember[]>({
    queryKey: ["committee", "all"],
    queryFn: () => committeeApi.listAll(),
    staleTime: STALE_MS,
  });
}

/** Filter to a specific year from the shared cache. */
export function useMembersByYear(year: number) {
  return useQuery<EcMember[]>({
    queryKey: ["committee", "year", year],
    queryFn: () => committeeApi.listAll({ year }),
    staleTime: STALE_MS,
  });
}

/** Filter to current session from the shared cache. */
export function useCurrentMembers() {
  return useQuery<EcMember[]>({
    queryKey: ["committee", "current"],
    queryFn: () => committeeApi.listAll({ current: true }),
    staleTime: STALE_MS,
  });
}
