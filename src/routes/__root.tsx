import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

import appCss from "../styles.css?url";
import faviconPusab from "../assets/logo-pusab.png?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { FloatingNavbar } from "../components/site/FloatingNavbar";
import { FlipbookContext } from "../lib/flipbook-context";
import { SiteFooter } from "../components/site/SiteFooter";
import { BackToTop } from "../components/site/BackToTop";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-background)] px-6">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-[var(--color-accent-1)] opacity-10 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(color-mix(in_oklab,var(--color-foreground)_4%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--color-foreground)_4%,transparent)_1px,transparent_1px)] [background-size:40px_40px] opacity-50" />
      <div className="relative max-w-lg text-center">
        <p className="font-display text-[7rem] font-extrabold leading-none gradient-text sm:text-[10rem]">
          404
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">
          This page wandered off.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
          The page you're looking for doesn't exist or has moved. Let's get you back on track.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Home size={16} /> Go home
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#07070D" },
      { title: "PUSAB — Public University Students' Association of Bishwambarpur" },
      {
        name: "description",
        content:
          "A non-profit association of 300+ students from public universities, medical & engineering colleges — united for one upazila.",
      },
      { name: "author", content: "PUSAB" },
      {
        property: "og:title",
        content: "PUSAB — Public University Students' Association of Bishwambarpur",
      },
      {
        property: "og:description",
        content:
          "A non-profit association of 300+ students from public universities, medical & engineering colleges — united for one upazila.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "PUSAB" },
      { name: "twitter:card", content: "summary" },
      {
        name: "twitter:title",
        content: "PUSAB — Public University Students' Association of Bishwambarpur",
      },
      {
        name: "twitter:description",
        content:
          "A non-profit association of 300+ students from public universities, medical & engineering colleges — united for one upazila.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f537e135-106d-4695-a44e-911e2ae1aeb1/id-preview-f24b7edb--8f0f20d1-de75-4037-967d-0dbc5b1d8d01.lovable.app-1781700696901.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f537e135-106d-4695-a44e-911e2ae1aeb1/id-preview-f24b7edb--8f0f20d1-de75-4037-967d-0dbc5b1d8d01.lovable.app-1781700696901.png",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: faviconPusab },
      { rel: "apple-touch-icon", href: faviconPusab },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const bare = ["/dashboard", "/admin", "/auth"].some((p) => pathname.startsWith(p));
  const [flipbookOpen, setFlipbookOpen] = useState(false);

  // Prefetch all committee data on first load so every page gets it from cache.
  // Also wakes up the Render backend immediately (free tier cold start).
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["committee", "all"],
      queryFn: () =>
        import("@/lib/api").then(({ committeeApi }) => committeeApi.listAll()),
      staleTime: 5 * 60 * 1000,
    });
    queryClient.prefetchQuery({
      queryKey: ["committee", "current"],
      queryFn: () =>
        import("@/lib/api").then(({ committeeApi }) =>
          committeeApi.listAll({ current: true }),
        ),
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);

  return (
    <FlipbookContext value={{ isOpen: flipbookOpen, setIsOpen: setFlipbookOpen }}>
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen flex flex-col">
        {!bare && !flipbookOpen && <FloatingNavbar />}
        <main className="flex-1">
          {bare ? (
            <Outlet />
          ) : (
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          )}
        </main>
        {!bare && <SiteFooter />}
        {!bare && <BackToTop />}
      </div>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          },
        }}
      />
    </QueryClientProvider>
    </FlipbookContext>
  );
}
