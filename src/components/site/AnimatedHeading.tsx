import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
}

export function AnimatedHeading({ children, as = "h1", className = "", delay = 0 }: Props) {
  const words = children.split(" ");
  const Comp: any = motion[as];
  return (
    <Comp
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.06, delayChildren: delay } },
      }}
      className={className}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", opacity: 0, filter: "blur(8px)" },
              show: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Comp>
  ) as ReactNode;
}