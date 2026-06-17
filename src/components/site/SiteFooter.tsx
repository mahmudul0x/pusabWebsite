import { Link } from "@tanstack/react-router";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";
import { NAV_LINKS, PROGRAMS, SITE } from "@/lib/site-content";
import logoPusab from "@/assets/logo-pusab.png";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-border bg-[var(--color-surface)]">
      <div className="hairline-gradient absolute inset-x-0 top-0" />
      <div className="container-page py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5">
            <img src={logoPusab} alt="PUSAB logo" className="h-14 w-14 object-contain" />
            <div className="font-display text-2xl font-bold">PUSAB</div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
            Public University Students' Association of Bishwambarpur — a non-profit, non-political
            association of 300+ students.
          </p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Est. {SITE.founded}
          </p>
        </div>

        <div>
          <h4 className="text-label">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-foreground/80 hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-label">Programs</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {PROGRAMS.slice(0, 6).map((p) => (
              <li key={p.key} className="text-foreground/80">
                {p.title}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-label">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <Mail size={15} className="mt-0.5 text-[var(--color-accent-1)]" />
              <a href={`mailto:${SITE.email}`} className="hover:underline">
                {SITE.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone size={15} className="mt-0.5 text-[var(--color-accent-1)]" />
              {SITE.phone}
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 text-[var(--color-accent-1)]" />
              Bishwambarpur, Sunamganj
            </li>
            <li>
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-2 text-[var(--color-accent-1)] hover:underline"
              >
                <Facebook size={15} /> Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-5 flex flex-col md:flex-row gap-3 items-center justify-between text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {SITE.fullName}. All rights reserved.
          </p>
          <p>Built with intent. Non-political · Non-profit · Educational.</p>
        </div>
      </div>
    </footer>
  );
}
