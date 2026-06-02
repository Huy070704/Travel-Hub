import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
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
  MessageCircle,
  Loader2
} from "lucide-react";
import { getMyProfile, updateMyProfile, getDashboardStats, getPublicProfile } from "@/api/usersApi";
import { getMyItineraries } from "@/api/itinerariesApi";
import { getTrendingDestinations } from "@/api/destinationsApi";
import type { UserProfileDto, DashboardDto, UpdateProfileRequest } from "@/types/users";
import type { ItineraryDto } from "@/types/itineraries";
import type { DestinationDto } from "@/types/destinations";



const getAvatar = (id: number) => {
  const avatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200"
  ];
  return avatars[id % avatars.length];
};

// Helper function for stable random placeholder images
const getPlaceholderImage = (id: number, type: 'dest' | 'trip') => {
  const destImages = [
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400",
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
    "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=400",
    "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=400"
  ];
  const tripImages = [
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400",
    "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400"
  ];
  const source = type === 'dest' ? destImages : tripImages;
  return source[id % source.length];
};

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<UserProfileDto | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardDto | null>(null);
  const [itineraries, setItineraries] = useState<ItineraryDto[]>([]);
  const [trendingDestinations, setTrendingDestinations] = useState<DestinationDto[]>([]);
  const [editForm, setEditForm] = useState<UpdateProfileRequest>({});

  const { userId } = useParams();
  const isMyProfile = !userId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, dashboard, myItineraries, topDests] = await Promise.all([
          isMyProfile ? getMyProfile() : getPublicProfile(Number(userId)) as any,
          isMyProfile ? getDashboardStats() : Promise.resolve(null),
          isMyProfile ? getMyItineraries().catch(() => []) : Promise.resolve([]),
          getTrendingDestinations(4).catch(() => [])
        ]);
        
        setProfileData(profile);
        setDashboardData(dashboard);
        setItineraries(myItineraries);
        setTrendingDestinations(topDests);
        
        setEditForm({
          fullName: profile.fullName || "",
          travelStyle: profile.travelStyle || "",
          favoriteActivities: profile.favoriteActivities || "",
          avatarURL: profile.avatarURL || "",
        });
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateMyProfile(editForm);
      const updatedProfile = await getMyProfile();
      setProfileData(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterestChange = (interest: string, checked: boolean) => {
    const currentInterests = editForm.favoriteActivities 
      ? editForm.favoriteActivities.split(',').map(i => i.trim()) 
      : [];
    
    let newInterests;
    if (checked) {
      newInterests = [...currentInterests, interest];
    } else {
      newInterests = currentInterests.filter(i => i !== interest);
    }
    
    setEditForm({ ...editForm, favoriteActivities: newInterests.join(', ') });
  };

  if (isLoading && !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pb-20">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pb-20">
        <div className="text-xl font-semibold text-muted-foreground">Profile not found or please login again.</div>
      </div>
    );
  }

  // Map API data to UI
  const joinedDate = new Date(profileData.registrationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const avatar = profileData.avatarURL || getAvatar(profileData.userID || 0);
  const name = profileData.fullName || profileData.username;
  const bio = profileData.travelStyle || "Adventure seeker and budget traveler exploring the world one destination at a time.";
  
  const allAvailableInterests = [
    "Beach & Relaxation", "Adventure & Hiking", "Culture & History", 
    "Food & Cuisine", "Photography", "Budget Travel"
  ];
  
  const currentInterests = profileData.favoriteActivities 
    ? profileData.favoriteActivities.split(',').map(i => i.trim()).filter(Boolean)
    : allAvailableInterests.slice(0, 3); // default fallback

  const editingInterests = editForm.favoriteActivities 
    ? editForm.favoriteActivities.split(',').map(i => i.trim()) 
    : [];

  // Actual trips from Itineraries API instead of dashboard stat if possible
  const trips = itineraries.length > 0 ? itineraries.length : (dashboardData?.upcomingTripsCount || 0);
  const pendingRequests = dashboardData?.pendingBuddyRequestsCount || 0;
  const savedDestinations = dashboardData?.savedDestinationsCount || 0;

  const coverImage = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600";
  const university = "TravelHub University";
  const major = profileData.studentCode ? `Student ID: ${profileData.studentCode}` : "Explorer";
  const location = profileData.preferredDestinations || "Global Citizen";

  const badges = [
    { name: "Early Adopter", icon: Star, color: "from-yellow-400 to-orange-500", description: "Joined early" },
    { name: "Globetrotter", icon: Globe, color: "from-blue-400 to-cyan-500", description: "Active traveler" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary to-secondary">
        <img
          src={coverImage}
          alt="Cover"
          className="w-full h-full object-cover opacity-40"
        />
        {isMyProfile && (
          <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all">
            <Settings className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={isEditing && editForm.avatarURL ? editForm.avatarURL : avatar}
                  alt={name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <button 
                    onClick={() => {
                      const url = window.prompt("Paste your new Avatar Image URL:", editForm.avatarURL || "");
                      if (url !== null) {
                        setEditForm({...editForm, avatarURL: url});
                      }
                    }}
                    className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all"
                    title="Change Avatar URL"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div className="flex-1 mr-4">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editForm.fullName || ""} 
                        onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                        className="text-3xl font-bold mb-2 w-full border-b border-primary outline-none bg-transparent"
                        placeholder="Your Full Name"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold mb-2">{name}</h1>
                    )}
                    
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {joinedDate}</span>
                      </div>
                    </div>
                    <div className="text-sm mb-2">
                      <span className="font-semibold">{university}</span> • {major}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0 mt-4 md:mt-0">
                    {isMyProfile && (
                      isEditing ? (
                        <button
                          onClick={handleSave}
                          disabled={isLoading}
                          className="px-6 py-2 bg-primary text-white rounded-full hover:shadow-lg transition-all flex items-center justify-center min-w-[120px]"
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Profile"}
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-6 py-2 border-2 border-border rounded-full hover:border-primary hover:text-primary transition-all flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit Profile</span>
                        </button>
                      )
                    )}
                    {!isMyProfile && (
                      <Link
                        to={`/chat/${userId}`}
                        className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Message</span>
                      </Link>
                    )}
                    {isMyProfile && (
                      <Link
                        to="/chat"
                        className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>My Messages</span>
                      </Link>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <textarea
                    value={editForm.travelStyle || ""}
                    onChange={(e) => setEditForm({...editForm, travelStyle: e.target.value})}
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    rows={3}
                    placeholder="Describe your travel style (Bio)..."
                  />
                ) : (
                  <p className="text-muted-foreground mb-4">{bio}</p>
                )}

                {/* Stats */}
                <div className="flex gap-6 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{trips}</div>
                    <div className="text-sm text-muted-foreground">Trips</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{pendingRequests}</div>
                    <div className="text-sm text-muted-foreground">Buddy Requests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{savedDestinations}</div>
                    <div className="text-sm text-muted-foreground">Saved Places</div>
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
                  {allAvailableInterests.map((interest, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`interest-${index}`}
                        checked={editingInterests.includes(interest)}
                        onChange={(e) => handleInterestChange(interest, e.target.checked)}
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
                  {currentInterests.length > 0 ? currentInterests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  )) : (
                    <span className="text-sm text-muted-foreground italic">No interests added yet.</span>
                  )}
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
            {/* Trending Destinations */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Trending Destinations
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {trendingDestinations.length > 0 ? trendingDestinations.map((destination) => (
                  <div key={destination.destinationID} className="relative group">
                    <div className="aspect-square rounded-xl overflow-hidden">
                      <img
                        src={getPlaceholderImage(destination.destinationID, 'dest')}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h4 className="text-white font-semibold text-sm line-clamp-1">{destination.name}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-white/80 flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            Popular
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full text-center text-muted-foreground py-4">No trending destinations available.</div>
                )}
              </div>
            </div>

            {/* Trip History */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Plane className="w-5 h-5 text-primary" />
                Trip History
              </h3>
              <div className="space-y-4">
                {itineraries.length > 0 ? itineraries.map((trip) => (
                  <div
                    key={trip.itineraryID}
                    className="flex gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-all"
                  >
                    <img
                      src={getPlaceholderImage(trip.itineraryID, 'trip')}
                      alt={trip.tripName}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{trip.tripName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${trip.status === 'Planned' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {trip.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary">
                            {trip.totalBudgetEstimatedVND 
                              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(trip.totalBudgetEstimatedVND)
                              : "N/A"
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Plane className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No trips found. Start planning your next adventure!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
