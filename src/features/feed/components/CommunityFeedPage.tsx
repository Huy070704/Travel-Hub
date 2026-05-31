import { useState, useEffect } from "react";
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
  Plane,
  Loader2
} from "lucide-react";
import { getPosts, createPost, toggleLike } from "@/api/feedApi";
import { getBuddyRecommendations } from "@/api/buddiesApi";
import { getTrendingDestinations } from "@/api/destinationsApi";
import { getMyProfile } from "@/api/usersApi";
import type { PostDto } from "@/types/feed";
import type { BuddyRecommendationDto } from "@/types/buddies";
import type { DestinationDto } from "@/types/destinations";
import type { UserProfileDto } from "@/types/users";

const getPostImage = (id: number) => {
  const images = [
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
    "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=800",
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800"
  ];
  return images[id % images.length];
};

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

export function CommunityFeedPage() {
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [buddies, setBuddies] = useState<BuddyRecommendationDto[]>([]);
  const [trendingDestinations, setTrendingDestinations] = useState<DestinationDto[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfileDto | null>(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profile, postsData, buddiesData, trendingDests] = await Promise.all([
          getMyProfile().catch(() => null),
          getPosts(1, 20).catch(() => ({ items: [] as PostDto[], totalCount: 0, page: 1, pageSize: 20, totalPages: 0 })),
          getBuddyRecommendations().catch(() => []),
          getTrendingDestinations(5).catch(() => [])
        ]);
        setUserProfile(profile);
        setPosts(postsData.items);
        setBuddies(buddiesData);
        setTrendingDestinations(trendingDests);
      } catch (error) {
        console.error("Failed to load community data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    setIsPosting(true);
    try {
      await createPost({
        postType: "Text",
        title: "Cập nhật cộng đồng",
        content: newPostContent
      });
      setNewPostContent("");
      // Refresh posts
      const postsData = await getPosts(1, 20);
      setPosts(postsData.items);
    } catch (error) {
      console.error("Failed to create post", error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const res = await toggleLike(postId);
      setPosts(posts.map(p => p.postID === postId ? { ...p, likesCount: res.likesCount } : p));
    } catch (error) {
      console.error("Failed to toggle like", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Cộng đồng du lịch</h1>
          </div>
          <p className="text-white/90 max-w-2xl">
            Kết nối với các bạn sinh viên cùng đam mê xê dịch, tìm bạn đồng hành và chia sẻ những cuộc phiêu lưu của bạn
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
                  src={userProfile?.avatarURL || getAvatar(0)}
                  alt="You"
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                />
                <input
                  type="text"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreatePost()}
                  placeholder="Chia sẻ kế hoạch du lịch hoặc trải nghiệm của bạn..."
                  className="flex-1 px-4 py-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                  disabled={isPosting}
                />
                <button 
                  onClick={handleCreatePost}
                  disabled={isPosting || !newPostContent.trim()}
                  className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all"
                >
                  {isPosting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex-1 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">Thêm điểm đến</span>
                </button>
                <button className="flex-1 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">Tìm bạn đồng hành</span>
                </button>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <button className="px-4 py-2 bg-primary text-white rounded-full whitespace-nowrap flex items-center gap-2 shadow-lg">
                <Filter className="w-4 h-4" />
                <span>Tất cả bài viết</span>
              </button>
              <button className="px-4 py-2 bg-white text-foreground rounded-full whitespace-nowrap hover:bg-muted transition-all">
                Đang tìm bạn đồng hành
              </button>
              <button className="px-4 py-2 bg-white text-foreground rounded-full whitespace-nowrap hover:bg-muted transition-all">
                Review chuyến đi
              </button>
            </div>

            {/* Posts */}
            {posts.length > 0 ? posts.map((post) => (
              <div key={post.postID} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Post Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Link to={`/profile/${post.userID}`}>
                        <img
                          src={getAvatar(post.userID)}
                          alt={post.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </Link>
                      <div>
                        <Link to={`/profile/${post.userID}`} className="font-semibold hover:text-primary text-lg">
                          {post.username}
                        </Link>
                        <div className="text-xs text-muted-foreground">{new Date(post.creationDate).toLocaleString('vi-VN')}</div>
                      </div>
                    </div>
                  </div>

                  {/* Caption */}
                  <h3 className="font-bold mb-1">{post.title}</h3>
                  <p className="text-foreground mb-4 whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Optional Post Image (simulated for realism) */}
                {(post.postID % 2 === 0) && (
                  <div className="relative aspect-[4/3]">
                    <img
                      src={getPostImage(post.postID)}
                      alt="Post"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className="p-6 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => handleLike(post.postID)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-all"
                      >
                        <Heart className={`w-5 h-5 ${post.likesCount > 0 ? "fill-red-500 text-red-500" : ""}`} />
                        <span className="text-sm font-semibold">{post.likesCount}</span>
                      </button>
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-semibold">Bình luận</span>
                      </button>
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                    {/* Add connect button if we had lookingForBuddies flag */}
                    <Link
                      to={`/chat/${post.userID}`}
                      className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:shadow-lg transition-all flex items-center gap-2 text-sm font-semibold"
                    >
                      <Send className="w-4 h-4" />
                      <span>Nhắn tin</span>
                    </Link>
                  </div>

                  {/* Comment Input */}
                  <div className="flex items-center gap-3">
                    <img
                      src={userProfile?.avatarURL || getAvatar(0)}
                      alt="You"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <input
                      type="text"
                      placeholder="Thêm bình luận..."
                      className="flex-1 px-4 py-2 bg-muted rounded-full border border-border focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
            )) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ hành trình của bạn!</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trending Destinations */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Địa điểm nổi bật</h3>
              </div>
              <div className="space-y-3">
                {trendingDestinations.length > 0 ? trendingDestinations.map((dest) => (
                  <Link key={dest.destinationID} to={`/destination/${dest.destinationID}`}>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl hover:bg-muted transition-all cursor-pointer">
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {dest.name}
                          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{dest.cityProvince}</div>
                      </div>
                      <Plane className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Link>
                )) : (
                  <div className="text-sm text-muted-foreground">Chưa có địa điểm nổi bật.</div>
                )}
              </div>
            </div>

            {/* Suggested Users */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Gợi ý bạn đồng hành
              </h3>
              <div className="space-y-4">
                {buddies.length > 0 ? buddies.map((buddy) => (
                  <div key={buddy.userID} className="flex items-center gap-3">
                    <Link to={`/profile/${buddy.userID}`}>
                      <img
                        src={buddy.avatarURL || getAvatar(buddy.userID)}
                        alt={buddy.username}
                        className="w-10 h-10 rounded-full object-cover border border-border"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link to={`/profile/${buddy.userID}`} className="font-semibold text-sm hover:text-primary">
                        {buddy.username}
                      </Link>
                      <div className="text-xs text-muted-foreground">{buddy.matchScore}% Phù hợp</div>
                    </div>
                    <Link 
                      to={`/chat/${buddy.userID}`}
                      className="px-4 py-1.5 bg-primary text-white rounded-full text-xs hover:shadow-lg transition-all font-semibold"
                    >
                      Kết nối
                    </Link>
                  </div>
                )) : (
                  <div className="text-sm text-muted-foreground">Chưa tìm thấy gợi ý nào. Cập nhật hồ sơ của bạn để nhận gợi ý!</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
