import { useState } from "react";
import {
  LayoutDashboard,
  Map,
  CalendarDays,
  Inbox,
  Star,
  Activity,
} from "lucide-react";
import { GuideDashboardTab } from "./tabs/GuideDashboardTab";
import { MyExperiencesTab } from "./tabs/MyExperiencesTab";
import { ManageSchedulesTab } from "./tabs/ManageSchedulesTab";
import { BookingRequestsTab } from "./tabs/BookingRequestsTab";
import { ReviewsRatingsTab } from "./tabs/ReviewsRatingsTab";

type TabType = "dashboard" | "experiences" | "schedules" | "bookings" | "reviews";

export function GuidePortalPage() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  const tabs = [
    { id: "dashboard", label: "Bảng điều khiển", icon: LayoutDashboard },
    { id: "experiences", label: "Trải nghiệm của tôi", icon: Map },
    { id: "schedules", label: "Quản lý lịch trình", icon: CalendarDays },
    { id: "bookings", label: "Yêu cầu đặt chỗ", icon: Inbox },
    { id: "reviews", label: "Đánh giá & Xếp hạng", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border flex-shrink-0 hidden md:block">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Cổng hướng dẫn viên</h2>
                <p className="text-xs text-muted-foreground">TravelHub</p>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.id
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Navigation (Bottom Bar or Top Tabs could be added later for better mobile experience) */}
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-muted/30">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {activeTab === "dashboard" && <GuideDashboardTab />}
            {activeTab === "experiences" && <MyExperiencesTab />}
            {activeTab === "schedules" && <ManageSchedulesTab />}
            {activeTab === "bookings" && <BookingRequestsTab />}
            {activeTab === "reviews" && <ReviewsRatingsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
