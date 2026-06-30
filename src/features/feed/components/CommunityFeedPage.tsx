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
  FileText,
  Trash2,
  Flag,
  Lock
} from "lucide-react";
import { toast } from "sonner";
import { getPosts, createPost, deletePost, toggleLike, getComments, addComment, deleteComment, reportPost } from "@/api/feedApi";
import { todayISO, isTodayOrFuture, isAfter } from "@/utils/dateValidation";
import { getBuddyRecommendations, sendBuddyRequest } from "@/api/buddiesApi";
import { getTrendingDestinations } from "@/api/destinationsApi";
import { getMyProfile } from "@/api/usersApi";
import { sendDirectMessage } from "@/api/chatApi";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router";
import type { PostDto, CommentDto } from "@/types/feed";
import type { BuddyRecommendationDto } from "@/types/buddies";
import type { DestinationDto } from "@/types/destinations";
import type { UserProfileDto } from "@/types/users";
import defaultAvatar from "@/assets/default-avatar.png";
import bienImg from "@/assets/bien.jpg";
import thanhphoImg from "@/assets/thanhpho.jpg";
import vanhoaImg from "@/assets/vanhoa.jpg";
import nuiImg from "@/assets/nui.jpg";

const AVAILABLE_IMAGES = [
  { id: "bien.jpg", name: "Biển", src: bienImg },
  { id: "thanhpho.jpg", name: "Thành phố", src: thanhphoImg },
  { id: "vanhoa.jpg", name: "Văn hóa", src: vanhoaImg },
  { id: "nui.jpg", name: "Núi", src: nuiImg }
];

const imageMap: Record<string, string> = {
  "bien.jpg": bienImg,
  "thanhpho.jpg": thanhphoImg,
  "vanhoa.jpg": vanhoaImg,
  "nui.jpg": nuiImg
};

interface ParsedContent {
  text: string;
  selectedImage?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  peopleNeeded?: number;
  budgetVND?: string;
  style?: string;
  note?: string;
}

const parsePostContent = (post: PostDto): ParsedContent => {
  if (!post.content) return { text: "" };
  const trimmed = post.content.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (post.postType === "BuddyRequest") {
        return {
          text: `Tìm bạn đồng hành đi ${parsed.destination || ""}`,
          selectedImage: parsed.selectedImage,
          ...parsed
        };
      }
      return {
        text: parsed.text !== undefined ? parsed.text : post.content,
        selectedImage: parsed.selectedImage
      };
    } catch (e) {
      // Fallback
    }
  }
  return { text: post.content };
};

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
  return defaultAvatar;
};

