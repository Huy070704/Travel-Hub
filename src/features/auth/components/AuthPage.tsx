import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { useAuth } from "@/contexts/AuthContext";
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
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { FloatingBlob } from "../../../components/shared/AnimatedBackground";
import { GlowingButton } from "../../../components/shared/GlowingButton";
import { DarkModeToggle } from "../../../components/shared/DarkModeToggle";

export function AuthPage() {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    
    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.response && error.response.data) {
        setErrorMsg(
          typeof error.response.data === "string" 
            ? error.response.data 
            : error.response.data.message || "Invalid email or password."
        );
      } else {
        setErrorMsg("Network error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    
    setIsLoading(true);
    setErrorMsg("");
    
    try {
      await googleLogin(credentialResponse.credential);
      navigate("/");
    } catch (error: any) {
      console.error("Google Login failed:", error);
      if (error.response && error.response.data) {
        setErrorMsg(
          typeof error.response.data === "string" 
            ? error.response.data 
            : error.response.data.message || "Google Login failed."
        );
      } else {
        setErrorMsg("Network error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrorMsg("Google Login was cancelled or failed.");
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
              <div className="flex justify-center mb-6 w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  width="100%"
                />
              </div>

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

                {errorMsg && (
                  <div className="text-red-500 text-sm font-semibold text-center bg-red-500/10 py-2 rounded-lg">
                    {errorMsg}
                  </div>
                )}

                <GlowingButton type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
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
