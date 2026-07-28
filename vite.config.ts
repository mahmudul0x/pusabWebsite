// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Pin the Nitro target when NITRO_PRESET is set explicitly (Netlify sets it
// in netlify.toml -> emits .netlify/functions-internal/server), or fall back
// to "vercel" when building on Vercel (which always sets VERCEL=1). Locally
// both stay unset, so the build keeps its default output (dist/server/server.js)
// that `vite dev`/`vite preview` expect — hard-pinning a preset would break preview.
const nitroPreset = process.env.NITRO_PRESET ?? (process.env.VERCEL ? "vercel" : undefined);

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  ...(nitroPreset ? { nitro: { preset: nitroPreset } } : {}),
});
