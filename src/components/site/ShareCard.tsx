import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Facebook, MessageCircle, Share2, X } from "lucide-react";
import logoPusab from "@/assets/logo-pusab.png";
import { SITE } from "@/lib/site-content";

const SITE_URL = "https://pusab.net";
const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=340x340&margin=12&color=07070D&bgcolor=ffffff&data=${encodeURIComponent(SITE_URL)}`;

const EASE = [0.16, 1, 0.3, 1] as const;

const SHARE_TEXT = "PUSAB's official website is now live! Check it out:";

function shareLinks() {
  const url = encodeURIComponent(SITE_URL);
  const text = encodeURIComponent(SHARE_TEXT);
  return {
    whatsapp: `https://wa.me/?text=${text}%20${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  };
}

export function ShareCard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [nativeShareAvailable] = useState(
    () => typeof navigator !== "undefined" && !!navigator.share,
  );
  const links = shareLinks();

  const nativeShare = async () => {
    try {
      await navigator.share({ title: SITE.name, text: SHARE_TEXT, url: SITE_URL });
    } catch {
      // User cancelled — nothing to do.
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Share PUSAB's website"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm overflow-hidden rounded-[28px] bg-[var(--color-surface)] text-center shadow-[0_60px_150px_-30px_rgba(2,6,23,0.9),0_0_0_1px_rgba(255,255,255,0.08)]"
          >
            <div className="h-[3px] bg-[linear-gradient(90deg,var(--color-accent-1),var(--color-accent-2),var(--color-accent-3))]" />

            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-4 z-10 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground/60 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <X size={15} />
            </button>

            <div className="px-7 pb-7 pt-8">
              <img src={logoPusab} alt="PUSAB" className="mx-auto h-14 w-14 object-contain" />
              <p className="mt-3 font-display text-lg font-bold tracking-tight">
                PUSAB is officially live
              </p>
              <p className="mx-auto mt-1.5 max-w-[240px] text-xs leading-relaxed text-muted-foreground">
                Scan to open the site, or share it with someone.
              </p>

              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
                className="mx-auto mt-6 w-fit rounded-2xl bg-white p-3 shadow-[0_18px_50px_-18px_rgba(2,6,23,0.5)]"
              >
                <img src={QR_SRC} alt="QR code linking to pusab.net" className="h-40 w-40 sm:h-48 sm:w-48" />
              </motion.div>

              <p className="mt-4 text-sm font-semibold text-[var(--color-accent-1)]">pusab.net</p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                {nativeShareAvailable && (
                  <button
                    onClick={nativeShare}
                    className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                  >
                    <Share2 size={15} /> Share
                  </button>
                )}
                <a
                  href={links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:border-green-500/40 hover:text-green-500"
                >
                  <MessageCircle size={15} /> WhatsApp
                </a>
                <a
                  href={links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:border-blue-500/40 hover:text-blue-500"
                >
                  <Facebook size={15} /> Facebook
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
