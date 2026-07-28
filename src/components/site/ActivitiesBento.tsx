import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ComponentType } from "react";

type Activity = {
  Icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  desc: string;
};

export function ActivitiesBento({ activities }: { activities: Activity[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {activities.map(({ Icon, title, desc }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -3 }}
          className="group relative flex flex-col rounded-xl border border-border bg-[var(--color-surface)] p-5 transition-colors duration-300 hover:border-[color-mix(in_oklab,var(--color-accent-1)_55%,transparent)] hover:shadow-[0_0_40px_-14px_rgba(79,110,247,0.28)]"
        >
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-white">
            <Icon size={16} />
          </div>
          <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{desc}</p>
          <div className="mt-4 flex items-center text-xs font-medium text-[var(--color-accent-1)] opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
            Learn more <ArrowRight size={12} className="ml-1" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
