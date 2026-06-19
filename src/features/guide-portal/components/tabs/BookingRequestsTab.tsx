import { useState } from "react";
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
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function BookingRequestsTab() {
  const [activeSubTab, setActiveSubTab] = useState<"pending" | "confirmed" | "completed" | "cancelled">("pending");

  const pendingBookings = [
    {
      id: "BR-9281",
      customer: { name: "Michael Chen", avatar: "https://i.pravatar.cc/150?u=mich" },
      tour: "Khám phá Phố Cổ Hà Nội & Ẩm thực đường phố",
      guests: 2,
      bookingDate: "15 Thg 10, 2024",
      note: "Chúng tôi ăn chay, liệu có thể điều chỉnh thực đơn không?",
      paymentStatus: "Đã thanh toán qua thẻ tín dụng",
      amount: "900,000₫"
    },
    {
      id: "BR-9282",
      customer: { name: "Sarah Williams", avatar: "https://i.pravatar.cc/150?u=sarah" },
      tour: "Trekking bản địa Sapa",
      guests: 4,
      bookingDate: "16 Thg 10, 2024",
      note: "",
      paymentStatus: "Đợi thanh toán tiền mặt khi đến",
      amount: "4,800,000₫"
    }
  ];

  const confirmedBookings = [
    {
      id: "BR-9104",
      customer: { name: "David Kim", avatar: "https://i.pravatar.cc/150?u=david", phone: "+84 987 654 321" },
      tour: "Chèo Kayak Khám phá Hang động Vịnh Hạ Long",
      guests: 3,
      meetingDate: "18 Thg 10, 2024",
      meetingTime: "08:00 AM",
      location: "Bến du thuyền Tuần Châu, Cổng 2"
    }
  ];

  const completedBookings = [
    {
      id: "BR-8932",
      customer: { name: "Emma Watson", avatar: "https://i.pravatar.cc/150?u=emma" },
      tour: "Khám phá Phố Cổ Hà Nội & Ẩm thực đường phố",
      dateCompleted: "10 Thg 10, 2024",
      review: "Trải nghiệm tuyệt vời! Hướng dẫn viên rất am hiểu và đồ ăn thì tuyệt hảo.",
      rating: 5
    }
  ];

  const cancelledBookings = [
    {
      id: "BR-8812",
      customer: { name: "John Doe", avatar: "https://i.pravatar.cc/150?u=john" },
      tour: "Trekking bản địa Sapa",
      cancelledDate: "05 Thg 10, 2024",
      reason: "Khách hàng yêu cầu hủy do thay đổi chuyến bay."
    }
  ];

  const subTabs = [
    { id: "pending", label: "Chờ duyệt", count: 2 },
    { id: "confirmed", label: "Đã xác nhận", count: 1 },
    { id: "completed", label: "Đã hoàn thành", count: 12 },
    { id: "cancelled", label: "Đã hủy", count: 3 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yêu cầu đặt chỗ</h1>
        <p className="text-muted-foreground mt-1">Quản lý đặt chỗ và liên lạc với khách hàng.</p>
      </div>

      {/* Sub-Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl font-medium transition-all ${
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

      {/* Tab Content */}
      <div className="mt-6">
        
        {/* PENDING TAB */}
        {activeSubTab === "pending" && (
          <div className="space-y-4">
            {pendingBookings.map((booking) => (
              <div key={booking.id} className="bg-card rounded-2xl p-6 shadow-sm border border-border flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={booking.customer.avatar} alt={booking.customer.name} className="w-12 h-12 rounded-full border border-border" />
                      <div>
                        <h3 className="font-bold text-lg">{booking.customer.name}</h3>
                        <p className="text-xs text-muted-foreground">Mã đặt chỗ: {booking.id}</p>
                      </div>
                    </div>
                    <div className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Cần xử lý
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                    <p className="font-semibold mb-2">{booking.tour}</p>
                    <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Ngày: {booking.bookingDate}</div>
                      <div className="flex items-center gap-2"><Users className="w-4 h-4" /> Khách: {booking.guests}</div>
                      <div className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> Trạng thái: {booking.paymentStatus}</div>
                      <div className="font-semibold text-primary">Tổng: {booking.amount}</div>
                    </div>
                  </div>

                  {booking.note && (
                    <div className="flex gap-3 bg-yellow-50 text-yellow-800 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/50 p-3 rounded-lg text-sm border">
                      <MessageCircle className="w-5 h-5 flex-shrink-0" />
                      <p><span className="font-semibold">Ghi chú từ khách hàng:</span> "{booking.note}"</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 justify-center md:border-l md:border-border md:pl-6 min-w-[200px]">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 py-6 text-base shadow-md shadow-green-600/20">
                    <CheckCircle2 className="w-5 h-5" /> Chấp nhận
                  </Button>
                  <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 gap-2 py-6 text-base">
                    <XCircle className="w-5 h-5" /> Từ chối
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONFIRMED TAB */}
        {activeSubTab === "confirmed" && (
          <div className="space-y-4">
            {confirmedBookings.map((booking) => (
              <div key={booking.id} className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 border-l-4 border-l-green-500 flex flex-col lg:flex-row gap-6 hover:shadow-md transition-shadow">
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tour Info */}
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Chi tiết Tour</h4>
                    <p className="font-bold text-lg leading-tight mb-2">{booking.tour}</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {booking.meetingDate}</div>
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {booking.meetingTime}</div>
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {booking.location}</div>
                    </div>
                  </div>
                  
                  {/* Guest Info */}
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Chi tiết Khách</h4>
                    <div className="flex items-center gap-3 mb-3">
                      <img src={booking.customer.avatar} alt={booking.customer.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-semibold">{booking.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{booking.customer.phone}</p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full text-sm font-medium">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {booking.guests} Tổng số khách
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 justify-center lg:border-l lg:border-border lg:pl-6 min-w-[200px]">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-md shadow-blue-600/20">
                    <MessageCircle className="w-4 h-4" /> Liên hệ qua Zalo
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    Xem chi tiết
                  </Button>
                  <Button variant="ghost" className="w-full text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 mt-2 gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Đánh dấu hoàn thành
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COMPLETED TAB */}
        {activeSubTab === "completed" && (
          <div className="space-y-4">
            {completedBookings.map((booking) => (
              <div key={booking.id} className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 flex flex-col sm:flex-row gap-6">
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Đã hoàn thành
                    </div>
                    <span className="text-xs text-muted-foreground">{booking.dateCompleted}</span>
                  </div>
                  
                  <h3 className="font-bold text-lg">{booking.tour}</h3>
                  
                  <div className="flex items-center gap-3">
                    <img src={booking.customer.avatar} alt={booking.customer.name} className="w-8 h-8 rounded-full" />
                    <span className="text-sm font-medium">{booking.customer.name}</span>
                  </div>
                  
                  {booking.review && (
                    <div className="mt-4 bg-muted/50 p-4 rounded-xl border border-border/50 relative">
                      <div className="flex items-center gap-1 text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < booking.rating ? 'fill-current' : 'text-muted'}`} />
                        ))}
                      </div>
                      <p className="text-sm text-foreground italic">"{booking.review}"</p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col justify-start">
                  <Button variant="outline" size="sm">Xem biên lai</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CANCELLED TAB */}
        {activeSubTab === "cancelled" && (
          <div className="space-y-4">
            {cancelledBookings.map((booking) => (
              <div key={booking.id} className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 opacity-80 flex flex-col sm:flex-row gap-6">
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Đã hủy
                    </div>
                    <span className="text-xs text-muted-foreground">{booking.cancelledDate}</span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-muted-foreground line-through decoration-muted">{booking.tour}</h3>
                  
                  <div className="flex items-center gap-3">
                    <img src={booking.customer.avatar} alt={booking.customer.name} className="w-8 h-8 rounded-full grayscale" />
                    <span className="text-sm font-medium text-muted-foreground">{booking.customer.name}</span>
                  </div>
                  
                  <div className="mt-4 flex gap-2 text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/50">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{booking.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
