import { motion } from "motion/react";
import { ReactNode } from "react";

interface GlowingButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent";
  className?: string;
  onClick?: () => void;
  href?: string;
}

export function GlowingButton({
  children,
  variant = "primary",
  className = "",
  onClick,
  href
}: GlowingButtonProps) {
  const variants = {
    primary: "from-primary to-secondary hover:shadow-primary/50",
    secondary: "from-cyan-500 to-teal-500 hover:shadow-cyan/50",
    accent: "from-orange-500 to-pink-500 hover:shadow-accent/50",
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      href={href}
      onClick={onClick}
      className={`relative px-8 py-4 bg-gradient-to-r ${variants[variant]} text-white rounded-full font-semibold overflow-hidden group ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

      {/* Button Shadow */}
      <div className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary to-secondary -z-10" />

      <span className="relative z-10">{children}</span>
    </Component>
  );
}
