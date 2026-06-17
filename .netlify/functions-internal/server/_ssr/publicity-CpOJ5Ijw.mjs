import { o as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as motion } from "../_libs/framer-motion.mjs";
import { A as Calendar, d as Newspaper, v as Inbox, x as FileText } from "../_libs/lucide-react.mjs";
import { t as PageHero } from "./PageHero-BYH4IfxF.mjs";
import { t as supabase } from "./client-Cxb5cBlI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/publicity-CpOJ5Ijw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var hero_publicity_default = "/assets/hero-publicity-B0zmcyse.jpg";
var TABS = [
	{
		key: "news",
		label: "News",
		Icon: Newspaper
	},
	{
		key: "press",
		label: "Press Releases",
		Icon: FileText
	},
	{
		key: "event",
		label: "Upcoming Events",
		Icon: Calendar
	}
];
function PublicityPage() {
	const [tab, setTab] = (0, import_react.useState)("news");
	const [posts, setPosts] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let active = true;
		setPosts(null);
		(async () => {
			const { data } = await supabase.from("publicity_posts").select("id,type,title,body,date,image_url").eq("type", tab).order("date", { ascending: false });
			if (active) setPosts(data ?? []);
		})();
		const channel = supabase.channel(`publicity-${tab}`).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "publicity_posts"
		}, () => {
			supabase.from("publicity_posts").select("id,type,title,body,date,image_url").eq("type", tab).order("date", { ascending: false }).then(({ data }) => active && setPosts(data ?? []));
		}).subscribe();
		return () => {
			active = false;
			supabase.removeChannel(channel);
		};
	}, [tab]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		title: "Publicity",
		lede: "News, press releases and upcoming events — straight from PUSAB.",
		crumbs: [{
			label: "Home",
			to: "/"
		}, { label: "Publicity" }],
		image: hero_publicity_default,
		imageAlt: "PUSAB press conference"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "pb-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "inline-flex glass rounded-full p-1 gap-1 mb-10",
				children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setTab(t.key),
					className: "relative px-4 py-2 text-sm font-medium",
					children: [tab === t.key && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
						layoutId: "pub-pill",
						transition: {
							type: "spring",
							stiffness: 380,
							damping: 32
						},
						className: "absolute inset-0 rounded-full bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative z-10 inline-flex items-center gap-2 " + (tab === t.key ? "text-white" : "text-foreground/70 hover:text-foreground"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.Icon, { size: 14 }),
							" ",
							t.label
						]
					})]
				}, t.key))
			}), posts === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid md:grid-cols-3 gap-5",
				children: [
					0,
					1,
					2
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-[16/10] shimmer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-16 shimmer rounded" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-3/4 shimmer rounded" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-1/2 shimmer rounded" })
						]
					})]
				}, i))
			}) : posts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-[var(--color-surface)] p-16 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, {
					size: 32,
					className: "mx-auto text-muted-foreground mb-4"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "No posts yet. Check back soon."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid md:grid-cols-3 gap-5",
				children: posts.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.article, {
					initial: {
						opacity: 0,
						y: 20
					},
					whileInView: {
						opacity: 1,
						y: 0
					},
					viewport: {
						once: true,
						margin: "-60px"
					},
					transition: {
						duration: .5,
						delay: i * .05
					},
					className: "group rounded-2xl border border-border overflow-hidden bg-[var(--color-surface)] hover:border-[color-mix(in_oklab,var(--color-accent-1)_50%,transparent)] transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-[16/10] overflow-hidden bg-[linear-gradient(135deg,#0F0F1A,#16162A)]",
						children: p.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: p.image_url,
							alt: p.title,
							className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-[radial-gradient(circle_at_30%_30%,rgba(79,110,247,0.3),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(124,58,237,0.25),transparent_55%)]" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-label",
								children: p.type.toUpperCase()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-3 font-display text-lg font-semibold leading-snug",
								children: p.title
							}),
							p.date && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: new Date(p.date).toLocaleDateString()
							})
						]
					})]
				}, p.id))
			})]
		})
	})] });
}
//#endregion
export { PublicityPage as component };
