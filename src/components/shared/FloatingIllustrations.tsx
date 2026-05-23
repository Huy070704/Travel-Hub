import { motion } from "motion/react";
import { Plane, Mountain, Palmtree, Camera, Map, Compass } from "lucide-react";

export function FloatingIllustrations() {
  const icons = [
    { Icon: Plane, x: "10%", y: "20%", delay: 0, color: "text-primary" },
    { Icon: Mountain, x: "80%", y: "15%", delay: 2, color: "text-purple-500" },
    { Icon: Palmtree, x: "15%", y: "70%", delay: 4, color: "text-green-500" },
    { Icon: Camera, x: "85%", y: "75%", delay: 1, color: "text-orange-500" },
    { Icon: Map, x: "50%", y: "10%", delay: 3, color: "text-cyan-500" },
    { Icon: Compass, x: "70%", y: "50%", delay: 5, color: "text-pink-500" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, x, y, delay, color }, index) => (
        <motion.div
          key={index}
          className={`absolute ${color} opacity-10`}
          style={{ left: x, top: y }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay,
            ease: "easeInOut",
          }}
        >
          <Icon className="w-16 h-16" />
        </motion.div>
      ))}
    </div>
  );
}
