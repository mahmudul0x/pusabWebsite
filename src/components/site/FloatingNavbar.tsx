import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Menu, X, ChevronDown, Heart } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/site-content";
import { committeeApi } from "@/lib/api";
import { ecOrdinal } from "@/routes/ec.$year";
import logoPusab from "@/assets/logo-pusab.png";

type NavChild = { to: string; label: string; children?: readonly NavChild[] };
type NavItem = { to: string; label: string; children?: readonly NavChild[] };

export function FloatingNavbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [pastYears, setPastYears] = useState<number[]>([]);

  // Load past (non-current) session years for the "Previous EC" submenu.
  useEffect(() => {
    let alive = true;
    committeeApi
      .listAll()
      .then((rows) => {
        if (!alive) return;
        const years = [...new Set(rows.filter((m) => !m.is_current).map((m) => m.year))]
          .filter((y) => !Number.isNaN(y))
          .sort((a, b) => a - b); // oldest first (1st, 2nd, ...)
        setPastYears(years);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // Inject past sessions into the Executive Committee submenu:
  // Present EC, Convening Committee, then 1st EC, 2nd EC, ... (oldest → newest).
  const navLinks = useMemo<readonly NavItem[]>(() => {
    const sessionChildren: NavChild[] = [
      { to: "/convening-committee", label: "Convening Committee" },
      ...pastYears.map((y) => ({
        to: `/ec/${y}`,
        label: `${ecOrdinal(y)} EC · ${y}-${String((y + 1) % 100).padStart(2, "0")}`,
      })),
    ];
    return NAV_LINKS.map((link) => {
      if (link.to !== "/leadership" || !("children" in link)) return link;
      return {
        ...link,
        children: link.children.map((c) =>
          c.label === "Executive Committee"
            ? { ...c, children: [...(("children" in c && c.children) || []), ...sessionChildren] }
            : c,
        ),
      };
    });
  }, [pastYears]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  // Close any open dropdown on outside click or Escape.
  useEffect(() => {
    if (!openMenu) return;
    const close = () => setOpenMenu(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenu(null);
    document.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          paddingInline: scrolled ? 16 : 24,
          paddingTop: scrolled ? 14 : 22,
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        id="floating-navbar"
        className="fixed inset-x-0 top-0 flex justify-center pointer-events-none"
        style={{ zIndex: 9999 }}
      >
        <motion.nav
          layout
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={
            "pointer-events-auto flex items-center gap-2 w-full " +
            (scrolled
              ? "max-w-6xl rounded-full glass shadow-[0_10px_40px_-15px_rgba(79,110,247,0.35)]"
              : "max-w-7xl rounded-2xl glass")
          }
          style={{
            paddingInline: scrolled ? 12 : 18,
            paddingBlock: scrolled ? 8 : 12,
          }}
        >
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5 pr-3">
            <img
              src={logoPusab}
              alt="PUSAB logo"
              className="h-12 w-12 object-contain transition-transform duration-700 group-hover:rotate-[360deg]"
            />
            <div className="flex flex-col leading-none">
              <span className="font-display text-[18px] font-bold tracking-[0.02em] text-foreground">
                PUSAB
              </span>
              <span className="text-[9px] uppercase tracking-[0.28em] text-muted-foreground mt-0.5">
                est. 2014
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1 mx-auto">
            {navLinks.map((link) => {
              const children = "children" in link ? link.children : undefined;
              const childActive = children?.some(
                (c) =>
                  pathname.startsWith(c.to) ||
                  ("children" in c && c.children?.some((g) => pathname.startsWith(g.to))),
              );
              const isActive =
                (link.to === "/" ? pathname === "/" : pathname.startsWith(link.to)) ||
                Boolean(childActive);
              const pillClasses =
                "relative inline-flex cursor-pointer items-center gap-1 px-3.5 py-1.5 text-sm font-semibold tracking-[0.02em] text-foreground/75 hover:text-foreground transition-colors";
              const pill = isActive && (
                <motion.span
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-[var(--color-surface-2)] border border-border"
                />
              );

              if (!children) {
                return (
                  <li key={link.to}>
                    <Link to={link.to} className={pillClasses}>
                      {pill}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  </li>
                );
              }

              const isOpen = openMenu === link.to;
              return (
                <li
                  key={link.to}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(link.to)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu(isOpen ? null : link.to);
                    }}
                    className={pillClasses}
                  >
                    {pill}
                    <span className="relative z-10">{link.label}</span>
                    <ChevronDown
                      size={13}
                      className={
                        "relative z-10 opacity-60 transition-transform duration-200 " +
                        (isOpen ? "rotate-180" : "")
                      }
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute left-1/2 top-full z-20 -translate-x-1/2 pt-3"
                      >
                        <ul className="min-w-[230px] rounded-2xl border border-border bg-[var(--color-surface)] p-1.5 shadow-[0_24px_50px_-20px_rgba(15,23,42,0.45)]">
                          {children.map((c) => {
                            const grandchildren =
                              "children" in c ? c.children : undefined;
                            const cActive = pathname.startsWith(c.to);
                            return (
                              <li key={c.to + c.label}>
                                <Link
                                  to={c.to}
                                  onClick={() => setOpenMenu(null)}
                                  className={
                                    "block rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors " +
                                    (cActive
                                      ? "bg-[var(--color-surface-2)] text-foreground"
                                      : "text-foreground/75 hover:bg-[var(--color-surface-2)] hover:text-foreground")
                                  }
                                >
                                  {c.label}
                                </Link>
                                {grandchildren && (
                                  <ul className="mb-1 ml-3.5 mt-0.5 space-y-0.5 border-l border-border pl-2.5">
                                    {grandchildren.map((g) => {
                                      const gActive = pathname.startsWith(g.to);
                                      return (
                                        <li key={g.to + g.label}>
                                          <Link
                                            to={g.to}
                                            onClick={() => setOpenMenu(null)}
                                            className={
                                              "block rounded-lg px-3 py-2 text-[13px] font-medium transition-colors " +
                                              (gActive
                                                ? "text-[var(--color-accent-1)]"
                                                : "text-foreground/65 hover:text-foreground")
                                            }
                                          >
                                            {g.label}
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          {/* CTA */}
          <div className="ml-auto hidden lg:flex items-center gap-2">
            <Link
              to="/support"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)] hover:text-foreground"
            >
              <Heart size={14} className="text-[var(--color-accent-1)]" /> Support
            </Link>
            <Link to="/contact" className="formal-cta group">
              <span>Join PUSAB</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="ml-auto lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-border bg-[var(--color-surface-2)] text-foreground"
            aria-label="Open menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </motion.nav>
      </motion.header>

      {/* CTA styles */}
      <style>{`
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
      `}</style>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 lg:hidden"
            style={{ zIndex: 10000 }}
          >
            {/* Solid backdrop — fully covers page content */}
            <div className="absolute inset-0 bg-[var(--color-background)]" />
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-24 -right-16 h-[50vh] w-[50vh] rounded-full bg-[var(--color-accent-1)] opacity-[0.07] blur-[100px]" />
              <div className="absolute -bottom-24 -left-16 h-[50vh] w-[50vh] rounded-full bg-[var(--color-accent-2)] opacity-[0.07] blur-[100px]" />
            </div>

            {/* Panel */}
            <div className="relative flex h-full flex-col">
              {/* Header row inside menu */}
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <Link to="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                  <img src={logoPusab} alt="PUSAB" className="h-10 w-10 object-contain" />
                  <div className="flex flex-col leading-none">
                    <span className="font-display text-base font-bold tracking-[0.02em]">PUSAB</span>
                    <span className="mt-0.5 text-[8px] uppercase tracking-[0.28em] text-muted-foreground">
                      est. 2014
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable nav */}
              <nav className="flex-1 overflow-y-auto px-5 py-6">
                <motion.ul
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } }}
                  className="space-y-1"
                >
                  {navLinks.map((link) => {
                    const children = "children" in link ? link.children : undefined;
                    const isActive =
                      link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
                    return (
                      <motion.li
                        key={link.to}
                        variants={{
                          hidden: { opacity: 0, y: 12 },
                          show: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                          },
                        }}
                      >
                        <Link
                          to={link.to}
                          onClick={() => setMobileOpen(false)}
                          className={
                            "block rounded-xl px-4 py-3 font-display text-lg font-bold tracking-tight transition-colors " +
                            (isActive
                              ? "bg-[var(--color-surface-2)] text-foreground"
                              : "text-foreground/85 hover:bg-[var(--color-surface-2)]")
                          }
                        >
                          {link.label}
                        </Link>
                        {children && (
                          <ul className="mb-1 ml-3 mt-0.5 space-y-0.5 border-l border-border pl-4">
                            {children.map((c) => {
                              const grandchildren =
                                "children" in c ? c.children : undefined;
                              const cActive = pathname.startsWith(c.to);
                              return (
                                <li key={c.to + c.label}>
                                  <Link
                                    to={c.to}
                                    onClick={() => setMobileOpen(false)}
                                    className={
                                      "block rounded-lg px-3 py-2 text-sm font-medium transition-colors " +
                                      (cActive
                                        ? "text-[var(--color-accent-1)]"
                                        : "text-foreground/65 hover:text-foreground")
                                    }
                                  >
                                    {c.label}
                                  </Link>
                                  {grandchildren && (
                                    <ul className="ml-3 space-y-0.5 border-l border-border pl-3">
                                      {grandchildren.map((g) => {
                                        const gActive = pathname.startsWith(g.to);
                                        return (
                                          <li key={g.to + g.label}>
                                            <Link
                                              to={g.to}
                                              onClick={() => setMobileOpen(false)}
                                              className={
                                                "block rounded-lg px-3 py-2 text-[13px] font-medium transition-colors " +
                                                (gActive
                                                  ? "text-[var(--color-accent-1)]"
                                                  : "text-foreground/55 hover:text-foreground")
                                              }
                                            >
                                              {g.label}
                                            </Link>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </nav>

              {/* Footer — CTAs + contact */}
              <div className="border-t border-border px-5 py-5">
                <div className="flex gap-3">
                  <Link
                    to="/support"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-semibold"
                  >
                    <Heart size={15} className="text-[var(--color-accent-1)]" /> Support
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="formal-cta flex-1 justify-center"
                  >
                    <span>Join PUSAB</span>
                  </Link>
                </div>
                <div className="mt-4 flex flex-col gap-0.5 text-xs text-muted-foreground">
                  <p>{SITE.email}</p>
                  <p>{SITE.phone}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
