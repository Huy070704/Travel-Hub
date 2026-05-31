import { useState } from "react";
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
  Calendar
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "destinations" | "posts" | "reports">("overview");

  const stats = [
    {
      label: "Tổng người dùng",
      value: "12,847",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Điểm đến hoạt động",
      value: "234",
      change: "+8.2%",
      trend: "up",
      icon: MapPin,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Bài viết cộng đồng",
      value: "3,492",
      change: "+24.1%",
      trend: "up",
      icon: MessageSquare,
      color: "from-orange-500 to-amber-500",
    },
    {
      label: "Doanh thu",
      value: "45,291,000đ",
      change: "+18.7%",
      trend: "up",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
  ];

  const userGrowthData = [
    { month: "Tháng 1", users: 8420, active: 6234 },
    { month: "Tháng 2", users: 9150, active: 6891 },
    { month: "Tháng 3", users: 9850, active: 7420 },
    { month: "Tháng 4", users: 10680, active: 8156 },
    { month: "Tháng 5", users: 11520, active: 8945 },
    { month: "Tháng 6", users: 12847, active: 9823 },
  ];

  const destinationData = [
    { name: "Châu Á", value: 45, color: "#3B82F6" },
    { name: "Châu Âu", value: 30, color: "#06B6D4" },
    { name: "Châu Mỹ", value: 15, color: "#FB923C" },
    { name: "Châu Phi", value: 7, color: "#8B5CF6" },
    { name: "Châu Đại Dương", value: 3, color: "#EC4899" },
  ];

  const recentUsers = [
    {
      id: 1,
      name: "Sarah Chen",
      email: "sarah.chen@berkeley.edu",
      university: "UC Berkeley",
      joined: "2 giờ trước",
      status: "đang hoạt động",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    },
    {
      id: 2,
      name: "Marcus Johnson",
      email: "marcus.j@nyu.edu",
      university: "NYU",
      joined: "5 giờ trước",
      status: "đang hoạt động",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      email: "emma.r@mit.edu",
      university: "MIT",
      joined: "1 ngày trước",
      status: "đang hoạt động",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    },
    {
      id: 4,
      name: "Alex Kim",
      email: "alex.kim@stanford.edu",
      university: "Stanford",
      joined: "2 ngày trước",
      status: "không hoạt động",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    },
  ];

  const destinations = [
    { id: 1, name: "Bali, Indonesia", category: "Biển", users: 2847, avgBudget: "12,500,000đ", status: "hoạt động" },
    { id: 2, name: "Tokyo, Nhật Bản", category: "Văn hóa", users: 3291, avgBudget: "23,000,000đ", status: "hoạt động" },
    { id: 3, name: "Barcelona, Tây Ban Nha", category: "Thành phố", users: 2156, avgBudget: "16,000,000đ", status: "hoạt động" },
    { id: 4, name: "Iceland", category: "Phiêu lưu", users: 1423, avgBudget: "30,000,000đ", status: "hoạt động" },
  ];

  const reports = [
    { id: 1, type: "Nội dung không phù hợp", reporter: "Người dùng #2847", target: "Bài viết #3921", status: "đang chờ", date: "2 giờ trước" },
    { id: 2, type: "Tài khoản rác", reporter: "Người dùng #1523", target: "Người dùng #4892", status: "đang xem xét", date: "5 giờ trước" },
    { id: 3, type: "Thông tin giả mạo", reporter: "Người dùng #8234", target: "Điểm đến #231", status: "đã giải quyết", date: "1 ngày trước" },
  ];

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
                {activeTab === "posts" && "Quản lý bài viết"}
                {activeTab === "reports" && "Báo cáo & Kiểm duyệt"}
              </h1>
              <p className="text-muted-foreground">
                {activeTab === "overview" && "Theo dõi hiệu suất và sự tăng trưởng của nền tảng"}
                {activeTab === "users" && "Quản lý và xem tất cả người dùng đã đăng ký"}
                {activeTab === "destinations" && "Quản lý các điểm đến du lịch và danh sách"}
                {activeTab === "posts" && "Quản lý bài viết cộng đồng và nội dung"}
                {activeTab === "reports" && "Xem xét và xử lý các báo cáo từ người dùng"}
              </p>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
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
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Trường đại học</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Ngày tham gia</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Trạng thái</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentUsers.map((user) => (
                          <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-all">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                <span className="font-semibold">{user.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{user.email}</td>
                            <td className="py-3 px-4 text-sm">{user.university}</td>
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
                            <td className="py-3 px-4">
                              <button className="p-1 hover:bg-muted rounded transition-all">
                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="space-y-6">
                {/* Search & Filter */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Tìm người dùng..."
                        className="w-full pl-10 pr-4 py-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                    <button className="px-6 py-3 bg-muted rounded-xl flex items-center gap-2 hover:bg-muted/80 transition-all">
                      <Filter className="w-5 h-5" />
                      <span>Bộ lọc</span>
                    </button>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Người dùng</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Email</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Trường đại học</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Ngày tham gia</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Trạng thái</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentUsers.map((user) => (
                          <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-all">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                <span className="font-semibold">{user.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{user.email}</td>
                            <td className="py-3 px-4 text-sm">{user.university}</td>
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
                      </tbody>
                    </table>
                  </div>
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
                        className="w-full pl-10 pr-4 py-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all">
                      Thêm điểm đến
                    </button>
                  </div>
                </div>

                {/* Destinations Table */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Điểm đến</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Danh mục</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Người dùng</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Ngân sách TB</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Trạng thái</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {destinations.map((dest) => (
                          <tr key={dest.id} className="border-b border-border hover:bg-muted/50 transition-all">
                            <td className="py-3 px-4 font-semibold">{dest.name}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                                {dest.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{dest.users}</td>
                            <td className="py-3 px-4 text-sm font-semibold text-primary">{dest.avgBudget}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                {dest.status}
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
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === "reports" && (
              <div className="space-y-6">
                {/* Filter Tabs */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex gap-2 overflow-x-auto">
                    {["Tất cả báo cáo", "Đang chờ", "Đang xem xét", "Đã giải quyết"].map((tab) => (
                      <button
                        key={tab}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                          tab === "Tất cả báo cáo"
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
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Loại</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Người báo cáo</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Đối tượng</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Ngày</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Trạng thái</th>
                          <th className="text-left py-3 px-4 text-sm text-muted-foreground">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((report) => (
                          <tr key={report.id} className="border-b border-border hover:bg-muted/50 transition-all">
                            <td className="py-3 px-4 font-semibold">{report.type}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{report.reporter}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{report.target}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{report.date}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                report.status === "đang chờ"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : report.status === "đang xem xét"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                              }`}>
                                {report.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button className="px-4 py-2 bg-primary text-white rounded-lg text-xs hover:shadow-lg transition-all">
                                  Kiểm duyệt
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
