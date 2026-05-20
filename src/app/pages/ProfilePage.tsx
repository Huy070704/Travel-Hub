import { useState } from "react";
import { Link } from "react-router";
import {
  MapPin,
  Calendar,
  Heart,
  Settings,
  Edit,
  Plane,
  Camera,
  Award,
  Star,
  Globe,
  Users,
  MessageCircle
} from "lucide-react";

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const profile = {
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    coverImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600",
    university: "UC Berkeley",
    major: "Computer Science",
    location: "San Francisco, CA",
    bio: "Adventure seeker and budget traveler exploring the world one destination at a time. Always looking for travel buddies and hidden gems!",
    joinedDate: "Jan 2025",
    stats: {
      trips: 12,
      followers: 234,
      following: 189,
    },
  };

  const interests = [
    "Beach & Relaxation",
    "Adventure & Hiking",
    "Culture & History",
    "Food & Cuisine",
    "Photography",
    "Budget Travel",
  ];

  const favoriteDestinations = [
    {
      id: 1,
      name: "Bali, Indonesia",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400",
      visited: true,
    },
    {
      id: 2,
      name: "Tokyo, Japan",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
      visited: false,
    },
    {
      id: 3,
      name: "Barcelona, Spain",
      image: "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=400",
      visited: true,
    },
    {
      id: 4,
      name: "Iceland",
      image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=400",
      visited: false,
    },
  ];

  const tripHistory = [
    {
      id: 1,
      destination: "Bali, Indonesia",
      dates: "Dec 2025",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400",
      budget: "$520",
      rating: 5,
    },
    {
      id: 2,
      destination: "Bangkok, Thailand",
      dates: "Aug 2025",
      image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400",
      budget: "$380",
      rating: 5,
    },
    {
      id: 3,
      destination: "Barcelona, Spain",
      dates: "Jun 2025",
      image: "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=400",
      budget: "$650",
      rating: 4,
    },
  ];

  const badges = [
    {
      name: "Early Adopter",
      icon: Star,
      color: "from-yellow-400 to-orange-500",
      description: "Joined in the first month",
    },
    {
      name: "Globetrotter",
      icon: Globe,
      color: "from-blue-400 to-cyan-500",
      description: "Visited 10+ countries",
    },
    {
      name: "Budget Master",
      icon: Award,
      color: "from-green-400 to-emerald-500",
      description: "Stayed under budget 5 times",
    },
    {
      name: "Social Butterfly",
      icon: Users,
      color: "from-purple-400 to-pink-500",
      description: "Connected with 50+ travelers",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary to-secondary">
        <img
          src={profile.coverImage}
          alt="Cover"
          className="w-full h-full object-cover opacity-40"
        />
        <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {profile.joinedDate}</span>
                      </div>
                    </div>
                    <div className="text-sm mb-2">
                      <span className="font-semibold">{profile.university}</span> • {profile.major}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 bg-primary text-white rounded-full hover:shadow-lg transition-all"
                      >
                        Save Profile
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 border-2 border-border rounded-full hover:border-primary hover:text-primary transition-all flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                    )}
                    <Link
                      to="/chat"
                      className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Message</span>
                    </Link>
                  </div>
                </div>

                {isEditing ? (
                  <textarea
                    defaultValue={profile.bio}
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-muted-foreground mb-4">{profile.bio}</p>
                )}

                {/* Stats */}
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{profile.stats.trips}</div>
                    <div className="text-sm text-muted-foreground">Trips</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{profile.stats.followers}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{profile.stats.following}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Travel Interests */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Travel Interests
              </h3>
              {isEditing ? (
                <div className="space-y-2">
                  {interests.map((interest, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`interest-${index}`}
                        defaultChecked
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                      />
                      <label htmlFor={`interest-${index}`} className="text-sm">
                        {interest}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Achievements
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-muted to-background hover:shadow-lg transition-all"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${badge.color}`} />
                    <badge.icon className={`w-8 h-8 mb-2 bg-gradient-to-br ${badge.color} bg-clip-text text-transparent`} />
                    <h4 className="font-semibold text-xs mb-1">{badge.name}</h4>
                    <p className="text-[10px] text-muted-foreground">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Favorite Destinations */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Favorite Destinations
                </h3>
                {isEditing && (
                  <button className="text-sm text-primary hover:underline">Add More</button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {favoriteDestinations.map((destination) => (
                  <div key={destination.id} className="relative group">
                    <div className="aspect-square rounded-xl overflow-hidden">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h4 className="text-white font-semibold text-sm">{destination.name}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          {destination.visited ? (
                            <span className="text-xs text-green-400 flex items-center gap-1">
                              <Plane className="w-3 h-3" />
                              Visited
                            </span>
                          ) : (
                            <span className="text-xs text-white/80 flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              Wishlist
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trip History */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Plane className="w-5 h-5 text-primary" />
                Trip History
              </h3>
              <div className="space-y-4">
                {tripHistory.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-all"
                  >
                    <img
                      src={trip.image}
                      alt={trip.destination}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{trip.destination}</h4>
                          <p className="text-sm text-muted-foreground">{trip.dates}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary">{trip.budget}</div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: trip.rating }).map((_, i) => (
                              <Star
                                key={i}
                                className="w-3 h-3 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
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
