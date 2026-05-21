import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Search,
  Sparkles,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Star,
  Plane,
  MessageCircle,
  Globe,
  Zap,
  Shield,
  Heart,
  Calendar
} from "lucide-react";
import { GlowingButton } from "../components/GlowingButton";
import { FloatingBlob } from "../components/AnimatedBackground";
import { FloatingIllustrations } from "../components/FloatingIllustrations";

export function LandingPage() {
  const trendingDestinations = [
    {
      id: 1,
      name: "Bali, Indonesia",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
      budget: "$400-600",
      rating: 4.8,
      travelers: "2.3k"
    },
    {
      id: 2,
      name: "Tokyo, Japan",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
      budget: "$800-1200",
      rating: 4.9,
      travelers: "4.2k"
    },
    {
      id: 3,
      name: "Barcelona, Spain",
      image: "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=800",
      budget: "$500-700",
      rating: 4.8,
      travelers: "2.8k"
    },
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Recommendations",
      description: "Get personalized destination suggestions based on your budget and preferences",
      gradient: "from-purple-500 to-blue-500"
    },
    {
      icon: Users,
      title: "Find Travel Buddies",
      description: "Connect with fellow students and split costs for amazing adventures",
      gradient: "from-cyan-500 to-teal-500"
    },
    {
      icon: DollarSign,
      title: "Budget-Friendly",
      description: "Explore the world without breaking the bank with our cost-saving tips",
      gradient: "from-orange-500 to-pink-500"
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Blobs */}
        <FloatingBlob
          delay={0}
          className="w-[500px] h-[500px] bg-gradient-to-br from-purple-500/30 to-blue-500/30 top-0 left-0"
        />
        <FloatingBlob
          delay={2}
          className="w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/30 to-teal-500/30 bottom-0 right-0"
        />
        <FloatingBlob
          delay={4}
          className="w-[400px] h-[400px] bg-gradient-to-br from-orange-500/20 to-pink-500/20 top-1/2 left-1/2"
        />

        {/* Floating Travel Illustrations */}
        <FloatingIllustrations />

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <motion.div
            className="text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8 neon-primary"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold gradient-text">AI-Powered Travel Platform</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Travel-Smarter
              <br />
              <span className="gradient-text">with AI</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Affordable adventures for students. Discover destinations, connect with travel buddies, and explore the world on your budget.
            </motion.p>

            {/* AI Search Box */}
            <motion.div
              className="max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="glass rounded-2xl p-2 shadow-2xl neon-primary">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 flex items-center gap-3 px-6 py-4 bg-background/50 rounded-xl">
                    <Search className="w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Where do you want to go? Ask our AI..."
                      className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <Link to="/discover">
                    <GlowingButton>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        <span>Get Started</span>
                      </div>
                    </GlowingButton>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/discover">
                <GlowingButton className="min-w-[200px]">
                  Explore Destinations
                </GlowingButton>
              </Link>

              {/* Google Login Button */}
              <motion.button
                className="min-w-[200px] px-8 py-4 bg-white text-foreground rounded-full font-semibold shadow-lg hover:shadow-xl border border-border flex items-center justify-center gap-3"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
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
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-8 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {[
                { icon: Users, label: "50k+ Students" },
                { icon: MapPin, label: "200+ Destinations" },
                { icon: DollarSign, label: "Budget-Friendly" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 glass px-4 py-2 rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  <stat.icon className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 bg-primary rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="gradient-text">TravelHub</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for your perfect student adventure
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -8 }}
              >
                <div className="glass rounded-2xl p-8 h-full hover:shadow-2xl transition-all">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>

                  {/* Hover Glow */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity -z-10 blur-xl`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Destinations */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center justify-between mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                <span className="text-sm text-accent uppercase tracking-wide font-semibold">Trending Now</span>
              </div>
              <h2 className="text-4xl font-bold">Popular Destinations</h2>
            </div>
            <Link to="/discover">
              <motion.button
                className="flex items-center gap-2 text-primary hover:gap-3 transition-all"
                whileHover={{ x: 5 }}
              >
                <span className="font-semibold">View All</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trendingDestinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/destination/${destination.id}`}>
                  <motion.div
                    className="group relative overflow-hidden rounded-2xl glass hover:shadow-2xl transition-all"
                    whileHover={{ y: -8 }}
                  >
                    <div className="aspect-[4/5] relative overflow-hidden">
                      <motion.img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{destination.rating}</span>
                          <span className="mx-1">•</span>
                          <Users className="w-3 h-3" />
                          <span>{destination.travelers}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{destination.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <DollarSign className="w-4 h-4" />
                          <span>{destination.budget}</span>
                        </div>
                      </div>

                      {/* Trending Badge */}
                      <div className="absolute top-4 right-4 px-3 py-1 bg-accent/90 backdrop-blur-sm text-white text-xs rounded-full font-semibold animate-pulse-glow">
                        Trending
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Preview */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-12 md:p-16 relative overflow-hidden">
            {/* Background Gradient */}
            <FloatingBlob
              delay={0}
              className="w-[400px] h-[400px] bg-gradient-to-br from-purple-500/20 to-blue-500/20"
            />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-6 h-6 text-primary" />
                  <span className="text-sm text-primary uppercase tracking-wide font-semibold">Community</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Find Your Travel Buddies
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Connect with fellow student travelers, share experiences, and split costs for amazing adventures around the world.
                </p>
                <Link to="/community">
                  <GlowingButton>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      <span>Join Community</span>
                    </div>
                  </GlowingButton>
                </Link>
              </motion.div>

              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                {[
                  { icon: Globe, label: "50k+ Members", color: "from-blue-500 to-cyan-500" },
                  { icon: MessageCircle, label: "Active Chat", color: "from-purple-500 to-pink-500" },
                  { icon: Heart, label: "Safe Community", color: "from-orange-500 to-red-500" },
                  { icon: Calendar, label: "Daily Events", color: "from-green-500 to-teal-500" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="glass rounded-2xl p-6 text-center hover-lift"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-semibold">{item.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center text-white"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-purple-600 animate-gradient" />

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />

            <div className="relative z-10">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-4 h-4" />
                <span className="text-sm font-semibold">Limited Time Offer</span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Start Your Adventure?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of students exploring the world on a budget
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/discover">
                  <motion.button
                    className="px-8 py-4 bg-white text-primary rounded-full font-semibold hover:shadow-2xl transition-all min-w-[200px]"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started Free
                  </motion.button>
                </Link>
                <Link to="/community">
                  <motion.button
                    className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/30 transition-all border border-white/30 min-w-[200px]"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Join Community
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Plane className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">TravelHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered travel platform for students. Explore the world on your budget.
              </p>
            </div>

            {[
              {
                title: "Product",
                links: ["Destinations", "AI Recommendations", "Community", "Itinerary Planner"]
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Blog", "Contact"]
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Security", "Support"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 TravelHub. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {[Shield, Globe, Heart].map((Icon, index) => (
                <motion.button
                  key={index}
                  className="p-2 glass rounded-full hover:bg-primary/10 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
