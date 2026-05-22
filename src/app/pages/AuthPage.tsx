import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Mail,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  Plane,
  MapPin,
  Compass,
  Globe
} from "lucide-react";
import { FloatingBlob } from "../components/AnimatedBackground";
import { GlowingButton } from "../components/GlowingButton";
import { DarkModeToggle } from "../components/DarkModeToggle";

export function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle authentication logic
    console.log("Form submitted:", formData);
  };

  const handleGoogleLogin = () => {
    // Handle Google OAuth
    console.log("Google login clicked");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <FloatingBlob
        delay={0}
        className="w-[800px] h-[800px] bg-gradient-to-br from-purple-500/30 to-blue-500/30 -top-1/4 -left-1/4"
      />
      <FloatingBlob
        delay={2}
        className="w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/30 to-teal-500/30 top-1/2 right-0"
      />
      <FloatingBlob
        delay={4}
        className="w-[500px] h-[500px] bg-gradient-to-br from-orange-500/20 to-pink-500/20 bottom-0 left-1/3"
      />

      {/* Floating Particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Back Button */}
      <Link to="/">
        <motion.button
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 glass rounded-full hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-semibold">Back to Home</span>
        </motion.button>
      </Link>

      {/* Dark Mode Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <DarkModeToggle />
      </div>

      {/* Main Content */}
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative">
        {/* Left Side - Illustration */}
        <motion.div
          className="hidden lg:flex items-center justify-center p-12 relative overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative z-10 max-w-lg">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
                <Plane className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">TravelHub</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Travel</p>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              className="text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Start Your Next
              <br />
              <span className="gradient-text">Adventure Today</span>
            </motion.h2>

            <motion.p
              className="text-lg text-muted-foreground mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Join thousands of students exploring the world on a budget. Get AI-powered recommendations and connect with travel buddies.
            </motion.p>

            {/* Feature List */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[
                { icon: Sparkles, text: "AI-powered destination recommendations" },
                { icon: Globe, text: "200+ budget-friendly destinations" },
                { icon: MapPin, text: "Connect with 50k+ student travelers" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 glass px-4 py-3 rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Floating Illustrations */}
            <div className="absolute inset-0 pointer-events-none">
              {[
                { Icon: Plane, x: "10%", y: "20%", delay: 0, rotate: 15 },
                { Icon: Compass, x: "80%", y: "30%", delay: 2, rotate: -20 },
                { Icon: MapPin, x: "15%", y: "75%", delay: 4, rotate: 10 },
                { Icon: Globe, x: "85%", y: "70%", delay: 3, rotate: -15 },
              ].map(({ Icon, x, y, delay, rotate }, index) => (
                <motion.div
                  key={index}
                  className="absolute opacity-10"
                  style={{ left: x, top: y }}
                  animate={{
                    y: [0, -30, 0],
                    rotate: [rotate, rotate + 20, rotate],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    delay,
                    ease: "easeInOut",
                  }}
                >
                  <Icon className="w-20 h-20 text-primary" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side - Auth Forms */}
        <div className="flex items-center justify-center p-6 lg:p-12 relative">
          <motion.div
            className="w-full max-w-md relative z-10"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Glassmorphism Card */}
            <div className="glass rounded-3xl p-8 shadow-2xl neon-primary">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold gradient-text">Welcome to TravelHub</span>
                </motion.div>

                <motion.h2
                  className="text-3xl font-bold mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Welcome Back
                </motion.h2>

                <p className="text-muted-foreground">
                  Enter your credentials to continue
                </p>
              </div>

              {/* Google Login Button */}
              <motion.button
                onClick={handleGoogleLogin}
                className="w-full mb-6 px-6 py-4 bg-white dark:bg-white/10 text-foreground rounded-xl font-semibold shadow-lg hover:shadow-xl border border-border flex items-center justify-center gap-3 transition-all group"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </motion.button>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3 bg-background/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 bg-background/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>

                <GlowingButton className="w-full">
                  Sign In
                </GlowingButton>
              </form>
            </div>

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mt-8">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">TravelHub</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
