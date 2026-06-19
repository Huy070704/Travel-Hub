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
  Loader2,
  X,
  FileText
} from "lucide-react";
import { getPosts, createPost, toggleLike, getComments, addComment } from "@/api/feedApi";
import { getBuddyRecommendations, sendBuddyRequest } from "@/api/buddiesApi";
import { getTrendingDestinations } from "@/api/destinationsApi";
import { getMyProfile } from "@/api/usersApi";
import { sendDirectMessage } from "@/api/chatApi";
import type { PostDto, CommentDto } from "@/types/feed";
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

  // Comments state
  const [comments, setComments] = useState<Record<number, CommentDto[]>>({});
  const [showComments, setShowComments] = useState<Record<number, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [isSubmittingComment, setIsSubmittingComment] = useState<Record<number, boolean>>({});

  // Buddy Post state
  const [isBuddyPostMode, setIsBuddyPostMode] = useState(false);
  const [buddyPostData, setBuddyPostData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    peopleNeeded: 1,
    budgetVND: "",
    style: "Khám phá",
    note: ""
  });
  const [isJoining, setIsJoining] = useState<Record<number, boolean>>({});

  // Share state
  const [shareModalPostId, setShareModalPostId] = useState<number | null>(null);
  const [isSharing, setIsSharing] = useState(false);

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

        // Check if there is a postId in the URL to scroll to
        const urlParams = new URLSearchParams(window.location.search);
        const targetPostId = urlParams.get('postId');
        if (targetPostId) {
          setTimeout(() => {
            const element = document.getElementById(`post-${targetPostId}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              // Optional: Highlight the post temporarily
              element.classList.add('ring-4', 'ring-primary/50', 'transition-all', 'duration-1000');
              setTimeout(() => element.classList.remove('ring-4', 'ring-primary/50'), 2000);
            }
          }, 500); // slight delay to allow rendering
        }

      } catch (error) {
        console.error("Failed to load community data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCreatePost = async () => {
    if (isBuddyPostMode) {
      if (!buddyPostData.destination.trim()) return;
      setIsPosting(true);
      try {
        await createPost({
          postType: "BuddyRequest",
          title: `Tìm bạn đồng hành đi ${buddyPostData.destination}`,
          content: JSON.stringify(buddyPostData)
        });
        setBuddyPostData({ destination: "", startDate: "", endDate: "", peopleNeeded: 1, budgetVND: "", style: "Khám phá", note: "" });
        setIsBuddyPostMode(false);
      } catch (error) {
        console.error("Failed to create buddy post", error);
      } finally {
        setIsPosting(false);
      }
    } else {
      if (!newPostContent.trim()) return;
      setIsPosting(true);
      try {
        await createPost({
          postType: "Text",
          title: "Cập nhật cộng đồng",
          content: newPostContent
        });
        setNewPostContent("");
      } catch (error) {
        console.error("Failed to create post", error);
      } finally {
        setIsPosting(false);
      }
    }
    
    // Refresh posts
    const postsData = await getPosts(1, 20);
    setPosts(postsData.items);
  };

  const handleJoinBuddyRequest = async (postId: number, receiverId: number) => {
    if (isJoining[postId]) return;
    setIsJoining(prev => ({ ...prev, [postId]: true }));
    try {
      await sendBuddyRequest({
        receiverID: receiverId,
        postID: postId,
        message: "Mình muốn tham gia chuyến đi này cùng bạn!"
      });
      alert("Đã gửi yêu cầu tham gia! Chờ người đăng xác nhận nhé.");
    } catch (error) {
      console.error("Failed to send buddy request", error);
      alert("Bạn đã gửi yêu cầu rồi hoặc có lỗi xảy ra.");
    } finally {
      setIsJoining(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleLike = async (postId: number) => {
    // Optimistic UI update
    const originalPosts = [...posts];
    setPosts(posts.map(p => {
      if (p.postID === postId) {
        return {
          ...p,
          isLikedByCurrentUser: !p.isLikedByCurrentUser,
          likesCount: p.isLikedByCurrentUser ? Math.max(0, p.likesCount - 1) : p.likesCount + 1
        };
      }
      return p;
    }));

    try {
      const res = await toggleLike(postId);
      // Ensure backend sync
      setPosts(prevPosts => prevPosts.map(p => p.postID === postId ? { ...p, likesCount: res.likesCount } : p));
    } catch (error) {
      console.error("Failed to toggle like", error);
      // Revert optimistic update
      setPosts(originalPosts);
    }
  };

  const handleToggleComments = async (postId: number) => {
    const isShowing = showComments[postId];
    setShowComments(prev => ({ ...prev, [postId]: !isShowing }));

    // Fetch comments if expanding and not loaded yet
    if (!isShowing && !comments[postId]) {
      try {
        const res = await getComments(postId);
        setComments(prev => ({ ...prev, [postId]: res.items }));
      } catch (error) {
        console.error("Failed to load comments", error);
      }
    }
  };

  const handleAddComment = async (postId: number) => {
    const content = commentInputs[postId];
    if (!content?.trim()) return;

    setIsSubmittingComment(prev => ({ ...prev, [postId]: true }));
    try {
      await addComment(postId, { content });
      
      // Refresh comments for this post
      const res = await getComments(postId);
      setComments(prev => ({ ...prev, [postId]: res.items }));
      
      // Clear input
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Failed to add comment", error);
    } finally {
      setIsSubmittingComment(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleShareToBuddy = async (buddyId: number, post: PostDto) => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const shareLink = `${window.location.origin}/community?postId=${post.postID}`;
      const shareContent = `Mời bạn xem bài viết của ${post.username}:\n\n"${post.title}"\n${post.content ? post.content : ''}\n\nXem bài viết: ${shareLink}`;
      await sendDirectMessage(buddyId, shareContent);
      alert("Đã chia sẻ bài viết thành công!");
      setShareModalPostId(null);
    } catch (error) {
      console.error("Failed to share post", error);
      alert("Có lỗi xảy ra khi chia sẻ bài viết.");
    } finally {
      setIsSharing(false);
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
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={userProfile?.avatarURL || getAvatar(userProfile?.userID || 0)}
                  alt="You"
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                />
                <div className="flex-1">
                  {isBuddyPostMode ? (
                    <div className="bg-muted p-4 rounded-xl border border-border space-y-4">
                      <div className="font-bold text-lg mb-2">Tìm bạn đồng hành</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Điểm đến</label>
                          <input type="text" value={buddyPostData.destination} onChange={e => setBuddyPostData({...buddyPostData, destination: e.target.value})} placeholder="Vd: Đà Lạt" className="w-full px-3 py-2 bg-background text-foreground rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Phong cách</label>
                          <select value={buddyPostData.style} onChange={e => setBuddyPostData({...buddyPostData, style: e.target.value})} className="w-full px-3 py-2 bg-background text-foreground rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none">
                            <option>Khám phá</option>
                            <option>Tiết kiệm (Budget)</option>
                            <option>Nghỉ dưỡng (Resort)</option>
                            <option>Phượt (Backpacking)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Ngày đi</label>
                          <input type="date" value={buddyPostData.startDate} onChange={e => setBuddyPostData({...buddyPostData, startDate: e.target.value})} className="w-full px-3 py-2 bg-background text-foreground rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Ngày về</label>
                          <input type="date" value={buddyPostData.endDate} onChange={e => setBuddyPostData({...buddyPostData, endDate: e.target.value})} className="w-full px-3 py-2 bg-background text-foreground rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Số người cần tìm</label>
                          <input type="number" min="1" value={buddyPostData.peopleNeeded} onChange={e => setBuddyPostData({...buddyPostData, peopleNeeded: parseInt(e.target.value) || 1})} className="w-full px-3 py-2 bg-background text-foreground rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Ngân sách dự kiến (VND)</label>
                          <input type="text" value={buddyPostData.budgetVND} onChange={e => setBuddyPostData({...buddyPostData, budgetVND: e.target.value})} placeholder="Vd: 3.000.000" className="w-full px-3 py-2 bg-background text-foreground rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Ghi chú thêm</label>
                        <textarea value={buddyPostData.note} onChange={e => setBuddyPostData({...buddyPostData, note: e.target.value})} placeholder="Chia sẻ thêm về kế hoạch của bạn..." rows={2} className="w-full px-3 py-2 bg-background text-foreground rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none resize-none"></textarea>
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => setIsBuddyPostMode(false)} className="px-4 py-2 bg-white border border-border rounded-lg text-sm font-semibold hover:bg-muted transition-all">Hủy</button>
                        <button onClick={handleCreatePost} disabled={isPosting || !buddyPostData.destination.trim()} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center gap-2">
                          {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Đăng bài
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreatePost()}
                        placeholder="Chia sẻ kế hoạch du lịch hoặc trải nghiệm của bạn..."
                        className="flex-1 px-4 py-3 bg-background text-foreground rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
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
                  )}
                </div>
              </div>
              {!isBuddyPostMode && (
                <div className="flex items-center gap-2 sm:ml-16">
                  <button className="flex-1 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">Bài đăng của Hướng dẫn viên</span>
                  </button>
                  <button onClick={() => setIsBuddyPostMode(true)} className="flex-1 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all flex items-center justify-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">Tìm bạn đồng hành</span>
                  </button>
                </div>
              )}
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
              <div id={`post-${post.postID}`} key={post.postID} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Post Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Link to={`/profile/${post.userID}`}>
                        <img
                          src={post.avatarURL || getAvatar(post.userID)}
                          alt={post.username}
                          className="w-12 h-12 rounded-full object-cover border border-border"
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
                  {post.postType === "BuddyRequest" ? (
                    <div className="mb-4">
                      <h3 className="font-bold mb-3 text-lg text-primary">{post.title}</h3>
                      {(() => {
                        try {
                          const buddyData = JSON.parse(post.content || "{}");
                          return (
                            <div className="bg-primary/5 rounded-xl border border-primary/20 overflow-hidden">
                              <div className="grid grid-cols-2 gap-px bg-primary/10">
                                <div className="bg-white/80 p-3 flex flex-col gap-1">
                                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> Điểm đến</span>
                                  <span className="font-semibold text-sm">{buddyData.destination || "Đang cập nhật"}</span>
                                </div>
                                <div className="bg-white/80 p-3 flex flex-col gap-1">
                                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> Thời gian</span>
                                  <span className="font-semibold text-sm">{buddyData.startDate ? new Date(buddyData.startDate).toLocaleDateString('vi-VN') : "?"} - {buddyData.endDate ? new Date(buddyData.endDate).toLocaleDateString('vi-VN') : "?"}</span>
                                </div>
                                <div className="bg-white/80 p-3 flex flex-col gap-1">
                                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" /> Cần tìm</span>
                                  <span className="font-semibold text-sm">{buddyData.peopleNeeded} người</span>
                                </div>
                                <div className="bg-white/80 p-3 flex flex-col gap-1">
                                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1"><DollarSign className="w-3 h-3" /> Ngân sách / Phong cách</span>
                                  <span className="font-semibold text-sm">{buddyData.budgetVND} VND • {buddyData.style}</span>
                                </div>
                              </div>
                              {buddyData.note && (
                                <div className="p-3 text-sm bg-white/80 border-t border-primary/10">
                                  <span className="font-semibold text-xs text-muted-foreground block mb-1">Ghi chú:</span>
                                  {buddyData.note}
                                </div>
                              )}
                              {post.userID !== userProfile?.userID && (
                                <div className="p-3 bg-white border-t border-primary/10 flex gap-2">
                                  <button 
                                    onClick={() => handleJoinBuddyRequest(post.postID, post.userID)}
                                    disabled={isJoining[post.postID]}
                                    className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                  >
                                    {isJoining[post.postID] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />} Xin tham gia
                                  </button>
                                  <Link
                                    to={`/chat/${post.userID}`}
                                    className="flex-1 py-2 bg-secondary text-white rounded-lg text-sm font-semibold hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
                                  >
                                    <Send className="w-4 h-4" /> Nhắn tin
                                  </Link>
                                </div>
                              )}
                            </div>
                          );
                        } catch {
                          return <p className="text-foreground mb-4 whitespace-pre-wrap">{post.content}</p>;
                        }
                      })()}
                    </div>
                  ) : (
                    <>
                      <h3 className="font-bold mb-1">{post.title}</h3>
                      <p className="text-foreground mb-4 whitespace-pre-wrap">{post.content}</p>
                    </>
                  )}
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
                        <Heart className={`w-5 h-5 ${post.isLikedByCurrentUser ? "fill-red-500 text-red-500" : ""}`} />
                        <span className="text-sm font-semibold">{post.likesCount}</span>
                      </button>
                      <button 
                        onClick={() => handleToggleComments(post.postID)}
                        className={`flex items-center gap-2 transition-all ${showComments[post.postID] ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                      >
                        <MessageCircle className={`w-5 h-5 ${showComments[post.postID] ? "fill-primary/20" : ""}`} />
                        <span className="text-sm font-semibold">Bình luận</span>
                      </button>
                      <button 
                        onClick={() => setShareModalPostId(post.postID)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all"
                      >
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm font-semibold hidden sm:inline">Chia sẻ</span>
                      </button>
                    </div>
                    {/* Add connect button if not BuddyRequest (which already has it inside the card) */}
                    {post.postType !== "BuddyRequest" && (
                      <Link
                        to={`/chat/${post.userID}`}
                        className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:shadow-lg transition-all flex items-center gap-2 text-sm font-semibold"
                      >
                        <Send className="w-4 h-4" />
                        <span className="hidden sm:inline">Nhắn tin</span>
                      </Link>
                    )}
                  </div>

                  {/* Comments Section */}
                  {showComments[post.postID] && (
                    <div className="mt-4 pt-4 border-t border-border/50 animate-in fade-in slide-in-from-top-2">
                      {/* Comments List */}
                      <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto pr-2">
                        {comments[post.postID]?.length > 0 ? (
                          comments[post.postID].map(comment => (
                            <div key={comment.commentID} className="flex gap-3">
                              <Link to={`/profile/${comment.userID}`}>
                                <img
                                  src={comment.avatarURL || getAvatar(comment.userID)}
                                  alt={comment.username}
                                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-border"
                                />
                              </Link>
                              <div className="bg-muted p-3 rounded-2xl rounded-tl-none flex-1">
                                <div className="flex items-baseline justify-between mb-1">
                                  <Link to={`/profile/${comment.userID}`} className="font-semibold text-sm hover:text-primary">
                                    {comment.username}
                                  </Link>
                                  <span className="text-[10px] text-muted-foreground">
                                    {new Date(comment.commentDate).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                                  </span>
                                </div>
                                <p className="text-sm text-foreground">{comment.content}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-center text-muted-foreground py-4">Chưa có bình luận nào.</div>
                        )}
                      </div>

                      {/* Comment Input */}
                      <div className="flex items-center gap-3">
                        <img
                          src={userProfile?.avatarURL || getAvatar(0)}
                          alt="You"
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <input
                          type="text"
                          value={commentInputs[post.postID] || ""}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.postID]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.postID)}
                          placeholder="Thêm bình luận..."
                          className="flex-1 px-4 py-2 bg-background text-foreground rounded-full border border-border focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                          disabled={isSubmittingComment[post.postID]}
                        />
                        <button 
                          onClick={() => handleAddComment(post.postID)}
                          disabled={isSubmittingComment[post.postID] || !(commentInputs[post.postID]?.trim())}
                          className="p-2 text-primary hover:bg-primary/10 rounded-full disabled:opacity-50 transition-all"
                        >
                          {isSubmittingComment[post.postID] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}
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
          <div className="lg:col-span-1 space-y-6 sticky top-20 self-start h-fit">
            {/* Trending Destinations */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
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

      {/* Share Modal */}
      {shareModalPostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h2 className="font-bold text-lg">Chia sẻ đến bạn bè</h2>
              <button 
                onClick={() => setShareModalPostId(null)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {buddies.length > 0 ? (
                <div className="space-y-3">
                  {buddies.map(buddy => (
                    <div key={buddy.userID} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <img
                          src={buddy.avatarURL || getAvatar(buddy.userID)}
                          alt={buddy.username}
                          className="w-10 h-10 rounded-full object-cover border border-border"
                        />
                        <span className="font-semibold">{buddy.username}</span>
                      </div>
                      <button
                        onClick={() => {
                          const post = posts.find(p => p.postID === shareModalPostId);
                          if (post) handleShareToBuddy(buddy.userID, post);
                        }}
                        disabled={isSharing}
                        className="px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full text-sm font-semibold transition-all disabled:opacity-50"
                      >
                        Gửi
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Chưa có bạn bè nào để chia sẻ. Hãy kết nối thêm!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
