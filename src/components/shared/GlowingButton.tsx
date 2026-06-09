import { ReactNode } from "react";

interface GlowingButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent";
  className?: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function GlowingButton({
  children,
  variant = "primary",
  className = "",
  onClick,
  href,
  disabled,
  type
}: GlowingButtonProps) {
  const variants = {
    primary: "from-primary to-secondary hover:shadow-primary/25",
    secondary: "from-cyan-500 to-teal-500 hover:shadow-cyan/25",
    accent: "from-orange-500 to-pink-500 hover:shadow-accent/25",
  };

  const Component = href ? "a" : "button";

  return (
    // @ts-ignore - Dynamic component type
    <Component
      href={href}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`relative px-8 py-4 bg-gradient-to-r ${variants[variant]} text-white rounded-full font-semibold overflow-hidden group active:scale-95 hover:scale-105 transition-all duration-300 ${className}`}
    >
      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

      {/* Button Glow - optimized blur */}
      <div className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300 bg-inherit -z-10" />

      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </Component>
  );
}
