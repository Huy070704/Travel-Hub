import { useState } from "react";
import { Activity } from "lucide-react";
import { DASHBOARD_TABS, type DashboardTabId } from "../lib/constants";
import { OverviewTab } from "./tabs/OverviewTab";
import { UsersTab } from "./tabs/UsersTab";
import { DestinationsTab } from "./tabs/DestinationsTab";
import { BookingsTab } from "./tabs/BookingsTab";
import { GuidesTab } from "./tabs/GuidesTab";
import { ReportsTab } from "./tabs/ReportsTab";

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTabId>("overview");
  const currentTab = DASHBOARD_TABS.find((tab) => tab.id === activeTab);

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
              {DASHBOARD_TABS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
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
              <h1 className="text-3xl font-bold mb-2">{currentTab?.title}</h1>
              <p className="text-muted-foreground">{currentTab?.subtitle}</p>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "users" && <UsersTab />}
            {activeTab === "destinations" && <DestinationsTab />}
            {activeTab === "bookings" && <BookingsTab />}
            {activeTab === "guides" && <GuidesTab />}
            {activeTab === "reports" && <ReportsTab />}
            {/* "posts" tab has no content yet — header only, matching original behavior */}
          </div>
        </div>
      </div>
    </div>
  );
}
