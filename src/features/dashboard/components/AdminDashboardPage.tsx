import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getAllTourBookings, updateTourBookingStatus } from "@/api/toursApi";
import { getAllUsers, getPendingGuides, approveGuide, getReports, updateReportStatus, getAdminOverview, getUserDetail, updateUser, blockUser } from "@/api/adminApi";
import { getDestinations } from "@/api/destinationsApi";
import type { TourBooking } from "@/types/tours";
import type { AdminUser, AdminUserDetail } from "@/types/admin";
import type { DestinationDto } from "@/types/destinations";
import { DestinationModal } from "./DestinationModal";
import {
  Users,
  MapPin,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Activity,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Eye,
  Ban,
  ShieldCheck,
  Loader2,
  ChevronDown,
  BarChart3,
  PieChart,
  Calendar,
  X,
  BadgeCheck,
  CheckCircle,
  XCircle,
  FileSearch
} from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const getFileUrl = (path: string | undefined | null) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = ((import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace('/api', '');
  return `${baseUrl}${path}`;
};

const PROVINCES = [
  "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", 
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", 
  "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", 
  "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông", 
  "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", 
  "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình", 
  "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", 
  "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", 
  "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Quảng Bình", 
  "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", 
  "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", 
  "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", 
  "Vĩnh Phúc", "Yên Bái", "Phú Yên"
];

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "destinations" | "posts" | "reports" | "bookings" | "guides">("overview");
  
  // Tour bookings state
  const [tourBookings, setTourBookings] = useState<TourBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<TourBooking | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Users state
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [userOfflineFilter, setUserOfflineFilter] = useState("all");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // User view / edit / block modal state
  const [selectedUser, setSelectedUser] = useState<AdminUserDetail | null>(null);
  const [isUserViewOpen, setIsUserViewOpen] = useState(false);
  const [isUserEditOpen, setIsUserEditOpen] = useState(false);
  const [isLoadingUserDetail, setIsLoadingUserDetail] = useState(false);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [blockingUserId, setBlockingUserId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ fullName: "", email: "", studentCode: "", gender: "", role: "Customer" });

  // Pending guides state
  const [pendingGuides, setPendingGuides] = useState<any[]>([]);
  const [isLoadingGuides, setIsLoadingGuides] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<any | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Reports state
  const [reportsData, setReportsData] = useState<any[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [reportFilter, setReportFilter] = useState("Tất cả báo cáo");

  // Destinations state
  const [destinations, setDestinations] = useState<DestinationDto[]>([]);
  const [totalDestinations, setTotalDestinations] = useState(0);
  const [destPage, setDestPage] = useState(1);
  const [destTotalPages, setDestTotalPages] = useState(1);
  const [destSearch, setDestSearch] = useState("");
  const [destLocation, setDestLocation] = useState("all");
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<DestinationDto | null>(null);
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);

  // Overview state
  const [overviewData, setOverviewData] = useState<any>(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);

  const fetchBookings = () => {
    getAllTourBookings().then(setTourBookings).catch(console.error);
  };

  const fetchAdminUsersData = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await getAllUsers(userCurrentPage, 30, userOfflineFilter);
      setAdminUsers(response.users);
      setTotalUsers(response.totalUsers);
      setUserTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleViewUser = async (user: AdminUser) => {
    setIsUserViewOpen(true);
    setSelectedUser(null);
    setIsLoadingUserDetail(true);
    try {
      const id = user.userID || (user as any).userId;
      const detail = await getUserDetail(id);
      setSelectedUser(detail);
    } catch (error) {
      console.error("Failed to fetch user detail", error);
      toast.error("Không thể tải thông tin người dùng.");
      setIsUserViewOpen(false);
    } finally {
      setIsLoadingUserDetail(false);
    }
  };

  const handleEditUser = async (user: AdminUser) => {
    setIsUserEditOpen(true);
    setSelectedUser(null);
    setIsLoadingUserDetail(true);
    try {
      const id = user.userID || (user as any).userId;
      const detail = await getUserDetail(id);
      setSelectedUser(detail);
      setEditForm({
        fullName: detail.fullName ?? "",
        email: detail.email ?? "",
        studentCode: detail.studentCode ?? "",
        gender: detail.gender ?? "",
        role: detail.role ?? "Customer",
      });
    } catch (error) {
      console.error("Failed to fetch user detail", error);
      toast.error("Không thể tải thông tin người dùng.");
      setIsUserEditOpen(false);
    } finally {
      setIsLoadingUserDetail(false);
    }
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    setIsSavingUser(true);
    try {
      const id = selectedUser.userID || (selectedUser as any).userId;
      await updateUser(id, {
        fullName: editForm.fullName,
        email: editForm.email,
        studentCode: editForm.studentCode,
        gender: editForm.gender,
        role: editForm.role,
      });
      toast.success("Cập nhật người dùng thành công.");
      setIsUserEditOpen(false);
      fetchAdminUsersData();
    } catch (error: any) {
      console.error("Failed to update user", error);
      toast.error(error?.response?.data?.message || "Cập nhật người dùng thất bại.");
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleToggleBlock = async (user: AdminUser) => {
    const nextBlocked = !user.isBlocked;
    const confirmMsg = nextBlocked
      ? `Chặn người dùng "${user.fullName || user.username}"?`
      : `Bỏ chặn người dùng "${user.fullName || user.username}"?`;
    const description = nextBlocked 
      ? "Họ sẽ bị đăng xuất và không thể truy cập lại website nữa." 
      : "Họ sẽ có thể đăng nhập và sử dụng hệ thống bình thường.";

    toast(
      <div className="flex flex-col gap-1.5">
        <span className="font-semibold text-[15px]">{confirmMsg}</span>
        <span className="text-sm opacity-90">{description}</span>
      </div>, 
      {
        duration: 8000,
        className: "border-border dark:border-slate-700 p-4",
        classNames: {
          actionButton: "!bg-primary hover:!bg-primary/90 !text-white !font-semibold !rounded-lg !px-4 !py-2 !transition-all",
          cancelButton: "!bg-muted hover:!bg-muted/80 !text-foreground dark:!text-white !font-semibold !rounded-lg !px-4 !py-2 !transition-all !border-transparent"
        },
        action: {
          label: "Xác nhận",
          onClick: async () => {
            const id = user.userID || (user as any).userId;
            setBlockingUserId(id);
            try {
              await blockUser(id, nextBlocked);
              toast.success(nextBlocked ? "Đã chặn người dùng thành công." : "Đã bỏ chặn người dùng thành công.");
              setAdminUsers(prev => prev.map(u => (u.userID || (u as any).userId) === id ? { ...u, isBlocked: nextBlocked } : u));
            } catch (error: any) {
              console.error("Failed to toggle block", error);
              toast.error(error?.response?.data?.message || "Thao tác thất bại.");
            } finally {
              setBlockingUserId(null);
            }
          }
        },
        cancel: {
          label: "Hủy",
          onClick: () => {}
        }
      }
    );
  };

  useEffect(() => {
    if (activeTab === "overview") {
      fetchOverviewData();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "bookings") {
      fetchBookings();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "guides") {
      fetchPendingGuides();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "users") {
      fetchAdminUsersData();
    }
  }, [activeTab, userCurrentPage, userOfflineFilter]);

  useEffect(() => {
    if (activeTab === "reports") {
      fetchReportsData();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "destinations") {
      const timer = setTimeout(() => {
        fetchDestinationsData();
      }, 500); // Debounce search
      return () => clearTimeout(timer);
    }
  }, [activeTab, destPage, destSearch, destLocation]);

  const fetchDestinationsData = async () => {
    setIsLoadingDestinations(true);
    try {
      const response = await getDestinations(destSearch, undefined, undefined, destPage, 10, destLocation === "all" ? undefined : destLocation);
      setDestinations(response.items);
      setTotalDestinations(response.totalCount);
      setDestTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch destinations", error);
    } finally {
      setIsLoadingDestinations(false);
    }
  };

  const fetchOverviewData = async () => {
    setIsLoadingOverview(true);
    try {
      const data = await getAdminOverview();
      setOverviewData(data);
    } catch (error) {
      console.error("Failed to fetch overview data", error);
    } finally {
      setIsLoadingOverview(false);
    }
  };

  const fetchPendingGuides = async () => {
    setIsLoadingGuides(true);
    try {
      const data = await getPendingGuides();
      setPendingGuides(data);
    } catch (error) {
      console.error("Failed to fetch pending guides", error);
    } finally {
      setIsLoadingGuides(false);
    }
  };

  const handleApproveGuide = async (profileId: number, isApproved: boolean) => {
    try {
      await approveGuide(profileId, isApproved);
      toast.success(`Đã ${isApproved ? 'phê duyệt' : 'từ chối'} hướng dẫn viên thành công.`);
      setIsGuideModalOpen(false);
      fetchPendingGuides(); // Reload list
    } catch (error) {
      console.error("Failed to approve guide", error);
      toast.error("Có lỗi xảy ra khi duyệt hướng dẫn viên.");
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedBooking || !newStatus) return;
    setIsUpdatingStatus(true);
    try {
      await updateTourBookingStatus(selectedBooking.bookingID, newStatus);
      setIsBookingModalOpen(false);
      fetchBookings();
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Cập nhật trạng thái thất bại");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const fetchReportsData = async () => {
    setIsLoadingReports(true);
    try {
      const data = await getReports();
      setReportsData(data);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    } finally {
      setIsLoadingReports(false);
    }
  };

  const handleUpdateReport = async (reportId: number, status: 'Resolved' | 'Rejected') => {
    try {
      await updateReportStatus(reportId, status);
      toast.success(`Đã ${status === 'Resolved' ? 'duyệt (ẩn bài viết)' : 'từ chối'} báo cáo thành công.`);
      fetchReportsData(); // Refresh list
    } catch (error) {
      console.error("Failed to update report", error);
      toast.error("Có lỗi xảy ra khi xử lý báo cáo.");
    }
  };

  const stats = overviewData ? [
    {
      label: "Tổng người dùng",
      value: overviewData.stats.totalUsers.toLocaleString('vi-VN'),
      change: "Cập nhật",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Điểm đến hoạt động",
      value: overviewData.stats.activeDestinations.toLocaleString('vi-VN'),
      change: "Cập nhật",
      trend: "up",
      icon: MapPin,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Bài viết cộng đồng",
      value: overviewData.stats.totalPosts.toLocaleString('vi-VN'),
      change: "Cập nhật",
      trend: "up",
      icon: MessageSquare,
      color: "from-orange-500 to-amber-500",
    },
    {
      label: "Doanh thu Đặt Tour",
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(overviewData.stats.totalRevenue),
      change: "Cập nhật",
      trend: "up",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
  ] : [];

  const userGrowthData = overviewData?.userGrowth || [];
  const destinationData = overviewData?.destinationDistribution || [];
  const recentUsers = overviewData?.recentUsers || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-border flex-shrink-0">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold">Bảng quản trị</h2>
                <p className="text-xs text-muted-foreground">TravelHub</p>
              </div>
            </div>

            <nav className="space-y-2">
              {[
                { id: "overview", label: "Tổng quan", icon: BarChart3 },
                { id: "users", label: "Người dùng", icon: Users },
                { id: "destinations", label: "Điểm đến", icon: MapPin },
                { id: "bookings", label: "Đặt Tour", icon: Calendar },
                { id: "guides", label: "Duyệt HDV", icon: BadgeCheck },
                { id: "posts", label: "Bài viết", icon: MessageSquare },
                { id: "reports", label: "Báo cáo", icon: Activity },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.id
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                {activeTab === "overview" && "Tổng quan hệ thống"}
                {activeTab === "users" && "Quản lý người dùng"}
                {activeTab === "destinations" && "Quản lý điểm đến"}
                { activeTab === "bookings" && "Quản lý Đặt Tour" }
                { activeTab === "guides" && "Duyệt Hướng Dẫn Viên" }
                { activeTab === "posts" && "Quản lý bài viết" }
                {activeTab === "reports" && "Báo cáo & Kiểm duyệt"}
              </h1>
              <p className="text-muted-foreground">
                {activeTab === "overview" && "Theo dõi hiệu suất và sự tăng trưởng của nền tảng"}
                {activeTab === "users" && "Quản lý và xem tất cả người dùng đã đăng ký"}
                {activeTab === "destinations" && "Quản lý các điểm đến du lịch và danh sách"}
                { activeTab === "bookings" && "Theo dõi và quản lý các đơn đặt tour từ khách hàng" }
                { activeTab === "guides" && "Xem xét và phê duyệt các đơn đăng ký trở thành Hướng Dẫn Viên" }
                { activeTab === "posts" && "Quản lý bài viết cộng đồng và nội dung" }
                {activeTab === "reports" && "Xem xét và xử lý các báo cáo từ người dùng"}
              </p>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {isLoadingOverview ? (
                   <div className="py-20 text-center text-muted-foreground flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      Đang tải dữ liệu tổng quan...
                   </div>
                ) : overviewData ? (
                  <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="relative overflow-hidden bg-white rounded-2xl shadow-lg p-6">
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <TrendingUp className="w-4 h-4" />
                          <span>{stat.change}</span>
                        </div>
                      </div>
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* User Growth Chart */}
                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-bold mb-6">Tăng trưởng người dùng</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} name="Tổng người dùng" />
                        <Line type="monotone" dataKey="active" stroke="#06B6D4" strokeWidth={2} name="Người dùng hoạt động" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Destination Distribution */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-bold mb-6">Phân bổ điểm đến</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPie>
                        <Pie
                          data={destinationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {destinationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Users Table */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold">Người dùng mới nhất</h3>
                    <button className="text-sm text-primary hover:underline">Xem tất cả</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Người dùng</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Email</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Ngày tham gia</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentUsers.map((user: any) => (
                          <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-all">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img src={getFileUrl(user.avatar)} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                <span className="font-semibold">{user.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{user.email}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{user.joined}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.status === "đang hoạt động"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}>
                                {user.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                  </>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">Không có dữ liệu</div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="space-y-6">
                {/* Header Information */}
                <div className="bg-card dark:bg-slate-900 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold dark:text-white">Danh sách người dùng</h2>
                    <p className="text-muted-foreground mt-1">Tổng số người dùng: <span className="font-bold text-primary">{totalUsers}</span></p>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Tìm người dùng..."
                        className="w-full pl-10 pr-4 py-3 bg-muted dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                    <div className="relative border border-border dark:border-slate-700 rounded-xl bg-muted dark:bg-slate-800 overflow-hidden focus-within:ring-2 focus-within:ring-primary">
                      <select 
                        value={userOfflineFilter} 
                        onChange={(e) => {
                          setUserOfflineFilter(e.target.value);
                          setUserCurrentPage(1);
                        }}
                        className="w-full h-full pl-4 pr-10 py-3 bg-transparent outline-none appearance-none cursor-pointer dark:text-white"
                      >
                        <option value="all" className="dark:bg-slate-800">Tất cả</option>
                        <option value="1_24_hours" className="dark:bg-slate-800">1-24 giờ chưa online</option>
                        <option value="1_30_days" className="dark:bg-slate-800">1-30 ngày chưa online</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-card dark:bg-slate-900 rounded-2xl shadow-lg p-6">
                  {isLoadingUsers ? (
                    <div className="py-12 text-center text-muted-foreground">Đang tải dữ liệu...</div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border dark:border-slate-800">
                              <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-slate-400">Người dùng</th>
                              <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-slate-400">Email</th>
                              <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-slate-400">Ngày tham gia</th>
                              <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-slate-400">Thời gian chưa online</th>
                              <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-slate-400">Trạng thái</th>
                              <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-slate-400">Hành động</th>
                            </tr>
                          </thead>
                          <tbody>
                            {adminUsers.map((user) => {
                              const uId = user.userID || (user as any).userId;
                              return (
                              <tr key={uId} className="border-b border-border dark:border-slate-800 hover:bg-muted/50 dark:hover:bg-slate-800/50 transition-all">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <img src={user.avatarURL || (user as any).avatarUrl || "https://ui-avatars.com/api/?name=" + (user.fullName || user.username)} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                                    <span className="font-semibold dark:text-white">{user.fullName || user.username}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-muted-foreground dark:text-slate-300">{user.email}</td>
                                <td className="py-3 px-4 text-sm text-muted-foreground dark:text-slate-300">{new Date(user.registrationDate).toLocaleDateString("vi-VN")}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    user.offlineDurationText === "Vừa mới online" || user.offlineDurationText.includes("phút")
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                                      : user.offlineDurationText === "Chưa từng online"
                                      ? "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300"
                                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  }`}>
                                    {user.offlineDurationText}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  {user.isBlocked ? (
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                      Đã chặn
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                      Hoạt động
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleViewUser(user)}
                                      title="Xem chi tiết"
                                      className="p-2 hover:bg-muted dark:hover:bg-slate-800 rounded transition-all"
                                    >
                                      <Eye className="w-4 h-4 text-muted-foreground dark:text-slate-400" />
                                    </button>
                                    <button
                                      onClick={() => handleEditUser(user)}
                                      title="Chỉnh sửa"
                                      className="p-2 hover:bg-muted dark:hover:bg-slate-800 rounded transition-all"
                                    >
                                      <Edit className="w-4 h-4 text-muted-foreground dark:text-slate-400" />
                                    </button>
                                    <button
                                      onClick={() => handleToggleBlock(user)}
                                      disabled={blockingUserId === uId}
                                      title={user.isBlocked ? "Bỏ chặn" : "Chặn người dùng"}
                                      className={`p-2 rounded transition-all disabled:opacity-50 ${
                                        user.isBlocked ? "hover:bg-green-50 dark:hover:bg-green-900/30" : "hover:bg-red-50 dark:hover:bg-red-900/30"
                                      }`}
                                    >
                                      {blockingUserId === uId ? (
                                        <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                                      ) : user.isBlocked ? (
                                        <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-500" />
                                      ) : (
                                        <Ban className="w-4 h-4 text-red-500 dark:text-red-400" />
                                      )}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )})}
                            {adminUsers.length === 0 && (
                              <tr>
                                <td colSpan={6} className="text-center py-8 text-muted-foreground">
                                  Không tìm thấy người dùng nào.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Pagination */}
                      {userTotalPages > 1 && (
                        <div className="mt-6 flex items-center justify-center gap-2">
                          <button 
                            disabled={userCurrentPage === 1}
                            onClick={() => setUserCurrentPage(prev => Math.max(1, prev - 1))}
                            className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Trước
                          </button>
                          <span className="text-sm font-medium mx-4">
                            Trang {userCurrentPage} / {userTotalPages}
                          </span>
                          <button 
                            disabled={userCurrentPage === userTotalPages}
                            onClick={() => setUserCurrentPage(prev => Math.min(userTotalPages, prev + 1))}
                            className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Sau
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Destinations Tab */}
            {activeTab === "destinations" && (
              <div className="space-y-6">
                {/* Search & Add */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Tìm điểm đến..."
                        value={destSearch}
                        onChange={(e) => setDestSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                    <div className="relative border border-border rounded-xl bg-muted overflow-hidden focus-within:ring-2 focus-within:ring-primary md:w-64 shrink-0">
                      <select 
                        value={destLocation}
                        onChange={(e) => {
                          setDestLocation(e.target.value);
                          setDestPage(1);
                        }}
                        className="w-full h-full pl-4 pr-10 py-3 bg-transparent text-foreground outline-none appearance-none cursor-pointer"
                      >
                        <option value="all" className="bg-background text-foreground">Tất cả tỉnh/thành</option>
                        {PROVINCES.map(prov => (
                          <option key={prov} value={prov} className="bg-background text-foreground">{prov}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                    <button 
                      onClick={() => { setSelectedDestination(null); setIsDestModalOpen(true); }}
                      className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all whitespace-nowrap"
                    >
                      Thêm điểm đến
                    </button>
                  </div>
                </div>

                {/* Destinations Table */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  {isLoadingDestinations ? (
                    <div className="py-12 text-center text-muted-foreground">Đang tải dữ liệu...</div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-3 px-4 text-sm text-muted-foreground">Điểm đến</th>
                              <th className="text-left py-3 px-4 text-sm text-muted-foreground">Từ khóa</th>
                              <th className="text-left py-3 px-4 text-sm text-muted-foreground">Tỉnh/Thành phố</th>
                              <th className="text-left py-3 px-4 text-sm text-muted-foreground">Chi phí (VND)</th>
                              <th className="text-left py-3 px-4 text-sm text-muted-foreground">Trạng thái</th>
                              <th className="text-left py-3 px-4 text-sm text-muted-foreground">Hành động</th>
                            </tr>
                          </thead>
                          <tbody>
                            {destinations.map((dest) => (
                              <tr key={dest.destinationID} className="border-b border-border hover:bg-muted/50 transition-all">
                                <td className="py-3 px-4 font-semibold">
                                  <div className="flex items-center gap-3">
                                    <img src={dest.image?.split(',')[0] || "https://images.unsplash.com/photo-1598977123118-4e30ba3c4f5b?w=100"} alt={dest.name} className="w-10 h-10 rounded-lg object-cover" />
                                    <span>{dest.name}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                                    {dest.keyMain || "Chưa có"}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-muted-foreground">{dest.cityProvince}</td>
                                <td className="py-3 px-4 text-sm font-semibold text-primary">{dest.totalTourCost ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dest.totalTourCost) : "N/A"}</td>
                                <td className="py-3 px-4">
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                    Hoạt động
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-muted rounded transition-all" onClick={() => window.open(`/destination/${dest.destinationID}`, '_blank')}>
                                      <Eye className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                    <button className="p-2 hover:bg-muted rounded transition-all" onClick={() => { setSelectedDestination(dest); setIsDestModalOpen(true); }}>
                                      <Edit className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {destinations.length === 0 && (
                              <tr>
                                <td colSpan={6} className="text-center py-8 text-muted-foreground">
                                  Không tìm thấy điểm đến nào.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Pagination */}
                      {destTotalPages > 1 && (
                        <div className="mt-6 flex items-center justify-center gap-2">
                          <button 
                            disabled={destPage === 1}
                            onClick={() => setDestPage(prev => Math.max(1, prev - 1))}
                            className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Trước
                          </button>
                          <span className="text-sm font-medium mx-4">
                            Trang {destPage} / {destTotalPages}
                          </span>
                          <button 
                            disabled={destPage === destTotalPages}
                            onClick={() => setDestPage(prev => Math.min(destTotalPages, prev + 1))}
                            className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Sau
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Modal */}
                {isDestModalOpen && (
                  <DestinationModal 
                    initialData={selectedDestination} 
                    onClose={() => setIsDestModalOpen(false)} 
                    onSaved={() => {
                      setIsDestModalOpen(false);
                      fetchDestinationsData();
                    }} 
                  />
                )}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === "reports" && (
              <div className="space-y-6">
                {/* Filter Tabs */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex gap-2 overflow-x-auto">
                    {["Tất cả báo cáo", "Pending", "Resolved", "Rejected"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setReportFilter(tab)}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                          reportFilter === tab
                            ? "bg-primary text-white"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reports Table */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  {isLoadingReports ? (
                    <div className="py-12 text-center text-muted-foreground">Đang tải dữ liệu báo cáo...</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 text-sm text-muted-foreground">Lý do</th>
                            <th className="text-left py-3 px-4 text-sm text-muted-foreground">Người báo cáo</th>
                            <th className="text-left py-3 px-4 text-sm text-muted-foreground">Nội dung bài viết</th>
                            <th className="text-left py-3 px-4 text-sm text-muted-foreground">Ngày</th>
                            <th className="text-left py-3 px-4 text-sm text-muted-foreground">Trạng thái</th>
                            <th className="text-left py-3 px-4 text-sm text-muted-foreground">Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportsData
                            .filter(r => reportFilter === "Tất cả báo cáo" || r.status === reportFilter)
                            .map((report) => (
                            <tr key={report.reportID} className="border-b border-border hover:bg-muted/50 transition-all">
                              <td className="py-3 px-4 font-semibold text-red-500">{report.reason}</td>
                              <td className="py-3 px-4 text-sm font-medium">{report.reporterName}</td>
                              <td className="py-3 px-4 text-sm text-muted-foreground max-w-xs">
                                <div className="font-medium text-foreground line-clamp-1">{report.postTitle}</div>
                                <div className="line-clamp-2">{report.postContent}</div>
                              </td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">
                                {new Date(report.reportDate).toLocaleDateString("vi-VN")}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  report.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                                  report.status === "Resolved" ? "bg-green-100 text-green-700" :
                                  "bg-gray-100 text-gray-700"
                                }`}>
                                  {report.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {report.status === "Pending" && (
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => handleUpdateReport(report.reportID, 'Resolved')}
                                      className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition-all font-semibold"
                                    >
                                      Duyệt (Ẩn bài)
                                    </button>
                                    <button 
                                      onClick={() => handleUpdateReport(report.reportID, 'Rejected')}
                                      className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs hover:bg-gray-300 transition-all font-semibold"
                                    >
                                      Từ chối
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                          {reportsData.length === 0 && (
                            <tr>
                              <td colSpan={6} className="text-center py-8 text-muted-foreground">
                                Chưa có báo cáo nào.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold">Danh sách Đặt Tour</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Khách hàng</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Tour</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Số người</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Tổng tiền</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Trạng thái</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Ngày đặt</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tourBookings.map((booking) => (
                          <tr key={booking.bookingID} className="border-b border-border hover:bg-muted/50 transition-all">
                            <td className="py-3 px-4">
                              <div className="font-semibold">{booking.fullName}</div>
                              <div className="text-xs text-muted-foreground">{booking.phone}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium line-clamp-1">{booking.tourTitle}</div>
                              <div className="text-xs text-muted-foreground">{new Date(booking.departureDate).toLocaleDateString('vi-VN')}</div>
                            </td>
                            <td className="py-3 px-4 text-sm">{booking.guests} khách</td>
                            <td className="py-3 px-4 font-semibold text-primary">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalPriceVND)}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="py-3 px-4">
                              <button 
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setNewStatus(booking.status);
                                  setIsBookingModalOpen(true);
                                }}
                                className="p-2 hover:bg-muted rounded transition-all text-primary"
                                title="Xem chi tiết & Cập nhật"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {tourBookings.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-muted-foreground">
                              Chưa có đơn đặt tour nào.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Guides Approval Tab */}
            {activeTab === "guides" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold">Danh sách Đơn Đăng Ký Chờ Duyệt</h3>
                  </div>
                  
                  {isLoadingGuides ? (
                    <div className="py-12 text-center text-muted-foreground">Đang tải dữ liệu...</div>
                  ) : pendingGuides.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      Không có đơn đăng ký nào đang chờ duyệt.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 text-sm text-muted-foreground">Người Dùng</th>
                            <th className="text-left py-3 px-4 text-sm text-muted-foreground">Kinh nghiệm</th>
                            <th className="text-left py-3 px-4 text-sm text-muted-foreground">Ngôn ngữ</th>
                            <th className="text-left py-3 px-4 text-sm text-muted-foreground">Địa điểm</th>
                            <th className="text-left py-3 px-4 text-sm text-muted-foreground">Ngày Nộp Đơn</th>
                            <th className="text-left py-3 px-4 text-sm text-muted-foreground">Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingGuides.map((guide) => (
                            <tr key={guide.profileID} className="border-b border-border hover:bg-muted/50 transition-all">
                              <td className="py-3 px-4">
                                <div className="font-semibold">{guide.fullName}</div>
                                <div className="text-xs text-muted-foreground">{guide.email}</div>
                              </td>
                              <td className="py-3 px-4 text-sm">{guide.experience} năm</td>
                              <td className="py-3 px-4 text-sm">{guide.languages}</td>
                              <td className="py-3 px-4 text-sm">{guide.locations}</td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">
                                {new Date(guide.createdAt).toLocaleDateString('vi-VN')}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => {
                                      setSelectedGuide(guide);
                                      setIsGuideModalOpen(true);
                                    }}
                                    className="p-2 hover:bg-muted text-primary rounded transition-all"
                                    title="Xem chi tiết"
                                  >
                                    <Eye className="w-5 h-5" />
                                  </button>
                                  <button 
                                    onClick={() => handleApproveGuide(guide.profileID, true)}
                                    className="p-2 hover:bg-green-50 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded transition-all"
                                    title="Phê duyệt"
                                  >
                                    <CheckCircle className="w-5 h-5" />
                                  </button>
                                  <button 
                                    onClick={() => handleApproveGuide(guide.profileID, false)}
                                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded transition-all"
                                    title="Từ chối"
                                  >
                                    <XCircle className="w-5 h-5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {isUserViewOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col border border-border dark:border-slate-800">
            <div className="flex justify-between items-center p-6 border-b border-border dark:border-slate-800">
              <h3 className="text-xl font-bold dark:text-white">Chi tiết người dùng</h3>
              <button onClick={() => setIsUserViewOpen(false)} className="p-2 hover:bg-muted dark:hover:bg-slate-800 rounded-full transition-all text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex items-start gap-6 mb-8">
                <img 
                  src={selectedUser.avatarURL || "https://ui-avatars.com/api/?name=" + (selectedUser.fullName || selectedUser.username)} 
                  alt="Avatar" 
                  className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-white dark:border-slate-800"
                />
                <div>
                  <h4 className="text-2xl font-bold mb-1 dark:text-white">{selectedUser.fullName || selectedUser.username}</h4>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <div className="mt-3 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedUser.isBlocked ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                      {selectedUser.isBlocked ? "Đã chặn" : "Hoạt động"}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-semibold">
                      {selectedUser.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-border dark:border-slate-800">Thông tin cá nhân</h4>
                  <ul className="space-y-4">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Tên đăng nhập:</span>
                      <span className="font-medium text-right dark:text-white">{selectedUser.username}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Mã sinh viên:</span>
                      <span className="font-medium text-right dark:text-white">{selectedUser.studentCode || "Chưa cập nhật"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Giới tính:</span>
                      <span className="font-medium text-right dark:text-white">{selectedUser.gender || "Chưa cập nhật"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Ngày sinh:</span>
                      <span className="font-medium text-right dark:text-white">{selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString('vi-VN') : "Chưa cập nhật"}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-border dark:border-slate-800">Thông tin hệ thống</h4>
                  <ul className="space-y-4">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Ngày tham gia:</span>
                      <span className="font-medium text-right dark:text-white">{new Date(selectedUser.registrationDate).toLocaleDateString('vi-VN')}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Lần cuối online:</span>
                      <span className="font-medium text-right dark:text-white">{selectedUser.lastOnline ? new Date(selectedUser.lastOnline).toLocaleString('vi-VN') : "Chưa từng online"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Tài khoản Premium:</span>
                      <span className="font-medium text-right dark:text-white">{selectedUser.isPremium ? "Có" : "Không"}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border dark:border-slate-800 flex justify-end gap-3 bg-gray-50 dark:bg-slate-900">
              <button onClick={() => setIsUserViewOpen(false)} className="px-6 py-2.5 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-slate-700 transition-all font-semibold">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isUserEditOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col border border-border dark:border-slate-800">
            <div className="flex justify-between items-center p-6 border-b border-border dark:border-slate-800">
              <h3 className="text-xl font-bold dark:text-white">Chỉnh sửa người dùng</h3>
              <button onClick={() => setIsUserEditOpen(false)} className="p-2 hover:bg-muted dark:hover:bg-slate-800 rounded-full transition-all text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-slate-300">Họ và tên</label>
                <input 
                  type="text"
                  value={editForm.fullName}
                  onChange={e => setEditForm({...editForm, fullName: e.target.value})}
                  className="w-full p-3 bg-muted/50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white"
                  placeholder="Nhập họ và tên..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-slate-300">Email</label>
                <input 
                  type="email"
                  value={editForm.email}
                  onChange={e => setEditForm({...editForm, email: e.target.value})}
                  className="w-full p-3 bg-muted/50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white"
                  placeholder="Nhập email..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-slate-300">Mã sinh viên</label>
                <input 
                  type="text"
                  value={editForm.studentCode}
                  onChange={e => setEditForm({...editForm, studentCode: e.target.value})}
                  className="w-full p-3 bg-muted/50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white"
                  placeholder="Nhập mã sinh viên..."
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-slate-300">Giới tính</label>
                  <select 
                    value={editForm.gender}
                    onChange={e => setEditForm({...editForm, gender: e.target.value})}
                    className="w-full p-3 bg-muted/50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer dark:text-white"
                  >
                    <option value="" className="dark:bg-slate-800">Chưa chọn</option>
                    <option value="Male" className="dark:bg-slate-800">Nam</option>
                    <option value="Female" className="dark:bg-slate-800">Nữ</option>
                    <option value="Other" className="dark:bg-slate-800">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-slate-300">Vai trò</label>
                  <select 
                    value={editForm.role}
                    onChange={e => setEditForm({...editForm, role: e.target.value})}
                    className="w-full p-3 bg-muted/50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer dark:text-white"
                  >
                    <option value="Customer" className="dark:bg-slate-800">Customer</option>
                    <option value="TourGuide" className="dark:bg-slate-800">TourGuide</option>
                    <option value="Admin" className="dark:bg-slate-800">Admin</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border dark:border-slate-800 flex justify-end gap-3 bg-gray-50 dark:bg-slate-900">
              <button 
                onClick={() => setIsUserEditOpen(false)} 
                className="px-6 py-2.5 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-slate-700 transition-all font-semibold"
                disabled={isSavingUser}
              >
                Hủy
              </button>
              <button 
                onClick={handleSaveUser} 
                className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-semibold flex items-center gap-2 shadow-sm"
                disabled={isSavingUser}
              >
                {isSavingUser ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isSavingUser ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {isBookingModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h3 className="text-xl font-bold">Chi tiết Đặt Tour #{selectedBooking.bookingID}</h3>
              <button onClick={() => setIsBookingModalOpen(false)} className="p-2 hover:bg-muted rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-muted-foreground text-sm mb-2">Thông tin Khách hàng</h4>
                  <p><strong>Họ tên:</strong> {selectedBooking.fullName}</p>
                  <p><strong>Điện thoại:</strong> {selectedBooking.phone}</p>
                  <p><strong>Email:</strong> {selectedBooking.email || "Không có"}</p>
                  <p><strong>Ghi chú:</strong> {selectedBooking.notes || "Không có"}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-muted-foreground text-sm mb-2">Thông tin Tour</h4>
                  <p><strong>Tour:</strong> {selectedBooking.tourTitle}</p>
                  <p><strong>Ngày đi:</strong> {new Date(selectedBooking.departureDate).toLocaleDateString('vi-VN')}</p>
                  <p><strong>Số khách:</strong> {selectedBooking.guests}</p>
                  <p><strong>Tổng tiền:</strong> <span className="font-bold text-primary">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedBooking.totalPriceVND)}</span></p>
                </div>
              </div>
              
              <div className="border-t border-border pt-6">
                <h4 className="font-semibold mb-3">Cập nhật Trạng thái</h4>
                <div className="flex gap-4 items-center">
                  <select 
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="flex-1 p-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Pending">Pending (Chờ xử lý)</option>
                    <option value="Confirmed">Confirmed (Đã xác nhận)</option>
                    <option value="Cancelled">Cancelled (Đã hủy)</option>
                  </select>
                  <button 
                    onClick={handleUpdateStatus}
                    disabled={isUpdatingStatus || newStatus === selectedBooking.status}
                    className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-semibold disabled:opacity-50"
                  >
                    {isUpdatingStatus ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guide Details Modal */}
      {isGuideModalOpen && selectedGuide && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-border bg-gray-50 dark:bg-muted/30">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BadgeCheck className="w-6 h-6 text-primary" />
                Chi Tiết Hồ Sơ Hướng Dẫn Viên
              </h3>
              <button onClick={() => setIsGuideModalOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-muted rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              {/* User Identity Info */}
              <div className="flex items-start gap-6 mb-1 bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30">
                <img 
                  src={getFileUrl(selectedGuide.guideAvatarUrl) || "https://ui-avatars.com/api/?name=" + selectedGuide.fullName} 
                  alt="Avatar" 
                  className="w-20 h-20 rounded-xl object-cover border-4 border-white dark:border-slate-800 shadow-md"
                />
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-foreground mb-1">{selectedGuide.fullName}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{selectedGuide.email}</p>
                  <p className="text-xs text-gray-700 dark:text-slate-300 max-w-2xl bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm">
                    <span className="font-semibold block mb-1">Giới thiệu bản thân (Bio):</span>
                    {selectedGuide.bio || "Không có phần giới thiệu."}
                  </p>
                </div>
              </div>

              {/* Professional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                <div className="text-l">
                  <h4 className="font-semibold text-gray-900 dark:text-foreground mb-4 pb-2 border-b border-border">Thông tin chuyên môn</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between border-b border-gray-50 dark:border-border/50 pb-2">
                      <span className="text-muted-foreground">Kinh nghiệm:</span>
                      <span className="font-medium">{selectedGuide.experience} năm</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-50 dark:border-border/50 pb-2">
                      <span className="text-muted-foreground">Ngôn ngữ hỗ trợ:</span>
                      <span className="font-medium text-right max-w-[200px]">{selectedGuide.languages}</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-50 dark:border-border/50 pb-2">
                      <span className="text-muted-foreground">Địa điểm hoạt động:</span>
                      <span className="font-medium text-right max-w-[200px]">{selectedGuide.locations}</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-50 dark:border-border/50 pb-2">
                      <span className="text-muted-foreground">Danh mục Tour:</span>
                      <span className="font-medium text-right max-w-[200px]">{selectedGuide.tourCategories}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Ngày tạo hồ sơ:</span>
                      <span className="font-medium">{new Date(selectedGuide.createdAt).toLocaleDateString('vi-VN')}</span>
                    </li>
                  </ul>
                </div>
                
                {/* Documents / Images */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-foreground mb-4 pb-2 border-b border-border">Giấy tờ tùy thân & Chứng chỉ</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground font-medium">CMND/CCCD (Mặt trước)</span>
                      <div className="aspect-video bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                        {selectedGuide.idFrontUrl ? (
                          selectedGuide.idFrontUrl.toLowerCase().endsWith('.pdf') ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-red-500">
                              <FileText className="w-8 h-8 mb-1" />
                              <span className="text-xs">Tài liệu PDF</span>
                            </div>
                          ) : (
                            <img src={getFileUrl(selectedGuide.idFrontUrl)} alt="Mặt trước CMND" className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer" />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Không có ảnh</div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground font-medium">CMND/CCCD (Mặt sau)</span>
                      <div className="aspect-video bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                        {selectedGuide.idBackUrl ? (
                          selectedGuide.idBackUrl.toLowerCase().endsWith('.pdf') ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-red-500">
                              <FileText className="w-8 h-8 mb-1" />
                              <span className="text-xs">Tài liệu PDF</span>
                            </div>
                          ) : (
                            <img src={getFileUrl(selectedGuide.idBackUrl)} alt="Mặt sau CMND" className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer" />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Không có ảnh</div>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <span className="text-sm text-muted-foreground font-medium">Chứng chỉ thẻ Hướng dẫn viên</span>
                      <div className="h-32 bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                        {selectedGuide.certUrl ? (
                          selectedGuide.certUrl.toLowerCase().endsWith('.pdf') ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-red-500">
                              <FileText className="w-8 h-8 mb-1" />
                              <span className="text-xs">Tài liệu PDF</span>
                            </div>
                          ) : (
                            <img src={getFileUrl(selectedGuide.certUrl)} alt="Chứng chỉ" className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer" />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Không có ảnh</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-border bg-gray-50 dark:bg-muted/30 flex flex-col sm:flex-row sm:justify-end gap-4">
              <button
                onClick={() => navigate(`/admin/guides/${selectedGuide.profileID}`, { state: { guide: selectedGuide } })}
                className="px-6 py-2.5 bg-muted text-foreground rounded-xl hover:bg-muted/70 font-semibold transition-colors flex items-center justify-center gap-2 sm:mr-auto"
              >
                <FileSearch className="w-5 h-5" />
                Xem chi tiết
              </button>
              <button
                onClick={() => handleApproveGuide(selectedGuide.profileID, false)}
                className="px-6 py-2.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Từ chối hồ sơ
              </button>
              <button 
                onClick={() => handleApproveGuide(selectedGuide.profileID, true)}
                className="px-6 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 font-semibold shadow-sm hover:shadow transition-all flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Phê duyệt Hướng dẫn viên
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
