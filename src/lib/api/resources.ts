// Typed CRUD helpers for each API resource. Reads are public; writes need an
// admin token (handled automatically by apiFetch).

import { apiFetch, API_URL } from "./client";
import type {
  AdminUser,
  ContactMessage,
  EcMember,
  FelicitationEntry,
  GalleryItem,
  LeaderMessage,
  Paginated,
  Program,
  PublicityPost,
  SiteSettings,
} from "./types";

type QueryValue = string | number | boolean | undefined;
type Query = Record<string, QueryValue>;

function qs(params?: Query): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const s = search.toString();
  return s ? `?${s}` : "";
}

function crud<T, Body = Partial<T>>(resource: string) {
  const base = `/api/${resource}/`;
  return {
    list: (params?: Query) => apiFetch<Paginated<T>>(`${base}${qs(params)}`, {}, { auth: false }),
    /** Convenience: fetch all results, following pagination until exhausted. */
    listAll: async (params?: Query): Promise<T[]> => {
      const results: T[] = [];
      // Use a full URL for the first request; subsequent pages use the absolute
      // `next` URL returned by the API directly (bypassing apiFetch's prefix).
      let nextUrl: string | null =
        `${API_URL}${base}${qs({ ...params, page_size: 200 })}`;
      while (nextUrl) {
        const res = await fetch(nextUrl, { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const page: Paginated<T> = await res.json();
        results.push(...page.results);
        nextUrl = page.next;
      }
      return results;
    },
    get: (id: number) => apiFetch<T>(`${base}${id}/`, {}, { auth: false }),
    create: (body: Body) => apiFetch<T>(base, { method: "POST", body: JSON.stringify(body) }),
    update: (id: number, body: Body) =>
      apiFetch<T>(`${base}${id}/`, { method: "PATCH", body: JSON.stringify(body) }),
    remove: (id: number) => apiFetch<void>(`${base}${id}/`, { method: "DELETE" }),
  };
}

export const galleryApi = crud<GalleryItem>("gallery");
export const publicityApi = crud<PublicityPost>("publicity");
export const committeeApi = crud<EcMember>("committee");
export const programsApi = crud<Program>("programs");
export const contactApi = crud<ContactMessage>("contact");
export const usersApi = crud<AdminUser>("users");
export const felicitationApi = crud<FelicitationEntry>("felicitation");

// Leader messages (President / General Secretary) — looked up by role string.
export const leaderMessageApi = {
  list: () =>
    apiFetch<Paginated<LeaderMessage>>("/api/leader-messages/", {}, { auth: false }),
  listAll: async (): Promise<LeaderMessage[]> => {
    const page = await apiFetch<Paginated<LeaderMessage>>(
      "/api/leader-messages/",
      {},
      { auth: false },
    );
    return page.results;
  },
  get: (role: "president" | "secretary") =>
    apiFetch<LeaderMessage>(`/api/leader-messages/${role}/`, {}, { auth: false }),
  update: (role: "president" | "secretary", body: Partial<LeaderMessage>) =>
    apiFetch<LeaderMessage>(`/api/leader-messages/${role}/`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};

// Site settings is a singleton (no list/id) — read public, update by admins.
export const settingsApi = {
  get: () => apiFetch<SiteSettings>("/api/settings/", {}, { auth: false }),
  update: (body: Partial<SiteSettings>) =>
    apiFetch<SiteSettings>("/api/settings/", { method: "PATCH", body: JSON.stringify(body) }),
};
