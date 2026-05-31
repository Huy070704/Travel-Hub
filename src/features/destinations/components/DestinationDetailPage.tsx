import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { getDestinationDetails } from "@/api/destinationsApi";
import type { DestinationDto } from "@/types/destinations";
import {
  Heart,
  Share2,
  MapPin,
  CloudSun,
  DollarSign,
  Utensils,
  Hotel,
  Bus,
  Sparkles,
  Calendar,
  Star,
  ArrowRight,
  Coffee,
  ShoppingBag,
  Camera
} from "lucide-react";

export function DestinationDetailPage() {
  const { id } = useParams();
  const [savedDestination, setSavedDestination] = useState(false);
  const [realDestination, setRealDestination] = useState<DestinationDto | null>(null);

  useEffect(() => {
    if (id) {
      getDestinationDetails(Number(id)).then(setRealDestination).catch(console.error);
    }
  }, [id]);

  const aiRecommendations = JSON.parse(localStorage.getItem("ai_recommendations") || "[]");
  const aiMatch = aiRecommendations.find((rec: any) => rec.id.toString() === id);

  const destination = {
    name: realDestination ? `${realDestination.name}, ${realDestination.cityProvince}` : (aiMatch ? aiMatch.destination : "Bali, Indonesia"),
    country: "Việt Nam",
    rating: 4.8,
    reviews: 2847,
    description: realDestination?.description || "A tropical paradise offering stunning beaches, ancient temples, lush rice terraces, and vibrant culture. Perfect for budget-conscious travelers seeking both adventure and relaxation.",
    images: [
      aiMatch ? aiMatch.image : "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200",
      "https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=1200",
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1200",
    ],
  };

  const weather = [
    { day: "Mon", temp: "28°C", icon: CloudSun, condition: "Sunny" },
    { day: "Tue", temp: "29°C", icon: CloudSun, condition: "Sunny" },
    { day: "Wed", temp: "27°C", icon: CloudSun, condition: "Partly Cloudy" },
    { day: "Thu", temp: "28°C", icon: CloudSun, condition: "Sunny" },
    { day: "Fri", temp: "30°C", icon: CloudSun, condition: "Hot" },
  ];

  const expenses = [
    { category: "Accommodation", icon: Hotel, daily: "$15-30", description: "Hostel dorms to budget hotels" },
    { category: "Food", icon: Utensils, daily: "$10-20", description: "Street food to casual dining" },
    { category: "Transportation", icon: Bus, daily: "$5-10", description: "Scooter rental or local transport" },
    { category: "Activities", icon: Camera, daily: "$10-25", description: "Temple visits, tours, water sports" },
    { category: "Entertainment", icon: Coffee, daily: "$5-15", description: "Cafes, nightlife, beach clubs" },
    { category: "Shopping", icon: ShoppingBag, daily: "$10-20", description: "Souvenirs and local markets" },
  ];

  const attractions = [
    {
      name: "Uluwatu Temple",
      image: "https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=400",
      distance: "25km",
      price: "$3",
      rating: 4.9,
    },
    {
      name: "Tegalalang Rice Terrace",
      image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400",
      distance: "18km",
      price: "$2",
      rating: 4.7,
    },
    {
      name: "Sacred Monkey Forest",
      image: "https://images.unsplash.com/photo-1558862107-d49ef2a04d72?w=400",
      distance: "12km",
      price: "$5",
      rating: 4.6,
    },
    {
      name: "Seminyak Beach",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
      distance: "8km",
      price: "Free",
      rating: 4.8,
    },
  ];

  const aiTips = [
    {
      title: "Best Time to Visit",
      content: "April to October offers the best weather with minimal rainfall. Avoid peak season (July-August) for better prices.",
    },
    {
      title: "Money-Saving Tips",
      content: "Rent a scooter for $5/day instead of taxis. Eat at local warungs (food stalls) for authentic meals under $3.",
    },
    {
      title: "Student Perks",
      content: "Many attractions offer student discounts. Bring your student ID and ask at ticket counters.",
    },
    {
      title: "Safety & Health",
      content: "Drink bottled water only. Watch for scooter traffic. Travel insurance recommended for adventure activities.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative">
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
            <div className="col-span-4 md:col-span-2 md:row-span-2">
              <img
                src={destination.images[0]}
                alt={destination.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {destination.images.slice(1, 5).map((image, index) => (
              <div key={index} className="hidden md:block overflow-hidden relative group">
                <img
                  src={image}
                  alt={`${destination.name} ${index + 2}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Optional overlay effect */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            ))}
          </div>

          {/* Floating Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-105 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSavedDestination(!savedDestination)}
              className={`p-3 rounded-full shadow-lg hover:scale-105 transition-all ${
                savedDestination
                  ? "bg-red-500 text-white"
                  : "bg-white/90 backdrop-blur-sm hover:bg-white"
              }`}
            >
              <Heart className={`w-5 h-5 ${savedDestination ? "fill-white" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span>{destination.country}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{destination.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{destination.rating}</span>
                  <span className="text-muted-foreground">({destination.reviews} reviews)</span>
                </div>
              </div>
              <p className="text-lg text-muted-foreground">{destination.description}</p>
            </div>

            {/* Weather Forecast */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">5-Day Weather Forecast</h3>
              <div className="grid grid-cols-5 gap-4">
                {weather.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">{day.day}</div>
                    <day.icon className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                    <div className="font-semibold">{day.temp}</div>
                    <div className="text-xs text-muted-foreground mt-1">{day.condition}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Daily Expense Breakdown</h3>
                <div className="text-2xl font-bold text-primary">$55-120</div>
              </div>
              <div className="space-y-4">
                {expenses.map((expense, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <expense.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{expense.category}</h4>
                        <div className="font-semibold text-primary">{expense.daily}/day</div>
                      </div>
                      <p className="text-sm text-muted-foreground">{expense.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Average Daily Total</span>
                  <span className="text-xl font-bold text-primary">$55-120</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  For a 7-day trip: <span className="font-semibold">$385-840 total</span>
                </p>
              </div>
            </div>

            {/* Nearby Attractions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6">Top Attractions Nearby</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attractions.map((attraction, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-xl">
                    <div className="aspect-video relative">
                      <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="font-semibold text-white mb-2">{attraction.name}</h4>
                        <div className="flex items-center justify-between text-sm text-white/90">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {attraction.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {attraction.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {attraction.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Travel Tips */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">{aiMatch ? "Tại sao AI đề xuất địa điểm này?" : "AI-Generated Travel Tips"}</h3>
              </div>
              
              {aiMatch && (
                <div className="mb-6 p-4 bg-white/60 dark:bg-black/20 rounded-xl border border-primary/20 shadow-inner">
                  <p className="text-foreground leading-relaxed text-lg">
                    <strong className="text-primary flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4"/> Đánh giá từ AI (Match Reason):</strong> 
                    {aiMatch.reasons[0]}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiTips.map((tip, index) => (
                  <div key={index} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4">
                    <h4 className="font-semibold mb-2">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground">{tip.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* Booking Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-primary mb-1">$520</div>
                  <div className="text-sm text-muted-foreground">Estimated total cost (7 days)</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm mb-2 block">Check-in</label>
                    <div className="flex items-center gap-2 px-4 py-3 bg-muted rounded-xl">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Select date</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm mb-2 block">Check-out</label>
                    <div className="flex items-center gap-2 px-4 py-3 bg-muted rounded-xl">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Select date</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/itinerary/${id || 1}`}
                  className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-3"
                >
                  <span>Create Itinerary</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button className="w-full py-3 border-2 border-border rounded-xl hover:border-primary hover:text-primary transition-all">
                  Save for Later
                </button>
              </div>

              {/* Quick Facts */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="font-semibold mb-4">Quick Facts</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Currency</span>
                    <span className="font-semibold">IDR (Rupiah)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Language</span>
                    <span className="font-semibold">Indonesian</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Time Zone</span>
                    <span className="font-semibold">GMT+8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Visa</span>
                    <span className="font-semibold">30-day free</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
