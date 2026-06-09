import { Plane, Mountain, Palmtree, Camera, Map, Compass } from "lucide-react";

export function FloatingIllustrations() {
  const icons = [
    { Icon: Plane, x: "10%", y: "20%", delay: "0s", color: "text-primary" },
    { Icon: Mountain, x: "80%", y: "15%", delay: "2s", color: "text-purple-500" },
    { Icon: Palmtree, x: "15%", y: "70%", delay: "4s", color: "text-green-500" },
    { Icon: Camera, x: "85%", y: "75%", delay: "1s", color: "text-orange-500" },
    { Icon: Map, x: "50%", y: "10%", delay: "3s", color: "text-cyan-500" },
    { Icon: Compass, x: "70%", y: "50%", delay: "5s", color: "text-pink-500" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, x, y, delay, color }, index) => (
        <div
          key={index}
          className={`absolute ${color} animate-illustration`}
          style={{ 
            left: x, 
            top: y,
            animationDelay: delay
          }}
        >
          <Icon className="w-16 h-16" />
        </div>
      ))}
    </div>
  );
}
