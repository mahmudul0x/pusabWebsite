import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as AnimatedHeading } from "./AnimatedHeading-CqwUtDbh.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as ChevronRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PageHero-BYH4IfxF.js
var import_jsx_runtime = require_jsx_runtime();
function MeshGradientBg({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 overflow-hidden " + className,
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-40 -left-32 h-[70vh] w-[70vh] rounded-full bg-[var(--color-accent-1)] opacity-[0.18] blur-[120px] animate-blob" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-1/3 -right-40 h-[70vh] w-[70vh] rounded-full bg-[var(--color-accent-2)] opacity-[0.14] blur-[120px] animate-blob",
				style: { animationDelay: "-6s" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute -bottom-32 left-1/4 h-[55vh] w-[55vh] rounded-full bg-[var(--color-accent-3)] opacity-[0.10] blur-[120px] animate-blob",
				style: { animationDelay: "-12s" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 opacity-[0.04] mix-blend-overlay",
				style: {
					backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
					backgroundSize: "3px 3px"
				}
			})
		]
	});
}
function PageHero({ title, lede, crumbs, image, imageAlt }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative pt-40 pb-24 overflow-hidden min-h-[68vh] flex items-end",
		children: [image ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: image,
				alt: imageAlt ?? "",
				className: "absolute inset-0 w-full h-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-background/25 via-background/40 to-background/85" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(79,110,247,0.12),transparent_55%),radial-gradient(circle_at_75%_75%,rgba(124,58,237,0.12),transparent_55%)]" })
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshGradientBg, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page relative",
			children: [
				crumbs && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mb-6 flex items-center gap-2 text-xs text-muted-foreground",
					children: crumbs.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2",
						children: [c.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: c.to,
							className: "hover:text-foreground",
							children: c.label
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.label }), i < crumbs.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 12 })]
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedHeading, {
					as: "h1",
					className: "font-display text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl",
					children: title
				}),
				lede && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed",
					children: lede
				})
			]
		})]
	});
}
//#endregion
export { PageHero as t };