export function CommunityFeedPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [buddies, setBuddies] = useState<BuddyRecommendationDto[]>([]);
  const [trendingDestinations, setTrendingDestinations] = useState<DestinationDto[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfileDto | null>(null);
  const location = useLocation();
  const initialPostContent = (location.state as any)?.initialPostContent || "";

  const [newPostContent, setNewPostContent] = useState(initialPostContent);
  const [selectedTextPostImage, setSelectedTextPostImage] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
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
    note: "",
    selectedImage: ""
  });
  const [isJoining, setIsJoining] = useState<Record<number, boolean>>({});
  const [isDeleting, setIsDeleting] = useState<Record<number, boolean>>({});

  const renderImagePicker = (selectedId: string, onSelect: (id: string) => void) => {
    return (
      <div className="border-t border-border/60 pt-4 mt-2">
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Chọn một ảnh cho bài viết (Không bắt buộc)
        </label>
        <div className="grid grid-cols-4 gap-3">
          {AVAILABLE_IMAGES.map((img) => {
            const isSelected = selectedId === img.id;
            return (
              <button
                key={img.id}
                type="button"
                onClick={() => onSelect(isSelected ? "" : img.id)}
                className={`relative aspect-[4/3] rounded-xl overflow-hidden group transition-all duration-300 ${isSelected
                    ? "ring-4 ring-primary ring-offset-2 scale-95 shadow-lg"
                    : "hover:scale-105 hover:shadow-md border border-border"
                  }`}
              >
                <img
                  src={img.src}
                  alt={img.name}
                  className="w-full h-full object-cover group-hover:brightness-95 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center p-1.5">
                  <span className="text-[10px] md:text-xs font-semibold text-white truncate max-w-full drop-shadow-md">
                    {img.name}
                  </span>
                </div>
                {isSelected && (
                  <div className="absolute top-1 right-1 bg-primary text-white p-1 rounded-full shadow-md animate-scale-in">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Share state
  const [shareModalPostId, setShareModalPostId] = useState<number | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  // Report state
  const [reportModalPostId, setReportModalPostId] = useState<number | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [isReporting, setIsReporting] = useState(false);

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
    if (!user?.isPremium) {
      navigate("/premium");
      return;
    }

    let created = false;

    if (isBuddyPostMode) {
      if (!buddyPostData.destination.trim()) return;
      // Only allow trips planned for the future.
      if (buddyPostData.startDate && !isTodayOrFuture(buddyPostData.startDate)) {
        toast.error("Ngày đi phải là ngày trong tương lai. Vui lòng chọn lại!");
        return;
      }
      if (buddyPostData.endDate && buddyPostData.startDate && !isAfter(buddyPostData.endDate, buddyPostData.startDate)) {
        toast.error("Ngày về phải sau ngày đi. Vui lòng chọn lại!");
        return;
      }
      if (buddyPostData.endDate && !buddyPostData.startDate && !isTodayOrFuture(buddyPostData.endDate)) {
        toast.error("Ngày về phải là ngày trong tương lai. Vui lòng chọn lại!");
        return;
      }
      setIsPosting(true);
      try {
        await createPost({
          postType: "BuddyRequest",
          title: `Tìm bạn đồng hành đi ${buddyPostData.destination}`,
          content: JSON.stringify(buddyPostData)
        });
        setBuddyPostData({ destination: "", startDate: "", endDate: "", peopleNeeded: 1, budgetVND: "", style: "Khám phá", note: "", selectedImage: "" });
        setIsBuddyPostMode(false);
        created = true;
        toast.success("Đăng bài tìm bạn đồng hành thành công!");
      } catch (error) {
        console.error("Failed to create buddy post", error);
        toast.error("Có lỗi xảy ra khi đăng bài. Vui lòng thử lại.");
      } finally {
        setIsPosting(false);
      }
    } else {
      if (!newPostContent.trim()) return;
      setIsPosting(true);
      try {
        const payloadContent = selectedTextPostImage
          ? JSON.stringify({ text: newPostContent, selectedImage: selectedTextPostImage })
          : newPostContent;

        await createPost({
          postType: "Text",
          title: "Cập nhật cộng đồng",
          content: payloadContent
        });
        setNewPostContent("");
        setSelectedTextPostImage("");
        setIsExpanded(false);
        created = true;
        toast.success("Đăng bài viết thành công!");
      } catch (error) {
        console.error("Failed to create post", error);
        toast.error("Có lỗi xảy ra khi đăng bài. Vui lòng thử lại.");
      } finally {
        setIsPosting(false);
      }
    }

    // Refresh posts only when a post was actually created
    if (created) {
      try {
        const postsData = await getPosts(1, 20);
        setPosts(postsData.items);
      } catch (error) {
        console.error("Failed to refresh posts", error);
      }
    }
  };

  const performDeletePost = async (postId: number) => {
    if (isDeleting[postId]) return;

    setIsDeleting(prev => ({ ...prev, [postId]: true }));

    // Optimistic removal so the post disappears immediately.
    const originalPosts = [...posts];
    setPosts(prev => prev.filter(p => p.postID !== postId));

    try {
      await deletePost(postId);
      toast.success("Xóa bài viết thành công!");
    } catch (error: any) {
      console.error("Failed to delete post", error);
      const status = error?.response?.status;
      const serverMsg = error?.response?.data?.message || error?.response?.data;
      let msg = "Không thể xóa bài viết. Vui lòng thử lại.";
      if (status === 401) {
        msg = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
      } else if (status === 403) {
        msg = "Bạn chỉ có thể xóa bài viết của chính mình.";
      } else if (status === 404 || status === 405) {
        msg = "Máy chủ chưa hỗ trợ xóa bài viết. Vui lòng khởi động lại backend.";
      } else if (typeof serverMsg === "string" && serverMsg.trim()) {
        msg = `Không thể xóa bài viết: ${serverMsg}`;
      }
      toast.error(msg);
      // Revert on failure
      setPosts(originalPosts);
    } finally {
      setIsDeleting(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleDeletePost = (postId: number) => {
    if (isDeleting[postId]) return;
    toast.custom((t) => (
      <div className="bg-white border border-border shadow-2xl rounded-2xl p-5 w-full flex flex-col gap-4 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1 pt-0.5">
            <h3 className="font-bold text-foreground text-base">Xóa bài viết này?</h3>
            <p className="text-sm text-muted-foreground mt-1">Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa chứ?</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-2">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-4 py-2 bg-muted text-foreground rounded-xl text-sm font-semibold hover:bg-muted/80 transition-all"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              toast.dismiss(t);
              performDeletePost(postId);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-all shadow-md shadow-red-500/20"
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    ));
  };

  const handleJoinBuddyRequest = async (postId: number, receiverId: number) => {
    if (!user?.isPremium) {
      navigate("/premium");
      return;
    }
    if (isJoining[postId]) return;
    setIsJoining(prev => ({ ...prev, [postId]: true }));
    try {
      await sendBuddyRequest({
        receiverID: receiverId,
        postID: postId,
        message: "Mình muốn tham gia chuyến đi này cùng bạn!"
      });
      toast.success("Đã gửi yêu cầu tham gia! Chờ người đăng xác nhận nhé.");
    } catch (error) {
      console.error("Failed to send buddy request", error);
      toast.error("Bạn đã gửi yêu cầu rồi hoặc có lỗi xảy ra.");
    } finally {
      setIsJoining(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleLike = async (postId: number) => {
    if (!user?.isPremium) {
      navigate("/premium");
      return;
    }
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
        setPosts(prevPosts => prevPosts.map(p => p.postID === postId ? { ...p, commentsCount: res.totalCount } : p));
      } catch (error) {
        console.error("Failed to load comments", error);
      }
    }
  };

  const handleAddComment = async (postId: number) => {
    if (!user?.isPremium) {
      navigate("/premium");
      return;
    }
    const content = commentInputs[postId];
    if (!content?.trim()) return;

    setIsSubmittingComment(prev => ({ ...prev, [postId]: true }));
    try {
      await addComment(postId, { content });

      // Refresh comments for this post
      const res = await getComments(postId);
      setComments(prev => ({ ...prev, [postId]: res.items }));
      setPosts(prevPosts => prevPosts.map(p => p.postID === postId ? { ...p, commentsCount: res.totalCount } : p));

      // Clear input
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Failed to add comment", error);
    } finally {
      setIsSubmittingComment(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleDeleteComment = async (postId: number, commentId: number) => {
    try {
      await deleteComment(commentId);
      toast.success("Xóa bình luận thành công!");

      // Refresh comments for this post
      const res = await getComments(postId);
      setComments(prev => ({ ...prev, [postId]: res.items }));
      setPosts(prevPosts => prevPosts.map(p => p.postID === postId ? { ...p, commentsCount: res.totalCount } : p));
    } catch (error) {
      console.error("Failed to delete comment", error);
      toast.error("Có lỗi xảy ra khi xóa bình luận.");
    }
  };

  const handleShareToBuddy = async (buddyId: number, post: PostDto) => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const shareLink = `${window.location.origin}/community?postId=${post.postID}`;
      const shareContent = `Mời bạn xem bài viết của ${post.username}:\n\n"${post.title}"\n${post.content ? post.content : ''}\n\nXem bài viết: ${shareLink}`;
      await sendDirectMessage(buddyId, shareContent);
      toast.success("Đã chia sẻ bài viết thành công!");
      setShareModalPostId(null);
    } catch (error) {
      console.error("Failed to share post", error);
      toast.error("Có lỗi xảy ra khi chia sẻ bài viết.");
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
                          <input type="text" value={buddyPostData.destination} onChange={e => setBuddyPostData({ ...buddyPostData, destination: e.target.value })} placeholder="Vd: Đà Lạt" className="w-full px-3 py-2 bg-background text-foreground rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Phong cách</label>
                          <select value={buddyPostData.style} onChange={e => setBuddyPostData({ ...buddyPostData, style: e.target.value })} className="w-full px-3 py-2 bg-background text-foreground rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none">
                            <option>Khám phá</option>
                            <option>Tiết kiệm (Budget)</option>
                            <option>Nghỉ dưỡng (Resort)</option>
                            <option>Phượt (Backpacking)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Ngày đi</label>
                          <input type="date" value={buddyPostData.startDate} min={todayISO()} onChange={e => setBuddyPostData({ ...buddyPostData, startDate: e.target.value })} className="w-full px-3 py-2 bg-background text-foreground rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Ngày về</label>
                          <input type="date" value={buddyPostData.endDate} min={buddyPostData.startDate || todayISO()} onChange={e => setBuddyPostData({ ...buddyPostData, endDate: e.target.value })} className="w-full px-3 py-2 bg-background text-foreground rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Số người cần tìm</label>
                          <input type="number" min="1" value={buddyPostData.peopleNeeded} onChange={e => setBuddyPostData({ ...buddyPostData, peopleNeeded: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 bg-background text-foreground rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1">Ngân sách dự kiến (VND)</label>
                          <input type="text" value={buddyPostData.budgetVND} onChange={e => setBuddyPostData({ ...buddyPostData, budgetVND: e.target.value })} placeholder="Vd: 3.000.000" className="w-full px-3 py-2 bg-background text-foreground rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">Ghi chú thêm</label>
                        <textarea value={buddyPostData.note} onChange={e => setBuddyPostData({ ...buddyPostData, note: e.target.value })} placeholder="Chia sẻ thêm về kế hoạch của bạn..." rows={2} className="w-full px-3 py-2 bg-background text-foreground rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none resize-none"></textarea>
                      </div>
                      {renderImagePicker(buddyPostData.selectedImage, (imgId) => setBuddyPostData({ ...buddyPostData, selectedImage: imgId }))}
                      <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => setIsBuddyPostMode(false)} className="px-4 py-2 bg-white border border-border rounded-lg text-sm font-semibold hover:bg-muted transition-all">Hủy</button>
                        <button onClick={handleCreatePost} disabled={isPosting || (!user?.isPremium ? false : !buddyPostData.destination.trim())} className={`px-4 py-2 ${!user?.isPremium ? "bg-amber-500 hover:bg-amber-600" : "bg-primary hover:bg-primary/90"} text-white rounded-lg text-sm font-semibold disabled:opacity-50 transition-all flex items-center gap-2`}>
                          {!user?.isPremium ? <Lock className="w-4 h-4" /> : (isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />)} Đăng bài
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        onFocus={() => setIsExpanded(true)}
                        placeholder="Chia sẻ kế hoạch du lịch hoặc trải nghiệm của bạn..."
                        className={`w-full bg-background text-foreground rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all ${isExpanded || newPostContent.trim() !== "" || selectedTextPostImage !== ""
                            ? "min-h-[100px] px-4 py-3 resize-none"
                            : "h-11 px-4 py-2.5 resize-none overflow-hidden cursor-pointer"
                          }`}
                        disabled={isPosting}
                      />
                      {(isExpanded || newPostContent.trim() !== "" || selectedTextPostImage !== "") && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
                          {renderImagePicker(selectedTextPostImage, setSelectedTextPostImage)}
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setNewPostContent("");
                                setSelectedTextPostImage("");
                                setIsExpanded(false);
                              }}
                              className="px-4 py-2 bg-white border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-all"
                            >
                              Hủy
                            </button>
                            <button
                              onClick={handleCreatePost}
                              disabled={isPosting || (!user?.isPremium ? false : !newPostContent.trim())}
                              className={`px-5 py-2 text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-all flex items-center gap-2 ${!user?.isPremium ? "bg-amber-500 hover:bg-amber-600" : "bg-primary hover:bg-primary/90"}`}
                            >
                              {!user?.isPremium ? <Lock className="w-4 h-4" /> : (isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />)} Đăng bài
                            </button>
                          </div>
                        </div>
                      )}
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
                    {/* Delete button - only visible to the post's author */}
                    {post.userID === userProfile?.userID ? (
                      <button
                        onClick={() => handleDeletePost(post.postID)}
                        disabled={isDeleting[post.postID]}
                        title="Xóa bài viết"
                        aria-label="Xóa bài viết"
                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-full transition-all disabled:opacity-50"
                      >
                        {isDeleting[post.postID] ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                      </button>
                    ) : (
                      <button
                        onClick={() => setReportModalPostId(post.postID)}
                        title="Báo cáo bài viết"
                        className="p-2 text-muted-foreground hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all"
                      >
                        <Flag className="w-5 h-5" />
                      </button>
                    )}
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
                                    className={`flex-1 py-2 text-white rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${!user?.isPremium ? "bg-amber-500 hover:bg-amber-600" : "bg-primary hover:bg-primary/90"}`}
                                  >
                                    {!user?.isPremium ? <Lock className="w-4 h-4" /> : (isJoining[post.postID] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />)} Xin tham gia
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
                      <p className="text-foreground mb-4 whitespace-pre-wrap">{parsePostContent(post).text}</p>
                    </>
                  )}
                </div>

                {/* Post Image */}
                {(() => {
                  const parsed = parsePostContent(post);
                  if (parsed.selectedImage && imageMap[parsed.selectedImage]) {
                    return (
                      <div className="relative aspect-[16/9] overflow-hidden border-y border-border">
                        <img
                          src={imageMap[parsed.selectedImage]}
                          alt="Post attachment"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    );
                  } else if (!parsed.selectedImage && post.postID % 2 === 0) {
                    return (
                      <div className="relative aspect-[16/9] overflow-hidden border-y border-border">
                        <img
                          src={getPostImage(post.postID)}
                          alt="Post fallback"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Post Actions */}
                <div className="p-6 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleLike(post.postID)}
                        className={`flex items-center gap-2 transition-all ${!user?.isPremium ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground hover:text-red-500"}`}
                      >
                        {!user?.isPremium ? <Lock className="w-4 h-4" /> : <Heart className={`w-5 h-5 ${post.isLikedByCurrentUser ? "fill-red-500 text-red-500" : ""}`} />}
                        <span className="text-sm font-semibold">{post.likesCount}</span>
                      </button>
                      <button
                        onClick={() => handleToggleComments(post.postID)}
                        className={`flex items-center gap-2 transition-all ${showComments[post.postID] ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                      >
                        <MessageCircle className={`w-5 h-5 ${showComments[post.postID] ? "fill-primary/20" : ""}`} />
                        <span className="text-sm font-semibold">Bình luận</span>
                        {post.commentsCount > 0 && (
                          <span className="text-sm font-semibold">{post.commentsCount}</span>
                        )}
                      </button>
                      <button
                        onClick={() => setShareModalPostId(post.postID)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all"
                      >
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm font-semibold hidden sm:inline">Chia sẻ</span>
                      </button>
                    </div>
                    {/* Add connect button if not BuddyRequest (which already has it inside the card) and not the current user's own post */}
                    {post.postType !== "BuddyRequest" && post.userID !== userProfile?.userID && (
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
                              <div className="bg-muted p-3 rounded-2xl rounded-tl-none flex-1 flex justify-between gap-4 group">
                                <div className="flex flex-col">
                                  <Link to={`/profile/${comment.userID}`} className="font-semibold text-sm hover:text-primary mb-1">
                                    {comment.username}
                                  </Link>
                                  <p className="text-sm text-foreground">{comment.content}</p>
                                </div>
                                <div className="flex flex-col items-end justify-between shrink-0">
                                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                    {new Date(comment.commentDate).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                                  </span>
                                  {(comment.userID === userProfile?.userID || post.userID === userProfile?.userID) && (
  <button
    onClick={() => handleDeleteComment(post.postID, comment.commentID)}
    title="Xóa bình luận"
    aria-label="Xóa bình luận"
    className="text-muted-foreground/60 hover:text-red-500 p-1 hover:bg-red-50 rounded-lg transition-all mt-1"
  >
    <Trash2 className="w-3.5 h-3.5" />
  </button>
)}
                                </div>
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
                          disabled={isSubmittingComment[post.postID] || (!user?.isPremium ? false : !(commentInputs[post.postID]?.trim()))}
                          className={`p-2 rounded-full disabled:opacity-50 transition-all ${!user?.isPremium ? "text-amber-500 hover:bg-amber-100" : "text-primary hover:bg-primary/10"}`}
                        >
                          {!user?.isPremium ? <Lock className="w-4 h-4" /> : (isSubmittingComment[post.postID] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />)}
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
                    {buddy.userID !== userProfile?.userID && (
                      <Link
                        to={`/chat/${buddy.userID}`}
                        className="px-4 py-1.5 bg-primary text-white rounded-full text-xs hover:shadow-lg transition-all font-semibold"
                      >
                        Kết nối
                      </Link>
                    )}
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

      {/* Report Modal */}
      {reportModalPostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h2 className="font-bold text-lg text-red-500 flex items-center gap-2"><Flag className="w-5 h-5" /> Báo cáo bài viết</h2>
              <button
                onClick={() => { setReportModalPostId(null); setReportReason(""); }}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-4">Vui lòng chọn lý do báo cáo bài viết này:</p>
              <select
                value={reportReason}
                onChange={e => setReportReason(e.target.value)}
                className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-red-500 outline-none mb-6"
              >
                <option value="">-- Chọn lý do --</option>
                <option value="Spam hoặc quảng cáo trái phép">Spam hoặc quảng cáo trái phép</option>
                <option value="Nội dung phản cảm, không phù hợp">Nội dung phản cảm, không phù hợp</option>
                <option value="Thông tin sai lệch hoặc lừa đảo">Thông tin sai lệch hoặc lừa đảo</option>
                <option value="Vi phạm bản quyền hoặc quyền riêng tư">Vi phạm bản quyền hoặc quyền riêng tư</option>
                <option value="Khác">Lý do khác...</option>
              </select>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => { setReportModalPostId(null); setReportReason(""); }}
                  className="px-4 py-2 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={async () => {
                    if (!reportReason) {
                      toast.error("Vui lòng chọn một lý do!");
                      return;
                    }
                    setIsReporting(true);
                    try {
                      await reportPost(reportModalPostId, reportReason);
                      toast.success("Đã gửi báo cáo thành công. Cảm ơn bạn!");
                      setReportModalPostId(null);
                      setReportReason("");
                    } catch (error: any) {
                      toast.error(error?.response?.data || "Có lỗi xảy ra, vui lòng thử lại.");
                    } finally {
                      setIsReporting(false);
                    }
                  }}
                  disabled={isReporting || !reportReason}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isReporting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Gửi báo cáo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
