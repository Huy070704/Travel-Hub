import { useEffect, useState } from "react";
import { getAdminOverview } from "@/api/adminApi";
import { Users, MapPin, MessageSquare, DollarSign, TrendingUp } from "lucide-react";
import { LineChart, Line, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getFileUrl } from "../../lib/getFileUrl";

export function OverviewTab() {
  const [overviewData, setOverviewData] = useState<any>(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);

  useEffect(() => {
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
    fetchOverviewData();
  }, []);

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
                    {destinationData.map((entry: any, index: number) => (
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
  );
}
