// Authentication calls against the Django JWT endpoints.

import { apiFetch, tokenStore } from "./client";
import type { User } from "./types";

interface TokenPair {
  access: string;
  refresh: string;
}

/** Log in with email + password, store the tokens, and return the user. */
export async function login(email: string, password: string): Promise<User> {
  const tokens = await apiFetch<TokenPair>(
    "/api/auth/token/",
    { method: "POST", body: JSON.stringify({ email, password }) },
    { auth: false },
  );
  tokenStore.save(tokens.access, tokens.refresh);
  return getMe();
}

/** Create a new account (not an admin by default). */
export async function register(input: {
  email: string;
  password: string;
  full_name?: string;
}): Promise<User> {
  return apiFetch<User>(
    "/api/auth/register/",
    { method: "POST", body: JSON.stringify(input) },
    { auth: false },
  );
}

/** The currently authenticated user (includes the `is_admin` flag). */
export async function getMe(): Promise<User> {
  return apiFetch<User>("/api/auth/me/");
}

export function logout(): void {
  tokenStore.clear();
}

export function isAuthenticated(): boolean {
  return Boolean(tokenStore.access);
}
