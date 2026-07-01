import { Link } from "@tanstack/react-router";
import { Facebook, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { NAV_LINKS, PROGRAMS, SITE } from "@/lib/site-content";
import logoPusab from "@/assets/logo-pusab.png";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-border bg-[var(--color-surface)]">
      <div className="hairline-gradient absolute inset-x-0 top-0" />
      <div className="container-page py-12 md:py-16">
        {/* Brand — full width on top */}
        <div className="mb-10 max-w-md">
          <div className="flex items-center gap-2.5">
            <img src={logoPusab} alt="PUSAB logo" className="h-12 w-12 object-contain md:h-14 md:w-14" />
            <div className="font-display text-2xl font-bold">PUSAB</div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Public University Students' Association of Bishwambarpur — a non-profit, non-political
            association of 300+ students.
          </p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Est. {SITE.founded}
          </p>
        </div>

        {/* Links — 2 cols on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
          <div>
            <h4 className="text-label">Quick Links</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-foreground/75 transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-label">Programs</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {PROGRAMS.slice(0, 6).map((p) => (
                <li key={p.key} className="text-foreground/75">
                  {p.title}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — spans full width on mobile (its own row) */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-label">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Mail size={15} className="mt-0.5 shrink-0 text-[var(--color-accent-1)]" />
                <a href={`mailto:${SITE.email}`} className="break-all hover:underline">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="mt-0.5 shrink-0 text-[var(--color-accent-1)]" />
                {SITE.phone}
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[var(--color-accent-1)]" />
                Bishwambarpur, Sunamganj
              </li>
              <li className="flex flex-wrap gap-2 mt-1">
                <a
                  href={SITE.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-foreground/80 transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)] hover:text-foreground"
                >
                  <Facebook size={14} className="text-[var(--color-accent-1)]" /> Facebook
                </a>
                <a
                  href={SITE.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-foreground/80 transition-colors hover:border-red-500/50 hover:text-foreground"
                >
                  <Youtube size={14} className="text-red-500" /> YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-center text-xs text-muted-foreground md:flex-row md:text-left">
          <p>
            © {new Date().getFullYear()} {SITE.fullName}. All rights reserved.
          </p>
          <p>Non-political · Non-profit · Educational.</p>
        </div>
      </div>
    </footer>
  );
}
