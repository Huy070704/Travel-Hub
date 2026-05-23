import { Link } from "react-router";
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Send,
  Filter,
  TrendingUp,
  Plane
} from "lucide-react";

export function CommunityFeedPage() {
  const posts = [
    {
      id: 1,
      user: {
        id: 1,
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
        university: "UC Berkeley",
      },
      destination: "Tokyo, Japan",
      dates: "Jun 15-22, 2026",
      budget: "$800-1000",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
      caption:
        "Looking for 2 travel buddies to split accommodation costs in Tokyo! Planning to explore Shibuya, visit TeamLab, and try all the ramen spots 🍜",
      tags: ["Culture", "Food", "Photography"],
      likes: 48,
      comments: 12,
      posted: "2 hours ago",
      lookingForBuddies: true,
      spotsLeft: 2,
    },
    {
      id: 2,
      user: {
        id: 2,
        name: "Marcus Johnson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
        university: "NYU",
      },
      destination: "Barcelona, Spain",
      dates: "Jul 1-8, 2026",
      budget: "$600-800",
      image: "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=800",
      caption:
        "Just finished an amazing week in Barcelona! Here's my budget breakdown and tips. DM if you need recommendations! The beaches were incredible 🏖️",
      tags: ["Beach", "Architecture", "Nightlife"],
      likes: 127,
      comments: 24,
      posted: "1 day ago",
      lookingForBuddies: false,
    },
    {
      id: 3,
      user: {
        id: 3,
        name: "Emma Rodriguez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
        university: "MIT",
      },
      destination: "Bali, Indonesia",
      dates: "Aug 10-20, 2026",
      budget: "$500-700",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
      caption:
        "Planning a digital nomad trip to Bali! Working remote while exploring. Looking for others who might want to join for coworking sessions ☕💻",
      tags: ["Beach", "Digital Nomad", "Wellness"],
      likes: 89,
      comments: 18,
      posted: "3 days ago",
      lookingForBuddies: true,
      spotsLeft: 3,
    },
    {
      id: 4,
      user: {
        id: 4,
        name: "Alex Kim",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
        university: "Stanford",
      },
      destination: "Iceland",
      dates: "Sep 5-12, 2026",
      budget: "$1200-1500",
      image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800",
      caption:
        "Road trip around Iceland's Ring Road! Splitting car rental costs. Experience level: beginner adventurers welcome! 🚗❄️",
      tags: ["Adventure", "Nature", "Photography"],
      likes: 156,
      comments: 31,
      posted: "5 days ago",
      lookingForBuddies: true,
      spotsLeft: 1,
    },
  ];

  const trendingDestinations = [
    { name: "Bali", posts: 234, trending: true },
    { name: "Tokyo", posts: 189, trending: true },
    { name: "Barcelona", posts: 167, trending: false },
    { name: "Thailand", posts: 143, trending: true },
    { name: "Portugal", posts: 128, trending: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Travel Community</h1>
          </div>
          <p className="text-white/90 max-w-2xl">
            Connect with fellow student travelers, find travel buddies, and share your adventures
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"
                  alt="You"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <input
                  type="text"
                  placeholder="Share your travel plans or experiences..."
                  className="flex-1 px-4 py-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="flex-1 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Add Destination</span>
                </button>
                <button className="flex-1 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Find Buddies</span>
                </button>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <button className="px-4 py-2 bg-primary text-white rounded-full whitespace-nowrap flex items-center gap-2 shadow-lg">
                <Filter className="w-4 h-4" />
                <span>All Posts</span>
              </button>
              <button className="px-4 py-2 bg-white text-foreground rounded-full whitespace-nowrap hover:bg-muted transition-all">
                Looking for Buddies
              </button>
              <button className="px-4 py-2 bg-white text-foreground rounded-full whitespace-nowrap hover:bg-muted transition-all">
                Trip Reports
              </button>
              <button className="px-4 py-2 bg-white text-foreground rounded-full whitespace-nowrap hover:bg-muted transition-all">
                Budget Tips
              </button>
            </div>

            {/* Posts */}
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Post Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Link to={`/profile/${post.user.id}`}>
                        <img
                          src={post.user.avatar}
                          alt={post.user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </Link>
                      <div>
                        <Link to={`/profile/${post.user.id}`} className="font-semibold hover:text-primary">
                          {post.user.name}
                        </Link>
                        <div className="text-sm text-muted-foreground">{post.user.university}</div>
                        <div className="text-xs text-muted-foreground">{post.posted}</div>
                      </div>
                    </div>
                    {post.lookingForBuddies && (
                      <div className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{post.spotsLeft} spots left</span>
                      </div>
                    )}
                  </div>

                  {/* Trip Info */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      <MapPin className="w-3 h-3" />
                      <span>{post.destination}</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm">
                      <Calendar className="w-3 h-3" />
                      <span>{post.dates}</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm">
                      <DollarSign className="w-3 h-3" />
                      <span>{post.budget}</span>
                    </div>
                  </div>

                  {/* Caption */}
                  <p className="text-foreground mb-3">{post.caption}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="text-xs text-primary">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Post Image */}
                <div className="relative aspect-[4/3]">
                  <img
                    src={post.image}
                    alt={post.destination}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Post Actions */}
                <div className="p-6 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-all">
                        <Heart className="w-5 h-5" />
                        <span className="text-sm font-semibold">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-semibold">{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                    {post.lookingForBuddies && (
                      <Link
                        to={`/chat/${post.user.id}`}
                        className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>Message</span>
                      </Link>
                    )}
                  </div>

                  {/* Comment Input */}
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"
                      alt="You"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-2 bg-muted rounded-full border border-border focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trending Destinations */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Trending Destinations</h3>
              </div>
              <div className="space-y-3">
                {trendingDestinations.map((dest, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl hover:bg-muted transition-all">
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {dest.name}
                        {dest.trending && (
                          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{dest.posts} posts</div>
                    </div>
                    <Plane className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Users */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold mb-4">Suggested Travel Buddies</h3>
              <div className="space-y-4">
                {[
                  {
                    id: 5,
                    name: "Jessica Park",
                    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
                    university: "UCLA",
                    commonInterests: 3,
                  },
                  {
                    id: 6,
                    name: "David Miller",
                    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
                    university: "Harvard",
                    commonInterests: 5,
                  },
                  {
                    id: 7,
                    name: "Sophie Taylor",
                    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
                    university: "Yale",
                    commonInterests: 4,
                  },
                ].map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <Link to={`/profile/${user.id}`}>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link to={`/profile/${user.id}`} className="font-semibold text-sm hover:text-primary">
                        {user.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">{user.university}</div>
                    </div>
                    <button className="px-4 py-1.5 bg-primary text-white rounded-full text-xs hover:shadow-lg transition-all">
                      Follow
                    </button>
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
