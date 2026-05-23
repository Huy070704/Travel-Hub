import { motion } from "motion/react";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background">
        <div className="absolute inset-0 opacity-30">
          <motion.div
            className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-purple-500/30 via-blue-500/30 to-cyan-500/30 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-gradient-to-br from-cyan-500/30 via-teal-500/30 to-blue-500/30 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 left-1/3 w-1/2 h-1/2 bg-gradient-to-br from-orange-500/20 via-pink-500/20 to-purple-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, 100, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />
    </div>
  );
}

export function FloatingBlob({ delay = 0, className = "" }: { delay?: number; className?: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        x: [0, 50, -50, 0],
        y: [0, -50, 50, 0],
        scale: [1, 1.2, 0.8, 1],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}
