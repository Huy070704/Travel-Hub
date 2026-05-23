import { Outlet, Link, useLocation } from "react-router";
import { Plane, Compass, Users, MessageCircle, User, Shield } from "lucide-react";
import { AnimatedBackground } from "../components/shared/AnimatedBackground";
import { DarkModeToggle } from "../components/shared/DarkModeToggle";
import { motion, AnimatePresence } from "motion/react";

export function RootLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { path: "/", label: "Home", icon: Plane },
    { path: "/discover", label: "Discover", icon: Compass },
    { path: "/community", label: "Community", icon: Users },
    { path: "/chat", label: "Chat", icon: MessageCircle },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />

      {/* Glassmorphism Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TravelHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(path)
                      ? "bg-primary text-white"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive("/admin")
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-3">
              <DarkModeToggle />
              <Link to="/auth">
                <motion.button
                  className="px-6 py-2 bg-gradient-to-r from-accent to-orange-500 text-white rounded-full hover:shadow-lg transition-all neon-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-border">
          <div className="flex items-center justify-around py-2">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  isActive(path)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 pb-20 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
