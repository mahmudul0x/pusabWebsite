import { o as __toESM } from "../_runtime.mjs";
import { i as SITE, r as PROGRAMS, t as NAV_LINKS } from "./site-content-C5LuCSvL.mjs";
import { n as require_react, r as require_jsx_runtime, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { a as motion, o as AnimatePresence } from "../_libs/framer-motion.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, j as redirect, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as Facebook, f as Menu, h as Mail, m as MapPin, t as X, u as Phone } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-Cxb5cBlI.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Vwu0uOSd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-D6i_ILTm.css";
var logo_pusab_default$1 = "/assets/logo-pusab-CrbgrEmf.png";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var logo_pusab_default = "/assets/logo-pusab-CrbgrEmf.png";
function FloatingNavbar() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 80);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	(0, import_react.useEffect)(() => {
		setMobileOpen(false);
	}, [pathname]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.header, {
			initial: false,
			animate: {
				paddingInline: scrolled ? 16 : 24,
				paddingTop: scrolled ? 14 : 22
			},
			transition: {
				duration: .45,
				ease: [
					.16,
					1,
					.3,
					1
				]
			},
			className: "fixed inset-x-0 top-0 z-[9999] flex justify-center pointer-events-none",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.nav, {
				layout: true,
				transition: {
					duration: .5,
					ease: [
						.16,
						1,
						.3,
						1
					]
				},
				className: "pointer-events-auto flex items-center gap-2 w-full " + (scrolled ? "max-w-6xl rounded-full glass shadow-[0_10px_40px_-15px_rgba(79,110,247,0.35)]" : "max-w-7xl rounded-2xl glass"),
				style: {
					paddingInline: scrolled ? 12 : 18,
					paddingBlock: scrolled ? 8 : 12
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "group flex items-center gap-2.5 pr-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: logo_pusab_default,
							alt: "PUSAB logo",
							className: "h-12 w-12 object-contain transition-transform duration-700 group-hover:rotate-[360deg]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col leading-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-[18px] font-bold tracking-[0.02em] text-foreground",
								children: "PUSAB"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9px] uppercase tracking-[0.28em] text-muted-foreground mt-0.5",
								children: "est. 2014"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "hidden lg:flex items-center gap-1 mx-auto",
						children: NAV_LINKS.map((link) => {
							const isActive = link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: link.to,
								className: "relative px-3.5 py-1.5 text-sm font-semibold tracking-[0.02em] text-foreground/75 hover:text-foreground transition-colors",
								children: [isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
									layoutId: "nav-pill",
									transition: {
										type: "spring",
										stiffness: 380,
										damping: 32
									},
									className: "absolute inset-0 rounded-full bg-[var(--color-surface-2)] border border-border"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "relative z-10",
									children: link.label
								})]
							}) }, link.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ml-auto hidden lg:flex items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contact",
							className: "formal-cta group",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Join PUSAB" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMobileOpen((v) => !v),
						className: "ml-auto lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/10 bg-white/[0.04] text-foreground",
						"aria-label": "Open menu",
						children: mobileOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { size: 18 })
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .formal-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 10px 18px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: #ffffff;
          background: linear-gradient(90deg, var(--color-accent-1), var(--color-accent-2));
          box-shadow: 0 10px 24px -14px color-mix(in srgb, var(--color-accent-1) 60%, transparent);
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .formal-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 32px -14px color-mix(in srgb, var(--color-accent-2) 60%, transparent);
        }
      ` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: { opacity: 0 },
			transition: { duration: .3 },
			className: "fixed inset-0 z-[9998] lg:hidden bg-background/95 backdrop-blur-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-20 -left-20 h-[60vh] w-[60vh] rounded-full bg-[var(--color-accent-1)] opacity-10 blur-[120px] animate-blob" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-20 -right-20 h-[60vh] w-[60vh] rounded-full bg-[var(--color-accent-2)] opacity-10 blur-[120px] animate-blob" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-full flex flex-col justify-center px-8 pt-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.ul, {
					initial: "hidden",
					animate: "show",
					variants: { show: { transition: {
						staggerChildren: .06,
						delayChildren: .1
					} } },
					className: "space-y-3",
					children: NAV_LINKS.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.li, {
						variants: {
							hidden: {
								opacity: 0,
								y: 28
							},
							show: {
								opacity: 1,
								y: 0,
								transition: {
									duration: .5,
									ease: [
										.16,
										1,
										.3,
										1
									]
								}
							}
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: link.to,
							className: "group flex items-center gap-3 text-[36px] font-display font-bold tracking-tight",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-6 bg-foreground/40 transition-all duration-300 group-hover:w-14 group-hover:bg-[var(--color-accent-1)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: link.label })]
						})
					}, link.to))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 text-xs text-muted-foreground space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: SITE.email }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: SITE.phone })]
				})]
			})]
		}) })
	] });
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "relative mt-24 border-t border-border bg-[var(--color-surface)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hairline-gradient absolute inset-x-0 top-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page py-16 grid gap-10 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: logo_pusab_default,
									alt: "PUSAB logo",
									className: "h-14 w-14 object-contain"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-2xl font-bold",
									children: "PUSAB"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs",
								children: "Public University Students' Association of Bishwambarpur — a non-profit, non-political association of 300+ students."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground",
								children: ["Est. ", SITE.founded]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-label",
						children: "Quick Links"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2 text-sm",
						children: NAV_LINKS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: l.to,
							className: "text-foreground/80 hover:text-foreground transition-colors",
							children: l.label
						}) }, l.to))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-label",
						children: "Programs"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2 text-sm",
						children: PROGRAMS.slice(0, 6).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-foreground/80",
							children: p.title
						}, p.key))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-label",
						children: "Contact"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
									size: 15,
									className: "mt-0.5 text-[var(--color-accent-1)]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `mailto:${SITE.email}`,
									className: "hover:underline",
									children: SITE.email
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
									size: 15,
									className: "mt-0.5 text-[var(--color-accent-1)]"
								}), SITE.phone]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
									size: 15,
									className: "mt-0.5 text-[var(--color-accent-1)]"
								}), "Bishwambarpur, Sunamganj"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: SITE.facebook,
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex items-center gap-2 mt-2 text-[var(--color-accent-1)] hover:underline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { size: 15 }), " Facebook"]
							}) })
						]
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container-page py-5 flex flex-col md:flex-row gap-3 items-center justify-between text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" ",
						SITE.fullName,
						". All rights reserved."
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Built with intent. Non-political · Non-profit · Educational." })]
				})
			})
		]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$11 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				name: "theme-color",
				content: "#07070D"
			},
			{ title: "PUSAB — Public University Students' Association of Bishwambarpur" },
			{
				name: "description",
				content: "A non-profit association of 300+ students from public universities, medical & engineering colleges — united for one upazila."
			},
			{
				name: "author",
				content: "PUSAB"
			},
			{
				property: "og:title",
				content: "PUSAB — Public University Students' Association of Bishwambarpur"
			},
			{
				property: "og:description",
				content: "A non-profit association of 300+ students from public universities, medical & engineering colleges — united for one upazila."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:site_name",
				content: "PUSAB"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:title",
				content: "PUSAB — Public University Students' Association of Bishwambarpur"
			},
			{
				name: "twitter:description",
				content: "A non-profit association of 300+ students from public universities, medical & engineering colleges — united for one upazila."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f537e135-106d-4695-a44e-911e2ae1aeb1/id-preview-f24b7edb--8f0f20d1-de75-4037-967d-0dbc5b1d8d01.lovable.app-1781700696901.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f537e135-106d-4695-a44e-911e2ae1aeb1/id-preview-f24b7edb--8f0f20d1-de75-4037-967d-0dbc5b1d8d01.lovable.app-1781700696901.png"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				type: "image/png",
				href: logo_pusab_default$1
			},
			{
				rel: "apple-touch-icon",
				href: logo_pusab_default$1
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$11.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative min-h-screen flex flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingNavbar, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			theme: "dark",
			position: "bottom-right",
			toastOptions: { style: {
				background: "var(--color-surface-2)",
				border: "1px solid var(--color-border)",
				color: "var(--color-text)"
			} }
		})]
	});
}
var $$splitComponentImporter$10 = () => import("./sayor-Dc6DZAfA.mjs");
var Route$10 = createFileRoute("/sayor")({
	head: () => ({
		meta: [
			{ title: "SAYOR — The Annual Magazine of PUSAB" },
			{
				name: "description",
				content: "SAYOR is PUSAB's annual magazine spanning education, culture, science, heritage, literature and a directory of Bishwambarpur students."
			},
			{
				property: "og:title",
				content: "SAYOR — Annual Magazine of PUSAB"
			},
			{
				property: "og:description",
				content: "Six sections, one publication — the voice of Bishwambarpur's brightest."
			},
			{
				property: "og:url",
				content: "/sayor"
			}
		],
		links: [{
			rel: "canonical",
			href: "/sayor"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./publicity-CpOJ5Ijw.mjs");
var Route$9 = createFileRoute("/publicity")({
	head: () => ({
		meta: [
			{ title: "Publicity — News, Press & Events | PUSAB" },
			{
				name: "description",
				content: "Latest news, press releases and upcoming events from PUSAB."
			},
			{
				property: "og:title",
				content: "Publicity — PUSAB"
			},
			{
				property: "og:description",
				content: "News, press releases and event updates from PUSAB."
			},
			{
				property: "og:url",
				content: "/publicity"
			}
		],
		links: [{
			rel: "canonical",
			href: "/publicity"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./programs-C6_pGVo8.mjs");
var Route$8 = createFileRoute("/programs")({
	head: () => ({
		meta: [
			{ title: "Programs & Activities — PUSAB" },
			{
				name: "description",
				content: "PUSAB programs: annual reunion, schooling, scholarships, picnic, humanity initiatives, online events, SAYOR magazine, and more."
			},
			{
				property: "og:title",
				content: "Programs & Activities — PUSAB"
			},
			{
				property: "og:description",
				content: "Explore the programs powering PUSAB's mission across Bishwambarpur."
			},
			{
				property: "og:url",
				content: "/programs"
			}
		],
		links: [{
			rel: "canonical",
			href: "/programs"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./moments-nmQ2GSpi.mjs");
var Route$7 = createFileRoute("/moments")({
	head: () => ({
		meta: [
			{ title: "Proud Moments — PUSAB" },
			{
				name: "description",
				content: "A photo journey through PUSAB's events, achievements, community service and reunions."
			},
			{
				property: "og:title",
				content: "Proud Moments — PUSAB"
			},
			{
				property: "og:description",
				content: "Memories from PUSAB events, achievements and community service."
			},
			{
				property: "og:url",
				content: "/moments"
			}
		],
		links: [{
			rel: "canonical",
			href: "/moments"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./leadership-D7tIj-hA.mjs");
var Route$6 = createFileRoute("/leadership")({
	head: () => ({
		meta: [
			{ title: "Leadership — PUSAB" },
			{
				name: "description",
				content: "Meet the present Executive Committee and explore past ECs and the PUSAB Honor Board."
			},
			{
				property: "og:title",
				content: "Leadership — PUSAB"
			},
			{
				property: "og:description",
				content: "Present and past Executive Committees and PUSAB Honor Board."
			},
			{
				property: "og:url",
				content: "/leadership"
			}
		],
		links: [{
			rel: "canonical",
			href: "/leadership"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./contact-Dvomc4hC.mjs");
var Route$5 = createFileRoute("/contact")({
	head: () => ({
		meta: [
			{ title: "Contact — PUSAB" },
			{
				name: "description",
				content: "Get in touch with the Public University Students' Association of Bishwambarpur — questions, partnerships, scholarship inquiries."
			},
			{
				property: "og:title",
				content: "Contact — PUSAB"
			},
			{
				property: "og:description",
				content: "Reach the PUSAB team for questions, partnerships and scholarship inquiries."
			},
			{
				property: "og:url",
				content: "/contact"
			}
		],
		links: [{
			rel: "canonical",
			href: "/contact"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./auth-BcrITKkD.mjs");
var Route$4 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Sign in — PUSAB" },
		{
			name: "description",
			content: "Sign in to the PUSAB admin area."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./about-C5A144CN.mjs");
var Route$3 = createFileRoute("/about")({
	head: () => ({
		meta: [
			{ title: "About — PUSAB" },
			{
				name: "description",
				content: "PUSAB is a non-profit, non-political student association from Bishwambarpur Upazila, founded in 2014 at Govt. Digendra Barman College."
			},
			{
				property: "og:title",
				content: "About — PUSAB"
			},
			{
				property: "og:description",
				content: "Mission, aims and founding story of PUSAB — a 300+ member association of public university students."
			},
			{
				property: "og:url",
				content: "/about"
			}
		],
		links: [{
			rel: "canonical",
			href: "/about"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./route-Di7iQBCH.mjs");
var Route$2 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./routes-C20BflSx.mjs");
var Route$1 = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "PUSAB — Empowering Students, Transforming Bishwambarpur" },
			{
				name: "description",
				content: "PUSAB is a non-profit, non-political association of 300+ students from public universities, medical & engineering colleges — united for one upazila."
			},
			{
				property: "og:title",
				content: "PUSAB — Empowering Students, Transforming Bishwambarpur"
			},
			{
				property: "og:description",
				content: "Non-profit association of 300+ public university students working for Bishwambarpur Upazila."
			},
			{
				property: "og:url",
				content: "/"
			}
		],
		links: [{
			rel: "canonical",
			href: "/"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./admin-CLQ1X4r5.mjs");
var Route = createFileRoute("/_authenticated/admin")({
	head: () => ({ meta: [{ title: "Admin — PUSAB" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var SayorRoute = Route$10.update({
	id: "/sayor",
	path: "/sayor",
	getParentRoute: () => Route$11
});
var PublicityRoute = Route$9.update({
	id: "/publicity",
	path: "/publicity",
	getParentRoute: () => Route$11
});
var ProgramsRoute = Route$8.update({
	id: "/programs",
	path: "/programs",
	getParentRoute: () => Route$11
});
var MomentsRoute = Route$7.update({
	id: "/moments",
	path: "/moments",
	getParentRoute: () => Route$11
});
var LeadershipRoute = Route$6.update({
	id: "/leadership",
	path: "/leadership",
	getParentRoute: () => Route$11
});
var ContactRoute = Route$5.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$11
});
var AuthRoute = Route$4.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$11
});
var AboutRoute = Route$3.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$11
});
var AuthenticatedRouteRoute = Route$2.update({
	id: "/_authenticated",
	getParentRoute: () => Route$11
});
var IndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$11
});
var AuthenticatedRouteRouteChildren = { AuthenticatedAdminRoute: Route.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
}) };
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AboutRoute,
	AuthRoute,
	ContactRoute,
	LeadershipRoute,
	MomentsRoute,
	ProgramsRoute,
	PublicityRoute,
	SayorRoute
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
