import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Star, 
  Users, 
  Inbox, 
  CheckCircle2, 
  XCircle,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function GuideDashboardTab() {
  const stats = [
    { label: "Tour sắp tới tuần này", value: "3", icon: CalendarDays, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Yêu cầu chờ duyệt", value: "5", icon: Inbox, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: "Trải nghiệm đang mở", value: "12", icon: MapPin, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "Đánh giá trung bình", value: "4.9", icon: Star, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
  ];

  const todaysSchedule = [
    {
      id: 1,
      tourName: "Tour ẩm thực Phố Cổ Hà Nội",
      startTime: "18:00",
      endTime: "21:00",
      guests: 4,
      location: "Hồ Hoàn Kiếm, Hà Nội",
      status: "Sắp tới"
    },
    {
      id: 2,
      tourName: "Du thuyền Hạ Long 1 ngày",
      startTime: "08:00",
      endTime: "20:00",
      guests: 12,
      location: "Bến du thuyền Tuần Châu",
      status: "Đang diễn ra"
    }
  ];

  const recentRequests = [
    {
      id: 1,
      customerName: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?u=1",
      tourName: "Khám phá thiên nhiên Ninh Bình",
      guests: 2,
      requestDate: "2 giờ trước"
    },
    {
      id: 2,
      customerName: "Sarah Smith",
      avatar: "https://i.pravatar.cc/150?u=2",
      tourName: "Tour ẩm thực đường phố Hà Nội",
      guests: 5,
      requestDate: "5 giờ trước"
    }
  ];

  const upcomingTours = [
    {
      id: 1,
      tourName: "Trekking Sapa 2 Ngày",
      thumbnail: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=300",
      date: "24 Thg 10, 2024",
      capacity: "Còn 2 chỗ"
    },
    {
      id: 2,
      tourName: "Làm lồng đèn Hội An",
      thumbnail: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=300",
      date: "26 Thg 10, 2024",
      capacity: "Đã đầy"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển</h1>
          <p className="text-muted-foreground mt-1">Đây là những gì đang diễn ra với các tour của bạn hôm nay.</p>
        </div>
        <div className="flex items-center gap-4 bg-card p-2 pr-4 rounded-full shadow-sm border border-border">
          <img src="https://i.pravatar.cc/150?u=guide" alt="Guide Avatar" className="w-10 h-10 rounded-full border-2 border-primary/20" />
          <div>
            <p className="text-sm font-semibold">Chào mừng trở lại, Nguyên!</p>
            <p className="text-xs text-muted-foreground">Hướng dẫn viên Cấp 4</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                <span>+12%</span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Schedule & Upcoming */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Today's Schedule */}
          <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Lịch trình hôm nay</h2>
              <Button variant="outline" size="sm">Xem Lịch</Button>
            </div>
            
            <div className="relative border-l-2 border-muted ml-4 space-y-8 pb-4">
              {todaysSchedule.map((item, i) => (
                <div key={item.id} className="relative pl-6">
                  {/* Timeline dot */}
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-background ${
                    item.status === 'Đang diễn ra' ? 'bg-primary animate-pulse' : 'bg-muted-foreground/30'
                  }`} />
                  
                  <div className="bg-muted/50 rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-bold text-primary">{item.startTime} - {item.endTime}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            item.status === 'Đang diễn ra' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg">{item.tourName}</h3>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{item.guests} Khách</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tours Widget */}
          <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Tour sắp tới</h2>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">Xem tất cả</Button>
            </div>
            
            <div className="space-y-4">
              {upcomingTours.map(tour => (
                <div key={tour.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                  <img src={tour.thumbnail} alt={tour.tourName} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base truncate">{tour.tourName}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4" />
                        <span>{tour.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span className={tour.capacity === 'Đã đầy' ? 'text-orange-500 font-medium' : 'text-green-600 font-medium'}>
                          {tour.capacity}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="secondary" size="icon" className="rounded-full flex-shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Pending Requests */}
        <div className="space-y-8">
          <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Yêu cầu chờ duyệt</h2>
              <div className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 text-xs font-bold px-2 py-1 rounded-full">5 Mới</div>
            </div>

            <div className="space-y-4">
              {recentRequests.map(request => (
                <div key={request.id} className="bg-muted/50 rounded-xl p-4 border border-border/50">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={request.avatar} alt={request.customerName} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-bold text-sm">{request.customerName}</p>
                      <p className="text-xs text-muted-foreground">{request.requestDate}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-medium text-sm line-clamp-1">{request.tourName}</p>
                    <p className="text-xs text-muted-foreground mt-1">{request.guests} Khách</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-1" size="sm">
                      <CheckCircle2 className="w-4 h-4" />
                      Chấp nhận
                    </Button>
                    <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 gap-1" size="sm">
                      <XCircle className="w-4 h-4" />
                      Từ chối
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="ghost" className="w-full mt-4 text-primary" size="sm">
              Xem tất cả yêu cầu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
