import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Sparkles,
  MapPin,
  DollarSign,
  Calendar,
  Heart,
  Compass,
  Palmtree,
  Mountain,
  Building2,
  Waves,
  CloudSun,
  ThermometerSun,
  Plane,
  TrendingUp,
  Star
} from "lucide-react";
import { FloatingBlob } from "../../../components/shared/AnimatedBackground";

export function AIRecommendationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState({
    departure: "",
    budget: "",
    days: "",
    interests: [] as string[],
  });

  const interests = [
    { id: "beach", label: "Beach & Relaxation", icon: Waves },
    { id: "adventure", label: "Adventure & Hiking", icon: Mountain },
    { id: "culture", label: "Culture & History", icon: Building2 },
    { id: "nature", label: "Nature & Wildlife", icon: Palmtree },
  ];

  const recommendations = [
    {
      id: 1,
      destination: "Bali, Indonesia",
      country: "Indonesia",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
      estimatedCost: "$520",
      confidence: 95,
      weather: { temp: "28°C", condition: "Sunny" },
      flightDuration: "8h 30m",
      matchScore: 98,
      reasons: [
        "Perfect for beach lovers with world-class surfing",
        "Extremely budget-friendly accommodation and food",
        "Rich cultural experiences and ancient temples",
        "Vibrant nightlife and social scene for students"
      ],
      highlights: ["Uluwatu Temple", "Rice Terraces", "Beach Clubs", "Monkey Forest"],
    },
    {
      id: 2,
      destination: "Lisbon, Portugal",
      country: "Portugal",
      image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800",
      estimatedCost: "$680",
      confidence: 88,
      weather: { temp: "22°C", condition: "Partly Cloudy" },
      flightDuration: "6h 15m",
      matchScore: 92,
      reasons: [
        "Affordable European destination with great student discounts",
        "Beautiful coastal city with historic charm",
        "Amazing food scene and nightlife",
        "Easy access to nearby beaches and day trips"
      ],
      highlights: ["Belém Tower", "Alfama District", "Tram 28", "Coastal Views"],
    },
    {
      id: 3,
      destination: "Chiang Mai, Thailand",
      country: "Thailand",
      image: "https://images.unsplash.com/photo-1598977123118-4e30ba3c4f5b?w=800",
      estimatedCost: "$420",
      confidence: 90,
      weather: { temp: "30°C", condition: "Warm" },
      flightDuration: "9h 45m",
      matchScore: 89,
      reasons: [
        "Incredibly low cost of living",
        "Perfect blend of culture and adventure activities",
        "Digital nomad hub with great cafes and coworking",
        "Gateway to jungle trekking and elephant sanctuaries"
      ],
      highlights: ["Doi Suthep", "Night Markets", "Temples", "Thai Cooking Classes"],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 2500);
  };

  const toggleInterest = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : [...prev.interests, id],
    }));
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Animated Background */}
      <FloatingBlob
        delay={0}
        className="w-[500px] h-[500px] bg-gradient-to-br from-purple-500/20 to-blue-500/20 top-0 right-0"
      />
      <FloatingBlob
        delay={2}
        className="w-[400px] h-[400px] bg-gradient-to-br from-cyan-500/20 to-teal-500/20 bottom-0 left-0"
      />

      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary via-secondary to-purple-600 text-white py-12 animate-gradient overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">AI Travel Recommendations</h1>
          </div>
          <p className="text-white/90 max-w-2xl">
            Tell us about your dream trip and our AI will find the perfect destinations that match your budget and interests
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Form - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Departing From</span>
                  </label>
                  <input
                    type="text"
                    value={formData.departure}
                    onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                    placeholder="e.g., New York, USA"
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm mb-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span>Total Budget (USD)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="e.g., 1000"
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>Number of Days</span>
                  </label>
                  <input
                    type="number"
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                    placeholder="e.g., 7"
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm mb-3">
                    <Heart className="w-4 h-4 text-primary" />
                    <span>Travel Interests</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {interests.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleInterest(id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                          formData.interests.includes(id)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs text-center">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 neon-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>AI is thinking...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Get Recommendations</span>
                    </>
                  )}
                </motion.button>
              </form>

              {/* AI Assistant Panel */}
              <motion.div
                className="mt-6 glass rounded-2xl p-6 border border-purple-200/50 neon-purple"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">AI Travel Assistant</h4>
                    <p className="text-sm text-muted-foreground">
                      Our AI analyzes 1000+ destinations, real traveler reviews, weather patterns, and budget data to find your perfect match.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {!showResults && !isLoading && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-6 flex items-center justify-center">
                  <Compass className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Ready to Discover?</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Fill in your preferences on the left and let our AI find the best destinations for your budget and interests
                </p>
              </div>
            )}

            {isLoading && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-6 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">AI is Analyzing...</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Searching through thousands of destinations and matching them with your preferences
                </p>
                <div className="flex flex-col gap-2 max-w-md mx-auto">
                  {["Analyzing budget options", "Checking weather conditions", "Finding best matches"].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div
                        className="w-2 h-2 rounded-full bg-primary animate-pulse"
                        style={{ animationDelay: `${i * 200}ms` }}
                      />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showResults && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">Top Recommendations for You</h3>
                    <p className="text-muted-foreground">Based on your preferences and budget</p>
                  </div>
                </div>

                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover-lift"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="grid md:grid-cols-5 gap-0">
                      {/* Image */}
                      <div className="md:col-span-2 relative h-64 md:h-auto">
                        <img
                          src={rec.image}
                          alt={rec.destination}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>#{index + 1} Match</span>
                        </div>
                        <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 backdrop-blur-sm text-white rounded-full text-sm font-semibold">
                          {rec.matchScore}% Match
                        </div>
                      </div>

                      {/* Content */}
                      <div className="md:col-span-3 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-2xl font-bold mb-1">{rec.destination}</h4>
                            <p className="text-muted-foreground">{rec.country}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{rec.estimatedCost}</div>
                            <div className="text-xs text-muted-foreground">Total estimated cost</div>
                          </div>
                        </div>

                        {/* Quick Info */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <ThermometerSun className="w-4 h-4 text-orange-500" />
                            <div>
                              <div className="font-semibold">{rec.weather.temp}</div>
                              <div className="text-xs text-muted-foreground">{rec.weather.condition}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Plane className="w-4 h-4 text-primary" />
                            <div>
                              <div className="font-semibold">{rec.flightDuration}</div>
                              <div className="text-xs text-muted-foreground">Flight time</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <div>
                              <div className="font-semibold">{rec.confidence}%</div>
                              <div className="text-xs text-muted-foreground">Confidence</div>
                            </div>
                          </div>
                        </div>

                        {/* Why AI Recommends */}
                        <div className="mb-4">
                          <h5 className="font-semibold mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            Why AI Recommends This
                          </h5>
                          <ul className="space-y-1.5">
                            {rec.reasons.map((reason, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Highlights */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {rec.highlights.map((highlight, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-muted text-sm rounded-full"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Link
                            to={`/destination/${rec.id}`}
                            className="flex-1 py-3 bg-primary text-white rounded-xl hover:shadow-lg transition-all text-center"
                          >
                            View Details
                          </Link>
                          <button className="px-6 py-3 border-2 border-border rounded-xl hover:border-primary hover:text-primary transition-all">
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
