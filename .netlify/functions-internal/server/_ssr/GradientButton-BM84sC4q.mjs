import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GradientButton-BM84sC4q.js
var import_jsx_runtime = require_jsx_runtime();
function GradientButton({ to, href, variant = "solid", children, className = "", onClick, type }) {
	const cls = `inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 will-change-transform ${variant === "solid" ? "text-white bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] hover:scale-[1.03] hover:shadow-[0_10px_40px_-10px_rgba(124,58,237,0.6)]" : "border border-white/15 text-foreground hover:bg-white/[0.05] hover:border-white/30"} ${className}`;
	if (to) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		className: cls,
		children
	});
	if (href) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href,
		className: cls,
		children
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick,
		type,
		className: cls,
		children
	});
}
//#endregion
export { GradientButton as t };
