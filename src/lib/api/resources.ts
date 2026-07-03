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
  ProgramPage,
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

function crud<T, Body = Partial<T>>(resource: string, requiresAuth = false) {
  const base = `/api/${resource}/`;
  return {
    list: (params?: Query) =>
      apiFetch<Paginated<T>>(`${base}${qs(params)}`, {}, { auth: requiresAuth }),
    /** Convenience: fetch all results, following pagination until exhausted. */
    listAll: async (params?: Query): Promise<T[]> => {
      const results: T[] = [];
      // First page via apiFetch so the auth token is attached when needed.
      let page = await apiFetch<Paginated<T>>(
        `${base}${qs({ ...params, page_size: 200 })}`,
        {},
        { auth: requiresAuth },
      );
      results.push(...page.results);
      // Subsequent pages: the `next` field is an absolute URL, so fetch
      // directly but keep the auth header if required.
      while (page.next) {
        const headers: Record<string, string> = { Accept: "application/json" };
        if (requiresAuth) {
          const { tokenStore } = await import("./client");
          if (tokenStore.access) headers["Authorization"] = `Bearer ${tokenStore.access}`;
        }
        const res = await fetch(page.next, { headers });
        if (!res.ok) throw new Error(`API error ${res.status}`);
        page = await res.json();
        results.push(...page.results);
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
export const contactApi = crud<ContactMessage>("contact", true); // admin-only read
export const usersApi = crud<AdminUser>("users", true);
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

// Program detail pages — looked up by slug (matches the /programs/<slug> route).
export const programPagesApi = {
  listAll: async (): Promise<ProgramPage[]> => {
    const page = await apiFetch<Paginated<ProgramPage>>(
      "/api/program-pages/",
      {},
      { auth: false },
    );
    return page.results;
  },
  get: (slug: string) =>
    apiFetch<ProgramPage>(`/api/program-pages/${slug}/`, {}, { auth: false }),
  update: (slug: string, body: Partial<ProgramPage>) =>
    apiFetch<ProgramPage>(`/api/program-pages/${slug}/`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};
