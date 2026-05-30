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
  Star,
  Bike,
  Bus,
  Train,
  Users,
  User,
  Gem,
  Tent,
  Camera,
  Cloud,
  Snowflake,
  Home,
  Hotel,
  WalletCards
} from "lucide-react";
import { FloatingBlob } from "../../../components/shared/AnimatedBackground";
import { getAiRecommendations } from "@/api/aiApi";
import type { AiRecommendRequest } from "@/types/ai";

type PlannerFormData = {
  departure: string;
  budget: string;
  days: string;
  interests: string[];
  transportationPreference: string;
  travelGroup: string;
  destinationType: string;
  mainTravelGoal: string;
  preferredWeather: string;
  accommodationType: string;
  budgetStyle: string;
};

type ChoiceOption = {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type ChoiceGroupProps = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  options: ChoiceOption[];
  value: string;
  onSelect: (id: string) => void;
  compact?: boolean;
};

const inputClassName =
  "w-full px-4 py-3 bg-white/80 rounded-xl border border-border/70 shadow-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/70";

function FieldLabel({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold mb-2.5 text-foreground">
      <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </span>
      <span>{children}</span>
    </label>
  );
}

function ChoiceGroup({ label, icon: LabelIcon, options, value, onSelect, compact = true }: ChoiceGroupProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white/70 p-4 shadow-sm">
      <FieldLabel icon={LabelIcon}>{label}</FieldLabel>
      <div className={compact ? "flex flex-wrap gap-2" : "grid grid-cols-2 gap-2"}>
        {options.map(({ id, label: optionLabel, icon: OptionIcon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium shadow-sm transition-all ${
              value === id
                ? "border-primary bg-gradient-to-r from-primary/10 to-secondary/10 text-primary shadow-primary/10"
                : "border-border/70 bg-white/80 hover:border-primary/50 hover:bg-primary/5"
            }`}
          >
            {OptionIcon && <OptionIcon className="w-4 h-4" />}
            <span>{optionLabel}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function AIRecommendationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState<PlannerFormData>({
    departure: "",
    budget: "",
    days: "",
    interests: [] as string[],
    transportationPreference: "",
    travelGroup: "",
    destinationType: "",
    mainTravelGoal: "",
    preferredWeather: "",
    accommodationType: "",
    budgetStyle: "",
  });

  const interests = [
    { id: "beach", label: "Beach & Relaxation", icon: Waves },
    { id: "adventure", label: "Adventure & Hiking", icon: Mountain },
    { id: "culture", label: "Culture & History", icon: Building2 },
    { id: "nature", label: "Nature & Wildlife", icon: Palmtree },
  ];

  const transportationPreferences = [
    { id: "motorbike", label: "Motorbike", icon: Bike },
    { id: "bus", label: "Bus", icon: Bus },
    { id: "train", label: "Train", icon: Train },
    { id: "airplane", label: "Airplane", icon: Plane },
    { id: "no_preference", label: "No Preference" },
  ];

  const travelGroups = [
    { id: "solo", label: "Solo", icon: User },
    { id: "friends", label: "Friends", icon: Users },
    { id: "couple", label: "Couple", icon: Heart },
    { id: "family", label: "Family", icon: Home },
    { id: "group", label: "Group", icon: Users },
  ];

  const destinationTypes = [
    { id: "beach", label: "Beach", icon: Waves },
    { id: "mountain", label: "Mountain", icon: Mountain },
    { id: "city", label: "City", icon: Building2 },
    { id: "island", label: "Island", icon: Palmtree },
    { id: "camping", label: "Camping", icon: Tent },
    { id: "food_tour", label: "Food Tour" },
  ];

  const mainTravelGoals = [
    { id: "relaxation", label: "Relaxation", icon: Waves },
    { id: "adventure", label: "Adventure", icon: Mountain },
    { id: "photography", label: "Photography", icon: Camera },
    { id: "budget_travel", label: "Budget Travel", icon: DollarSign },
    { id: "local_experience", label: "Local Experience", icon: Compass },
  ];

  const preferredWeatherOptions = [
    { id: "cool", label: "Cool", icon: Cloud },
    { id: "sunny", label: "Sunny", icon: ThermometerSun },
    { id: "cold", label: "Cold", icon: Snowflake },
    { id: "no_preference", label: "No Preference" },
  ];

  const accommodationTypes = [
    { id: "hostel", label: "Hostel", icon: Building2 },
    { id: "homestay", label: "Homestay", icon: Home },
    { id: "hotel", label: "Hotel", icon: Hotel },
    { id: "resort", label: "Resort", icon: Gem },
    { id: "no_preference", label: "No Preference" },
  ];

  const budgetStyles = [
    { id: "budget", label: "Budget", icon: DollarSign },
    { id: "balanced", label: "Balanced", icon: WalletCards },
    { id: "premium", label: "Premium", icon: Gem },
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
    const requestPayload: AiRecommendRequest = {
      budgetVND: Number(formData.budget),
      days: Number(formData.days),
      interests: formData.interests.join(", "),
      departure: formData.departure,
      transportationPreference: formData.transportationPreference,
      travelGroup: formData.travelGroup,
      destinationType: formData.destinationType,
      mainTravelGoal: formData.mainTravelGoal,
      preferredWeather: formData.preferredWeather,
      accommodationType: formData.accommodationType,
      budgetStyle: formData.budgetStyle,
    };

    void getAiRecommendations(requestPayload).catch((error) => {
      console.error("Failed to get AI recommendations", error);
    });
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

  const updateChoice = (field: keyof Omit<PlannerFormData, "departure" | "budget" | "days" | "interests">, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-cyan-50/30 to-background relative overflow-hidden">
      {/* Animated Background */}
      <FloatingBlob
        delay={0}
        className="w-[500px] h-[500px] bg-gradient-to-br from-blue-500/20 to-cyan-500/20 top-0 right-0"
      />
      <FloatingBlob
        delay={2}
        className="w-[420px] h-[420px] bg-gradient-to-br from-teal-500/20 to-emerald-500/20 bottom-0 left-0"
      />

      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary via-secondary to-cyan-500 text-white py-14 animate-gradient overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.12),transparent_32%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm text-sm font-semibold mb-5">
            <Sparkles className="w-4 h-4" />
            <span>Smart trip matching</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-normal">AI Travel Recommendations</h1>
          </div>
          <p className="text-white/90 max-w-2xl">
            Tell us about your dream trip and our AI will find the perfect destinations that match your budget and interests
          </p>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(360px,40%)_minmax(0,50%)] justify-center gap-8 xl:gap-10">
          {/* Search Form - Sticky Sidebar */}
          <div>
            <div className="sticky top-20">
              <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-primary/5 border border-white/80 p-5 md:p-6 space-y-4">
                <div className="flex items-start justify-between gap-3 pb-2">
                  <div>
                    <h2 className="font-bold text-xl">Plan Your Trip</h2>
                    <p className="text-sm text-muted-foreground">Quick preferences for better matches</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
                    <Compass className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-white/70 p-4 shadow-sm space-y-4">
                  <div>
                    <FieldLabel icon={MapPin}>Departing From</FieldLabel>
                  <input
                    type="text"
                    value={formData.departure}
                    onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                    placeholder="e.g., New York, USA"
                    className={inputClassName}
                    required
                  />
                  </div>

                  <div>
                    <FieldLabel icon={DollarSign}>Total Budget (USD)</FieldLabel>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="e.g., 1000"
                    className={inputClassName}
                    required
                  />
                  </div>

                  <div>
                    <FieldLabel icon={Calendar}>Number of Days</FieldLabel>
                  <input
                    type="number"
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                    placeholder="e.g., 7"
                    className={inputClassName}
                    required
                  />
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-white/70 p-4 shadow-sm">
                  <FieldLabel icon={Heart}>Travel Interests</FieldLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {interests.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleInterest(id)}
                        className={`flex min-h-[86px] flex-col items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium shadow-sm transition-all ${
                          formData.interests.includes(id)
                            ? "border-primary bg-gradient-to-br from-primary/10 to-secondary/10 text-primary shadow-primary/10"
                            : "border-border/70 bg-white/80 hover:border-primary/50 hover:bg-primary/5"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-center leading-snug">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <ChoiceGroup
                  label="Transportation Preference"
                  icon={Plane}
                  options={transportationPreferences}
                  value={formData.transportationPreference}
                  onSelect={(value) => updateChoice("transportationPreference", value)}
                />

                <ChoiceGroup
                  label="Travel Group"
                  icon={Users}
                  options={travelGroups}
                  value={formData.travelGroup}
                  onSelect={(value) => updateChoice("travelGroup", value)}
                />

                <ChoiceGroup
                  label="Destination Type"
                  icon={Compass}
                  options={destinationTypes}
                  value={formData.destinationType}
                  onSelect={(value) => updateChoice("destinationType", value)}
                />

                <ChoiceGroup
                  label="Main Travel Goal"
                  icon={Sparkles}
                  options={mainTravelGoals}
                  value={formData.mainTravelGoal}
                  onSelect={(value) => updateChoice("mainTravelGoal", value)}
                />

                <ChoiceGroup
                  label="Preferred Weather"
                  icon={CloudSun}
                  options={preferredWeatherOptions}
                  value={formData.preferredWeather}
                  onSelect={(value) => updateChoice("preferredWeather", value)}
                />

                <ChoiceGroup
                  label="Accommodation Type"
                  icon={Hotel}
                  options={accommodationTypes}
                  value={formData.accommodationType}
                  onSelect={(value) => updateChoice("accommodationType", value)}
                />

                <ChoiceGroup
                  label="Budget Style"
                  icon={WalletCards}
                  options={budgetStyles}
                  value={formData.budgetStyle}
                  onSelect={(value) => updateChoice("budgetStyle", value)}
                />

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 neon-primary font-semibold"
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
                className="mt-6 bg-white/75 backdrop-blur-xl rounded-2xl p-5 border border-white/80 shadow-lg shadow-primary/5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
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
          <div>
            {!showResults && !isLoading && (
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-primary/5 border border-white/80 p-10 md:p-12 text-center overflow-hidden relative">
                <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary mx-auto mb-6 flex items-center justify-center shadow-xl shadow-primary/20">
                  <Compass className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Ready to Discover?</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Fill in your preferences on the left and let our AI find the best destinations for your budget and interests
                </p>
              </div>
            )}

            {isLoading && (
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-primary/5 border border-white/80 p-10 md:p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary mx-auto mb-6 flex items-center justify-center animate-pulse shadow-xl shadow-primary/20">
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
                    className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-primary/5 border border-white/80 overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all hover-lift"
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>#{index + 1} Match</span>
                        </div>
                        <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 backdrop-blur-sm text-white rounded-full text-sm font-semibold shadow-sm">
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
                          <div className="flex items-center gap-2 text-sm rounded-xl bg-muted/60 p-3">
                            <ThermometerSun className="w-4 h-4 text-orange-500" />
                            <div>
                              <div className="font-semibold">{rec.weather.temp}</div>
                              <div className="text-xs text-muted-foreground">{rec.weather.condition}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm rounded-xl bg-muted/60 p-3">
                            <Plane className="w-4 h-4 text-primary" />
                            <div>
                              <div className="font-semibold">{rec.flightDuration}</div>
                              <div className="text-xs text-muted-foreground">Flight time</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm rounded-xl bg-muted/60 p-3">
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
                              className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Link
                            to={`/destination/${rec.id}`}
                            className="flex-1 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all text-center font-semibold"
                          >
                            View Details
                          </Link>
                          <button className="px-6 py-3 border border-border rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
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
