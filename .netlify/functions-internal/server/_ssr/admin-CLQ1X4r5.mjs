import { o as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Trash2, g as LogOut, r as Upload } from "../_libs/lucide-react.mjs";
import { t as PageHero } from "./PageHero-BYH4IfxF.mjs";
import { t as supabase } from "./client-Cxb5cBlI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CLQ1X4r5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		key: "moments",
		label: "Moments gallery"
	},
	{
		key: "publicity",
		label: "Publicity"
	},
	{
		key: "ec",
		label: "EC members"
	}
];
var GALLERY_CATS = [
	"events",
	"achievements",
	"community",
	"reunion",
	"other"
];
var PUB_TYPES = [
	"news",
	"press",
	"event"
];
async function uploadToMedia(file, prefix) {
	const ext = file.name.split(".").pop() || "jpg";
	const path = `${prefix}/${crypto.randomUUID()}.${ext}`;
	const { error } = await supabase.storage.from("media").upload(path, file, {
		cacheControl: "31536000",
		upsert: false
	});
	if (error) throw error;
	const { data, error: signErr } = await supabase.storage.from("media").createSignedUrl(path, 3600 * 24 * 365 * 10);
	if (signErr || !data) throw signErr ?? /* @__PURE__ */ new Error("Could not sign URL");
	return {
		path,
		url: data.signedUrl
	};
}
function AdminPage() {
	const navigate = useNavigate();
	const [tab, setTab] = (0, import_react.useState)("moments");
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(null);
	const [email, setEmail] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: u } = await supabase.auth.getUser();
			setEmail(u.user?.email ?? "");
			if (!u.user) return setIsAdmin(false);
			const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
			setIsAdmin(!!data && !error);
		})();
	}, []);
	async function signOut() {
		await supabase.auth.signOut();
		navigate({ to: "/auth" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		title: "Admin",
		lede: "Manage photos, publicity posts and Executive Committee members.",
		crumbs: [{
			label: "Home",
			to: "/"
		}, { label: "Admin" }]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "pb-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm text-muted-foreground",
					children: ["Signed in as ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground font-medium",
						children: email
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: signOut,
					className: "inline-flex items-center gap-2 text-sm rounded-full glass px-4 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 14 }), " Sign out"]
				})]
			}), isAdmin === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-3xl border border-border bg-[var(--color-surface)] p-10 text-muted-foreground",
				children: "Loading…"
			}) : !isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-[var(--color-surface)] p-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold mb-2",
					children: "You don't have admin access yet."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"Your account has been created. Ask a site admin to grant your account the",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "admin" }),
						" role, then refresh this page."
					]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "inline-flex glass rounded-full p-1 gap-1 mb-8",
					children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setTab(t.key),
						className: "px-4 py-2 text-sm rounded-full " + (tab === t.key ? "bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] text-white" : "text-foreground/70 hover:text-foreground"),
						children: t.label
					}, t.key))
				}),
				tab === "moments" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MomentsAdmin, {}),
				tab === "publicity" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicityAdmin, {}),
				tab === "ec" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EcAdmin, {})
			] })]
		})
	})] });
}
function MomentsAdmin() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [title, setTitle] = (0, import_react.useState)("");
	const [caption, setCaption] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("events");
	const [year, setYear] = (0, import_react.useState)(String((/* @__PURE__ */ new Date()).getFullYear()));
	const [file, setFile] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function refresh() {
		const { data } = await supabase.from("gallery_items").select("*").order("created_at", { ascending: false });
		setItems(data ?? []);
	}
	(0, import_react.useEffect)(() => {
		refresh();
	}, []);
	async function submit(e) {
		e.preventDefault();
		if (!file) return toast.error("Choose a photo");
		setBusy(true);
		try {
			const { path, url } = await uploadToMedia(file, "moments");
			const { error } = await supabase.from("gallery_items").insert({
				title: title || null,
				caption: caption || null,
				category,
				year: year ? Number(year) : null,
				image_url: url,
				storage_path: path
			});
			if (error) throw error;
			toast.success("Photo added");
			setTitle("");
			setCaption("");
			setFile(null);
			await refresh();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Upload failed");
		} finally {
			setBusy(false);
		}
	}
	async function remove(it) {
		if (!confirm(`Delete "${it.title ?? "photo"}"?`)) return;
		if (it.storage_path) await supabase.storage.from("media").remove([it.storage_path]);
		await supabase.from("gallery_items").delete().eq("id", it.id);
		await refresh();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid lg:grid-cols-[400px,1fr] gap-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "glass rounded-3xl p-6 space-y-4 border border-border h-fit",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold",
					children: "Upload a photo"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Title",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						className: inputCls
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Caption",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: caption,
						onChange: (e) => setCaption(e.target.value),
						className: inputCls
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Category",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: category,
							onChange: (e) => setCategory(e.target.value),
							className: inputCls,
							children: GALLERY_CATS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c,
								children: c
							}, c))
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Year",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: year,
							onChange: (e) => setYear(e.target.value),
							className: inputCls
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Photo file",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/*",
						onChange: (e) => setFile(e.target.files?.[0] ?? null),
						className: "text-sm"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					disabled: busy,
					className: "w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] text-white font-semibold py-3 disabled:opacity-60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { size: 16 }),
						" ",
						busy ? "Uploading…" : "Add photo"
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid sm:grid-cols-2 xl:grid-cols-3 gap-4",
			children: items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-[var(--color-surface)] overflow-hidden group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: it.image_url,
					alt: it.title ?? "",
					className: "w-full h-44 object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
							children: [
								it.category,
								" · ",
								it.year ?? "—"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium mt-1",
							children: it.title ?? "Untitled"
						}),
						it.caption && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground mt-1 line-clamp-2",
							children: it.caption
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => remove(it),
							className: "mt-3 inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 12 }), " Delete"]
						})
					]
				})]
			}, it.id))
		})]
	});
}
function PublicityAdmin() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [title, setTitle] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("news");
	const [date, setDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [excerpt, setExcerpt] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [file, setFile] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function refresh() {
		const { data } = await supabase.from("publicity_posts").select("*").order("date", { ascending: false });
		setItems(data ?? []);
	}
	(0, import_react.useEffect)(() => {
		refresh();
	}, []);
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			let image_url = null;
			let storage_path = null;
			if (file) {
				const r = await uploadToMedia(file, "publicity");
				image_url = r.url;
				storage_path = r.path;
			}
			const { error } = await supabase.from("publicity_posts").insert({
				title,
				type,
				date,
				excerpt: excerpt || null,
				body: body || null,
				image_url,
				storage_path,
				published: true
			});
			if (error) throw error;
			toast.success("Post added");
			setTitle("");
			setExcerpt("");
			setBody("");
			setFile(null);
			await refresh();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed");
		} finally {
			setBusy(false);
		}
	}
	async function remove(it) {
		if (!confirm(`Delete "${it.title}"?`)) return;
		if (it.storage_path) await supabase.storage.from("media").remove([it.storage_path]);
		await supabase.from("publicity_posts").delete().eq("id", it.id);
		await refresh();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid lg:grid-cols-[400px,1fr] gap-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "glass rounded-3xl p-6 space-y-4 border border-border h-fit",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold",
					children: "New publicity post"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Title",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						value: title,
						onChange: (e) => setTitle(e.target.value),
						className: inputCls
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Type",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: type,
							onChange: (e) => setType(e.target.value),
							className: inputCls,
							children: PUB_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: t,
								children: t
							}, t))
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Date",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: date,
							onChange: (e) => setDate(e.target.value),
							className: inputCls
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Excerpt",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: excerpt,
						onChange: (e) => setExcerpt(e.target.value),
						className: inputCls
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Body",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 5,
						value: body,
						onChange: (e) => setBody(e.target.value),
						className: inputCls
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Cover image",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/*",
						onChange: (e) => setFile(e.target.files?.[0] ?? null),
						className: "text-sm"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					disabled: busy,
					className: "w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] text-white font-semibold py-3 disabled:opacity-60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { size: 16 }),
						" ",
						busy ? "Saving…" : "Publish"
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4 rounded-2xl border border-border bg-[var(--color-surface)] overflow-hidden",
				children: [it.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: it.image_url,
					alt: "",
					className: "w-40 h-28 object-cover shrink-0"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 flex-1 min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
							children: [
								it.type,
								" · ",
								it.date ?? ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium truncate",
							children: it.title
						}),
						it.excerpt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground line-clamp-2",
							children: it.excerpt
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => remove(it),
							className: "mt-2 inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 12 }), " Delete"]
						})
					]
				})]
			}, it.id))
		})]
	});
}
function EcAdmin() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [name, setName] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("");
	const [university, setUniversity] = (0, import_react.useState)("");
	const [year, setYear] = (0, import_react.useState)(String((/* @__PURE__ */ new Date()).getFullYear()));
	const [isCurrent, setIsCurrent] = (0, import_react.useState)(true);
	const [file, setFile] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function refresh() {
		const { data } = await supabase.from("ec_members").select("*").order("year", { ascending: false }).order("name");
		setItems(data ?? []);
	}
	(0, import_react.useEffect)(() => {
		refresh();
	}, []);
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			let photo_url = null;
			let storage_path = null;
			if (file) {
				const r = await uploadToMedia(file, "ec");
				photo_url = r.url;
				storage_path = r.path;
			}
			const { error } = await supabase.from("ec_members").insert({
				name,
				role,
				university: university || null,
				year: Number(year),
				is_current: isCurrent,
				photo_url,
				storage_path
			});
			if (error) throw error;
			toast.success("Member added");
			setName("");
			setRole("");
			setUniversity("");
			setFile(null);
			await refresh();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed");
		} finally {
			setBusy(false);
		}
	}
	async function remove(it) {
		if (!confirm(`Remove ${it.name}?`)) return;
		if (it.storage_path) await supabase.storage.from("media").remove([it.storage_path]);
		await supabase.from("ec_members").delete().eq("id", it.id);
		await refresh();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid lg:grid-cols-[400px,1fr] gap-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "glass rounded-3xl p-6 space-y-4 border border-border h-fit",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold",
					children: "Add EC member"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						value: name,
						onChange: (e) => setName(e.target.value),
						className: inputCls
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Role",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						value: role,
						onChange: (e) => setRole(e.target.value),
						className: inputCls
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "University",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: university,
						onChange: (e) => setUniversity(e.target.value),
						className: inputCls
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Year",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: year,
							onChange: (e) => setYear(e.target.value),
							className: inputCls
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Current EC?",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 mt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: isCurrent,
								onChange: (e) => setIsCurrent(e.target.checked)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: "Yes"
							})]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Photo",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/*",
						onChange: (e) => setFile(e.target.files?.[0] ?? null),
						className: "text-sm"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					disabled: busy,
					className: "w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] text-white font-semibold py-3 disabled:opacity-60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { size: 16 }),
						" ",
						busy ? "Saving…" : "Add member"
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid sm:grid-cols-2 xl:grid-cols-3 gap-4",
			children: items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-[var(--color-surface)] overflow-hidden",
				children: [it.photo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: it.photo_url,
					alt: it.name,
					className: "w-full h-48 object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full h-48 grid place-items-center text-muted-foreground text-sm bg-white/[0.02]",
					children: "No photo"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs uppercase tracking-[0.18em] text-muted-foreground",
							children: [
								it.role,
								" · ",
								it.year,
								it.is_current ? " · current" : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium mt-1",
							children: it.name
						}),
						it.university && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground mt-1",
							children: it.university
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => remove(it),
							className: "mt-3 inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 12 }), " Delete"]
						})
					]
				})]
			}, it.id))
		})]
	});
}
var inputCls = "mt-2 w-full rounded-xl bg-[var(--color-surface)] border border-border px-3 py-2 text-sm outline-none focus:border-[var(--color-accent-1)]";
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[11px] uppercase tracking-[0.18em] text-muted-foreground",
			children: label
		}), children]
	});
}
//#endregion
export { AdminPage as component };
