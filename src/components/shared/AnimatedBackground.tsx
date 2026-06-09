import { useMemo } from "react";

// Particles dùng CSS animation thuần — nhẹ hơn Framer Motion nhiều lần
const PARTICLE_COUNT = 10; // Giảm từ 20 xuống 10

// Pre-generate positions để tránh Math.random() trong render
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  left: `${((i * 37 + 13) % 97)}%`,
  top: `${((i * 53 + 7) % 93)}%`,
  animationDuration: `${4 + (i % 4)}s`,
  animationDelay: `${(i * 0.4) % 3}s`,
}));

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Static gradient blobs — dùng CSS animation thay Framer Motion */}
      <div className="absolute inset-0 opacity-20">
        <div className="animated-blob-1 absolute top-0 -left-1/4 w-[40%] h-[40%] bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-full blur-2xl" />
        <div className="animated-blob-2 absolute top-1/4 right-0 w-[40%] h-[40%] bg-gradient-to-br from-cyan-500/20 via-teal-500/20 to-blue-500/20 rounded-full blur-2xl" />
      </div>

      {/* CSS-only particles — không dùng JS */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full animate-particle"
          style={{
            left: p.left,
            top: p.top,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
          }}
        />
      ))}

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />
    </div>
  );
}

// FloatingBlob dùng CSS class thay vì Framer Motion để nhẹ hơn
export function FloatingBlob({ delay = 0, className = "" }: { delay?: number; className?: string }) {
  const style = useMemo(() => ({
    animationDelay: `${delay}s`,
  }), [delay]);

  return (
    <div
      className={`absolute rounded-full blur-3xl animated-blob-float ${className}`}
      style={style}
    />
  );
}
