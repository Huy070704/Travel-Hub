import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-2 w-9 h-9" />
    );
  }

  const isDark = theme === "dark";

  const toggleDarkMode = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      onClick={toggleDarkMode}
      className="p-2 glass rounded-full hover:bg-muted transition-all"
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-primary" />
      )}
    </motion.button>
  );
}
