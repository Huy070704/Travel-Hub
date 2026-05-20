import { useState } from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Utensils,
  Camera,
  Coffee,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Navigation,
  Star
} from "lucide-react";

export function ItineraryPlannerPage() {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  const itinerary = [
    {
      day: 1,
      title: "Arrival & Ubud Exploration",
      activities: [
        {
          time: "09:00 AM",
          period: "morning",
          title: "Arrival at Ngurah Rai Airport",
          description: "Pick up rental scooter or arrange airport transfer to Ubud",
          duration: "1.5 hours",
          cost: "$10",
          type: "transport",
          icon: Navigation,
        },
        {
          time: "11:00 AM",
          period: "morning",
          title: "Check-in at Hostel",
          description: "Drop bags at your accommodation in central Ubud",
          duration: "30 min",
          cost: "$15",
          type: "accommodation",
          icon: MapPin,
        },
        {
          time: "12:00 PM",
          period: "afternoon",
          title: "Lunch at Local Warung",
          description: "Try authentic Nasi Campur at Warung Biah Biah",
          duration: "1 hour",
          cost: "$3",
          type: "food",
          icon: Utensils,
        },
        {
          time: "02:00 PM",
          period: "afternoon",
          title: "Sacred Monkey Forest Sanctuary",
          description: "Explore the lush forest sanctuary and interact with playful monkeys",
          duration: "2 hours",
          cost: "$5",
          type: "attraction",
          icon: Camera,
        },
        {
          time: "05:00 PM",
          period: "evening",
          title: "Ubud Traditional Art Market",
          description: "Browse local crafts, textiles, and souvenirs",
          duration: "1.5 hours",
          cost: "$20",
          type: "activity",
          icon: MapPin,
        },
        {
          time: "07:00 PM",
          period: "evening",
          title: "Dinner & Sunset at Café",
          description: "Enjoy Indonesian cuisine with rice terrace views",
          duration: "2 hours",
          cost: "$8",
          type: "food",
          icon: Utensils,
        },
      ],
    },
    {
      day: 2,
      title: "Tegalalang & Cultural Sites",
      activities: [
        {
          time: "06:30 AM",
          period: "morning",
          title: "Sunrise at Tegalalang Rice Terrace",
          description: "Catch the stunning sunrise over iconic rice paddies",
          duration: "2 hours",
          cost: "$2",
          type: "attraction",
          icon: Sunrise,
        },
        {
          time: "09:00 AM",
          period: "morning",
          title: "Breakfast with a View",
          description: "Fresh tropical fruits and coffee overlooking terraces",
          duration: "1 hour",
          cost: "$5",
          type: "food",
          icon: Coffee,
        },
        {
          time: "11:00 AM",
          period: "afternoon",
          title: "Tirta Empul Temple",
          description: "Visit the holy spring water temple for cultural experience",
          duration: "2 hours",
          cost: "$3",
          type: "attraction",
          icon: Camera,
        },
        {
          time: "02:00 PM",
          period: "afternoon",
          title: "Lunch in Tampaksiring",
          description: "Local Indonesian dishes near the temple",
          duration: "1 hour",
          cost: "$4",
          type: "food",
          icon: Utensils,
        },
        {
          time: "04:00 PM",
          period: "afternoon",
          title: "Coffee Plantation Tour",
          description: "Learn about Luwak coffee and sample local varieties (free tasting!)",
          duration: "1.5 hours",
          cost: "Free",
          type: "activity",
          icon: Coffee,
        },
        {
          time: "07:00 PM",
          period: "evening",
          title: "Traditional Dance Performance",
          description: "Watch mesmerizing Kecak fire dance at Ubud Palace",
          duration: "2 hours",
          cost: "$7",
          type: "activity",
          icon: Camera,
        },
      ],
    },
    {
      day: 3,
      title: "Beach Day in Seminyak",
      activities: [
        {
          time: "08:00 AM",
          period: "morning",
          title: "Drive to Seminyak",
          description: "Scenic coastal drive from Ubud (rent scooter or share a ride)",
          duration: "1.5 hours",
          cost: "$5",
          type: "transport",
          icon: Navigation,
        },
        {
          time: "10:00 AM",
          period: "morning",
          title: "Surfing Lesson",
          description: "2-hour beginner-friendly surf lesson at Seminyak Beach",
          duration: "2 hours",
          cost: "$25",
          type: "activity",
          icon: Camera,
        },
        {
          time: "12:30 PM",
          period: "afternoon",
          title: "Beach Club Lunch",
          description: "Affordable lunch at beachfront café with ocean views",
          duration: "1.5 hours",
          cost: "$12",
          type: "food",
          icon: Utensils,
        },
        {
          time: "03:00 PM",
          period: "afternoon",
          title: "Beach Relaxation",
          description: "Sunbathe, swim, and enjoy the vibrant beach atmosphere",
          duration: "3 hours",
          cost: "Free",
          type: "activity",
          icon: Sun,
        },
        {
          time: "06:00 PM",
          period: "evening",
          title: "Sunset at Potato Head",
          description: "Watch spectacular sunset from iconic beach club",
          duration: "1 hour",
          cost: "$8",
          type: "activity",
          icon: Sunset,
        },
        {
          time: "08:00 PM",
          period: "evening",
          title: "Dinner & Nightlife",
          description: "Explore Seminyak's vibrant dining and bar scene",
          duration: "3 hours",
          cost: "$15",
          type: "food",
          icon: Utensils,
        },
      ],
    },
  ];

  const getPeriodIcon = (period: string) => {
    switch (period) {
      case "morning":
        return Sunrise;
      case "afternoon":
        return Sun;
      case "evening":
        return Sunset;
      default:
        return Moon;
    }
  };

  const getPeriodColor = (period: string) => {
    switch (period) {
      case "morning":
        return "from-orange-400 to-yellow-400";
      case "afternoon":
        return "from-yellow-400 to-orange-500";
      case "evening":
        return "from-purple-500 to-pink-500";
      default:
        return "from-indigo-500 to-purple-600";
    }
  };

  const totalCost = itinerary.reduce(
    (sum, day) =>
      sum +
      day.activities.reduce((daySum, activity) => {
        const cost = activity.cost.replace("$", "").toLowerCase();
        return daySum + (cost === "free" ? 0 : parseFloat(cost));
      }, 0),
    0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">AI-Generated Itinerary</h1>
          </div>
          <p className="text-white/90 max-w-2xl mb-6">
            Your personalized 7-day adventure in Bali, Indonesia
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <MapPin className="w-4 h-4" />
              <span>Bali, Indonesia</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <Clock className="w-4 h-4" />
              <span>7 Days</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <DollarSign className="w-4 h-4" />
              <span>${totalCost.toFixed(0)} Total</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Timeline Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold mb-4">Trip Overview</h3>
              <div className="space-y-2">
                {itinerary.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setExpandedDay(day.day)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                      expandedDay === day.day
                        ? "bg-primary text-white"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <div className="font-semibold mb-1">Day {day.day}</div>
                    <div className={`text-sm ${expandedDay === day.day ? "text-white/80" : "text-muted-foreground"}`}>
                      {day.title}
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Days</span>
                  <span className="font-semibold">{itinerary.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Activities</span>
                  <span className="font-semibold">
                    {itinerary.reduce((sum, day) => sum + day.activities.length, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Est. Cost</span>
                  <span className="font-semibold text-primary">${totalCost.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Itinerary Details */}
          <div className="lg:col-span-3 space-y-8">
            {itinerary.map((day) => (
              <div key={day.day} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Day Header */}
                <button
                  onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white p-6 flex items-center justify-between hover:opacity-95 transition-opacity"
                >
                  <div className="text-left">
                    <div className="text-2xl font-bold mb-1">Day {day.day}</div>
                    <div className="text-white/90">{day.title}</div>
                  </div>
                  {expandedDay === day.day ? (
                    <ChevronUp className="w-6 h-6" />
                  ) : (
                    <ChevronDown className="w-6 h-6" />
                  )}
                </button>

                {/* Day Activities */}
                {expandedDay === day.day && (
                  <div className="p-6">
                    <div className="relative">
                      {/* Timeline Line */}
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-purple-500" />

                      {/* Activities */}
                      <div className="space-y-6">
                        {day.activities.map((activity, index) => {
                          const PeriodIcon = getPeriodIcon(activity.period);
                          const ActivityIcon = activity.icon;

                          return (
                            <div key={index} className="relative pl-16">
                              {/* Timeline Dot */}
                              <div
                                className={`absolute left-3 w-6 h-6 rounded-full bg-gradient-to-br ${getPeriodColor(
                                  activity.period
                                )} flex items-center justify-center shadow-lg`}
                              >
                                <PeriodIcon className="w-3 h-3 text-white" />
                              </div>

                              {/* Activity Card */}
                              <div className="bg-muted/50 rounded-xl p-4 hover:bg-muted transition-all">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                      <ActivityIcon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                      <div className="font-semibold mb-1">{activity.title}</div>
                                      <div className="text-sm text-muted-foreground">
                                        {activity.description}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right flex-shrink-0 ml-4">
                                    <div className="font-semibold text-primary">{activity.cost}</div>
                                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{activity.duration}</span>
                                  </div>
                                  <div className="px-2 py-1 bg-white rounded-full capitalize">
                                    {activity.type}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Day Summary */}
                    <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {day.activities.length} activities planned
                      </div>
                      <div className="text-lg font-bold text-primary">
                        $
                        {day.activities
                          .reduce((sum, activity) => {
                            const cost = activity.cost.replace("$", "").toLowerCase();
                            return sum + (cost === "free" ? 0 : parseFloat(cost));
                          }, 0)
                          .toFixed(0)}{" "}
                        total
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* AI Recommendations */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">AI Travel Assistant Recommendations</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Transportation Tip:</strong> Renting a scooter for $5/day gives you freedom to explore. Always wear a helmet and drive safely.
                    </p>
                    <p>
                      <strong>Food Budget:</strong> Mix street food ($2-3) with occasional sit-down meals ($8-12) to balance budget and experience.
                    </p>
                    <p>
                      <strong>Flexibility:</strong> This itinerary allows for spontaneous changes. Feel free to swap activities based on weather or local recommendations!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurant Recommendations */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-primary" />
                Recommended Restaurants
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: "Warung Biah Biah",
                    cuisine: "Indonesian",
                    price: "$2-5",
                    rating: 4.8,
                    location: "Ubud",
                  },
                  {
                    name: "Café Pomegranate",
                    cuisine: "International",
                    price: "$5-10",
                    rating: 4.7,
                    location: "Ubud",
                  },
                  {
                    name: "La Plancha",
                    cuisine: "Beach Bar",
                    price: "$8-15",
                    rating: 4.6,
                    location: "Seminyak",
                  },
                  {
                    name: "Naughty Nuri's",
                    cuisine: "BBQ",
                    price: "$6-12",
                    rating: 4.9,
                    location: "Ubud",
                  },
                ].map((restaurant, index) => (
                  <div key={index} className="p-4 bg-muted/50 rounded-xl hover:bg-muted transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{restaurant.name}</h4>
                        <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{restaurant.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{restaurant.location}</span>
                      <span className="font-semibold text-primary">{restaurant.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
