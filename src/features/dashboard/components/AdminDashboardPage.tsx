import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getAllTourBookings, updateTourBookingStatus } from "@/api/toursApi";
import { getAllUsers, getPendingGuides, approveGuide, getReports, updateReportStatus, getAdminOverview } from "@/api/adminApi";
import { getDestinations } from "@/api/destinationsApi";
import type { TourBooking } from "@/types/tours";
import type { AdminUser } from "@/types/admin";
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
  Trash2,
  Eye,
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

  useEffect(() => {
    if (activeTab === "overview") {
      fetchOverviewData();
    }
    if (activeTab === "bookings") {
      fetchBookings();
    }
    if (activeTab === "guides") {
      fetchPendingGuides();
    }
    if (activeTab === "destinations") {
      fetchDestinationsData();
    }
    if (activeTab === "users") {
      fetchAdminUsersData();
    }
    if (activeTab === "reports") {
      fetchReportsData();
    }
  }, [activeTab, userCurrentPage, userOfflineFilter, destPage, destSearch]);

  const fetchDestinationsData = async () => {
    setIsLoadingDestinations(true);
    try {
      const response = await getDestinations(destSearch, undefined, undefined, destPage, 10);
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
                <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">Danh sách người dùng</h2>
                    <p className="text-muted-foreground mt-1">Tổng số người dùng: <span className="font-bold text-primary">{totalUsers}</span></p>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Tìm người dùng..."
                        className="w-full pl-10 pr-4 py-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                    <div className="relative border border-border rounded-xl bg-muted overflow-hidden focus-within:ring-2 focus-within:ring-primary">
                      <select 
                        value={userOfflineFilter} 
                        onChange={(e) => {
                          setUserOfflineFilter(e.target.value);
                          setUserCurrentPage(1);
                        }}
                        className="w-full h-full pl-4 pr-10 py-3 bg-transparent outline-none appearance-none cursor-pointer"
                      >
                        <option value="all">Tất cả</option>
                        <option value="1_24_hours">1-24 giờ chưa online</option>
                        <option value="1_30_days">1-30 ngày chưa online</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  {isLoadingUsers ? (
                    <div className="py-12 text-center text-muted-foreground">Đang tải dữ liệu...</div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-3 px-4 text-sm text-muted-foreground">Người dùng</th>
                              <th className="text-left py-3 px-4 text-sm text-muted-foreground">Email</th>
                              <th className="text-left py-3 px-4 text-sm text-muted-foreground">Ngày tham gia</th>
                              <th className="text-left py-3 px-4 text-sm text-muted-foreground">Thời gian chưa online</th>
                              <th className="text-left py-3 px-4 text-sm text-muted-foreground">Hành động</th>
                            </tr>
                          </thead>
                          <tbody>
                            {adminUsers.map((user) => (
                              <tr key={user.userID} className="border-b border-border hover:bg-muted/50 transition-all">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <img src={user.avatarURL || "https://ui-avatars.com/api/?name=" + (user.fullName || user.username)} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                                    <span className="font-semibold">{user.fullName || user.username}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-muted-foreground">{user.email}</td>
                                <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(user.registrationDate).toLocaleDateString("vi-VN")}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    user.offlineDurationText === "Vừa mới online" || user.offlineDurationText.includes("phút")
                                      ? "bg-green-100 text-green-700" 
                                      : user.offlineDurationText === "Chưa từng online"
                                      ? "bg-gray-100 text-gray-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}>
                                    {user.offlineDurationText}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-muted rounded transition-all">
                                      <Eye className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                    <button className="p-2 hover:bg-muted rounded transition-all">
                                      <Edit className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                    <button className="p-2 hover:bg-red-50 rounded transition-all">
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {adminUsers.length === 0 && (
                              <tr>
                                <td colSpan={5} className="text-center py-8 text-muted-foreground">
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
                    <button 
                      onClick={() => { setSelectedDestination(null); setIsDestModalOpen(true); }}
                      className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all"
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
