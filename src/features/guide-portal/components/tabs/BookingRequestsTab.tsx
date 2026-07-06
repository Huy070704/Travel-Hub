import { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  Users,
  CreditCard,
  AlertCircle,
  Star,
  Loader2,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { tourGuideApi } from "@/api/tourGuideApi";
import { toast } from "sonner";
import { Link } from "react-router";
import { useAuth } from "@/contexts/AuthContext";

export function BookingRequestsTab() {
  const [activeSubTab, setActiveSubTab] = useState<"available" | "pending" | "confirmed" | "cancelled">("available");
  const [applications, setApplications] = useState<any[]>([]);
  const [availableRequests, setAvailableRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState<Record<number, boolean>>({});

  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [appsData, availableData] = await Promise.all([
        tourGuideApi.getMyApplications(),
        tourGuideApi.getAvailableGuideRequests()
      ]);
      setApplications(appsData);
      setAvailableRequests(availableData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Không thể tải dữ liệu.");
    } finally {
      setIsLoading(false);
    }
  };

  const pendingApps = applications.filter(a => a.application.status === "Pending");
  const confirmedApps = applications.filter(a => a.application.status === "Accepted");
  const cancelledApps = applications.filter(a => a.application.status === "Declined");

  // Remove available requests that the user has already applied to
  const appliedPostIds = applications.map(a => a.post.postID);
  const displayAvailableRequests = availableRequests.filter(req => !appliedPostIds.includes(req.postID) && req.userID !== user?.userID);

  const subTabs = [
    { id: "available", label: "Khách đang tìm (Chờ Duyệt)", count: displayAvailableRequests.length },
    { id: "pending", label: "Đã ứng tuyển", count: pendingApps.length },
    { id: "confirmed", label: "Đã xác nhận", count: confirmedApps.length },
    { id: "cancelled", label: "Đã từ chối", count: cancelledApps.length },
  ];

  const parsePostContent = (content: string) => {
    try {
      return JSON.parse(content);
    } catch {
      return { text: content };
    }
  };

  const handleApply = async (postId: number) => {
    if (isApplying[postId]) return;
    setIsApplying(prev => ({ ...prev, [postId]: true }));
    try {
      await tourGuideApi.applyForGuideRequest({ postID: postId });
      toast.success("Đã ứng tuyển thành công! Vui lòng chờ khách hàng liên hệ.");
      // Refresh list
      await fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi ứng tuyển.");
    } finally {
      setIsApplying(prev => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yêu cầu đặt chỗ & Ứng tuyển</h1>
        <p className="text-muted-foreground mt-1">Tìm việc mới và quản lý các yêu cầu đặt lịch của bạn.</p>
      </div>

      {/* Sub-Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl font-medium transition-all whitespace-nowrap ${
              activeSubTab === tab.id
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            {tab.label}
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeSubTab === tab.id ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="mt-6">
          
          {/* AVAILABLE TAB (Khách đang tìm) */}
          {activeSubTab === "available" && (
            <div className="space-y-4">
              {displayAvailableRequests.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Hiện chưa có yêu cầu tìm Hướng dẫn viên nào mới.</p>
              ) : displayAvailableRequests.map((post) => {
                const content = parsePostContent(post.content);
                return (
                  <div key={post.postID} className="bg-card rounded-2xl p-6 shadow-sm border border-border flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={post.avatarURL || "/placeholder-user.jpg"} alt={post.username} className="w-12 h-12 rounded-full border border-border" />
                          <div>
                            <h3 className="font-bold text-lg">{post.username}</h3>
                            <p className="text-xs text-muted-foreground">Bài đăng ngày: {new Date(post.creationDate).toLocaleDateString('vi-VN')}</p>
                          </div>
                        </div>
                        <div className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> Việc mới (Chờ duyệt)
                        </div>
                      </div>

                      <div className="bg-green-50/50 dark:bg-green-900/10 rounded-xl p-4 border border-green-100 dark:border-green-800">
                        <p className="font-semibold mb-2 text-primary">{post.title}</p>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{content.text || post.content}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center min-w-[150px] border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                      <Button 
                        onClick={() => handleApply(post.postID)}
                        disabled={isApplying[post.postID]}
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                      >
                        {isApplying[post.postID] ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Users className="w-4 h-4 mr-2" />} 
                        Ứng tuyển ngay
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PENDING TAB (Đã ứng tuyển) */}
          {activeSubTab === "pending" && (
            <div className="space-y-4">
              {pendingApps.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Bạn chưa có đơn ứng tuyển nào đang chờ duyệt.</p>
              ) : pendingApps.map(({ application, post }) => {
                const content = parsePostContent(post.content);
                return (
                  <div key={application.applicationID} className="bg-card rounded-2xl p-6 shadow-sm border border-border flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={post.avatarURL || "/placeholder-user.jpg"} alt={post.username} className="w-12 h-12 rounded-full border border-border" />
                          <div>
                            <h3 className="font-bold text-lg">{post.username}</h3>
                            <p className="text-xs text-muted-foreground">Bài đăng ngày: {new Date(post.creationDate).toLocaleDateString('vi-VN')}</p>
                          </div>
                        </div>
                        <div className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          Đang chờ khách duyệt
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                        <p className="font-semibold mb-2">{post.title}</p>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{content.text || post.content}</p>
                      </div>

                      {application.message && (
                        <div className="flex gap-3 bg-blue-50 text-blue-800 border-blue-100 p-3 rounded-lg text-sm border">
                          <MessageCircle className="w-5 h-5 flex-shrink-0" />
                          <p><span className="font-semibold">Lời nhắn ứng tuyển của bạn:</span> "{application.message}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CONFIRMED TAB */}
          {activeSubTab === "confirmed" && (
            <div className="space-y-4">
              {confirmedApps.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Không có đơn ứng tuyển nào được chấp nhận.</p>
              ) : confirmedApps.map(({ application, post }) => {
                const content = parsePostContent(post.content);
                return (
                  <div key={application.applicationID} className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 border-l-4 border-l-green-500 flex flex-col lg:flex-row gap-6 hover:shadow-md transition-shadow">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Chi tiết Tour</h4>
                        <p className="font-bold text-lg leading-tight mb-2">{post.title}</p>
                        <p className="text-sm text-foreground line-clamp-3">{content.text || post.content}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Chi tiết Khách</h4>
                        <div className="flex items-center gap-3 mb-3">
                          <img src={post.avatarURL || "/placeholder-user.jpg"} alt={post.username} className="w-10 h-10 rounded-full" />
                          <div>
                            <p className="font-semibold">{post.username}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 justify-center lg:border-l lg:border-border lg:pl-6 min-w-[200px]">
                      <Link to={`/chat/${post.userID}`}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-md shadow-blue-600/20">
                          <MessageCircle className="w-4 h-4" /> Nhắn tin ngay
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CANCELLED TAB */}
          {activeSubTab === "cancelled" && (
            <div className="space-y-4">
              {cancelledApps.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Không có đơn ứng tuyển nào bị từ chối.</p>
              ) : cancelledApps.map(({ application, post }) => (
                <div key={application.applicationID} className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 opacity-80 flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Bị từ chối
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-lg text-muted-foreground line-through decoration-muted">{post.title}</h3>
                    
                    <div className="flex items-center gap-3">
                      <img src={post.avatarURL || "/placeholder-user.jpg"} alt={post.username} className="w-8 h-8 rounded-full grayscale" />
                      <span className="text-sm font-medium text-muted-foreground">{post.username}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
