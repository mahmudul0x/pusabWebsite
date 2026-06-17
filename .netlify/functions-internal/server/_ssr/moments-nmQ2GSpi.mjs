import { o as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as motion, o as AnimatePresence } from "../_libs/framer-motion.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
import { t as PageHero } from "./PageHero-BYH4IfxF.mjs";
import { t as supabase } from "./client-Cxb5cBlI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/moments-nmQ2GSpi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var hero_moments_default = "/assets/hero-moments-BZUj_nk2.jpg";
var CATS = [
	"all",
	"events",
	"achievements",
	"community",
	"reunion"
];
function MomentsPage() {
	const [items, setItems] = (0, import_react.useState)(null);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		supabase.from("gallery_items").select("id,title,category,image_url,year").order("created_at", { ascending: false }).then(({ data }) => setItems(data ?? []));
	}, []);
	const shown = (items ?? []).filter((i) => filter === "all" || i.category === filter);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			title: "Proud Moments",
			lede: "A photo journey through PUSAB's events, achievements, community service and reunions.",
			crumbs: [{
				label: "Home",
				to: "/"
			}, { label: "Moments" }],
			image: hero_moments_default,
			imageAlt: "PUSAB reunion moments collage"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "pb-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "inline-flex glass rounded-full p-1 gap-1 mb-10 capitalize",
					children: CATS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setFilter(c),
						className: "relative px-4 py-2 text-sm font-medium",
						children: [filter === c && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
							layoutId: "cat-pill",
							transition: {
								type: "spring",
								stiffness: 380,
								damping: 32
							},
							className: "absolute inset-0 rounded-full bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "relative z-10 " + (filter === c ? "text-white" : "text-foreground/70 hover:text-foreground"),
							children: c
						})]
					}, c))
				}), items === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "columns-1 sm:columns-2 lg:columns-3 gap-4",
					children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 break-inside-avoid rounded-2xl shimmer",
						style: { height: 180 + i % 3 * 60 }
					}, i))
				}) : shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-3xl border border-border bg-[var(--color-surface)] p-16 text-center text-muted-foreground",
					children: "No moments here yet — but our story is still being written."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "columns-1 sm:columns-2 lg:columns-3 gap-4",
					children: shown.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
						layoutId: `m-${it.id}`,
						onClick: () => setOpen(it),
						className: "mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-border bg-[var(--color-surface)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: it.image_url,
							alt: it.title ?? "",
							className: "w-full h-auto transition-transform duration-500 hover:scale-105"
						})
					}, it.id))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: { opacity: 0 },
			onClick: () => setOpen(null),
			onKeyDown: (e) => e.key === "Escape" && setOpen(null),
			className: "fixed inset-0 z-[10000] bg-black/85 backdrop-blur-xl grid place-items-center p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.img, {
				layoutId: `m-${open.id}`,
				src: open.image_url,
				alt: open.title ?? "",
				className: "max-h-[88vh] max-w-[92vw] rounded-2xl border border-border"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setOpen(null),
				className: "absolute top-6 right-6 h-10 w-10 rounded-full glass grid place-items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
			})]
		}) })
	] });
}
//#endregion
export { MomentsPage as component };
