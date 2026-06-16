import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { getTourDetails, bookTour } from "@/api/toursApi";
import type { TourResponse } from "@/types/tours";
import { useAuth } from "@/contexts/AuthContext";
import {
  Heart,
  Share2,
  MapPin,
  Calendar,
  Clock,
  Star,
  Users,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export function TourDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [tour, setTour] = useState<TourResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedTour, setSavedTour] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [guests, setGuests] = useState(1);
  
  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [formErrors, setFormErrors] = useState<{fullName?: string, phone?: string}>({});

  useEffect(() => {
    if (id) {
      setLoading(true);
      getTourDetails(Number(id))
        .then(setTour)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleBookTour = async () => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để đặt tour.");
      navigate("/auth");
      return;
    }

    const errors: any = {};
    if (!fullName.trim()) errors.fullName = "Vui lòng nhập họ tên";
    if (!phone.trim()) errors.phone = "Vui lòng nhập số điện thoại";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setFormErrors({});
    setIsBooking(true);
    
    try {
      if (tour) {
        await bookTour({
          tourID: tour.tourID,
          tourTitle: tour.title,
          destination: tour.destination,
          imageUrl: tour.imageUrl || "",
          departureDate: tour.departureDate,
          fullName: fullName,
          phone: phone,
          email: email,
          notes: notes,
          guests: guests,
          totalPriceVND: tour.priceVND * guests
        });
        
        setIsBooked(true);
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      }
    } catch (error) {
      console.error("Lỗi đặt tour:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground font-semibold">Đang tải thông tin tour...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy Tour</h2>
          <p className="text-muted-foreground mb-6">Tour này không tồn tại hoặc đã bị gỡ.</p>
          <Link to="/tours/search" className="text-primary hover:underline font-semibold">
            &larr; Quay lại danh sách Tour
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="relative">
          <div className="h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl relative group">
            <img
              src={tour.imageUrl || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"}
              alt={tour.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm">
                  <MapPin className="w-4 h-4" />
                  {tour.destination}
                </span>
                <span className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  4.9 (120 đánh giá)
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight drop-shadow-lg max-w-4xl">
                {tour.title}
              </h1>
            </div>

            {/* Floating Action Buttons */}
            <div className="absolute top-6 right-6 flex gap-3">
              <button className="p-3 bg-white/20 backdrop-blur-md rounded-full shadow-lg hover:bg-white/40 transition-all text-white border border-white/30">
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSavedTour(!savedTour)}
                className={`p-3 backdrop-blur-md rounded-full shadow-lg transition-all border ${
                  savedTour
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white/20 hover:bg-white/40 text-white border-white/30"
                }`}
              >
                <Heart className={`w-5 h-5 ${savedTour ? "fill-white" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <div className="bg-white rounded-3xl shadow-sm border border-border p-8">
              <h3 className="text-2xl font-bold mb-6">Tổng quan chuyến đi</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Thời gian
                  </span>
                  <span className="font-semibold text-lg">{tour.durationDays} ngày {tour.durationDays - 1 > 0 ? tour.durationDays - 1 : 0} đêm</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Khởi hành từ
                  </span>
                  <span className="font-semibold text-lg">{tour.departureLocation}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Ngày đi
                  </span>
                  <span className="font-semibold text-lg">{new Date(tour.departureDate).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm flex items-center gap-1">
                    <Users className="w-4 h-4" /> Đã đặt
                  </span>
                  <span className="font-semibold text-lg">{tour.numberOfBookings} khách</span>
                </div>
              </div>

              <div className="prose max-w-none text-muted-foreground text-lg leading-relaxed">
                <p>{tour.description || "Hãy tham gia chuyến hành trình tuyệt vời này để khám phá những nét đẹp văn hóa, ẩm thực và cảnh quan đặc sắc. Tour được thiết kế dành riêng cho bạn với sự thoải mái và trải nghiệm được ưu tiên hàng đầu."}</p>
                <p className="mt-4">Lịch trình chi tiết và các điểm tham quan nổi bật sẽ được hướng dẫn viên giới thiệu trên suốt chặng đường. Đừng bỏ lỡ cơ hội tạo ra những kỷ niệm khó quên!</p>
              </div>
            </div>

            {/* Includes / Excludes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50/50 rounded-3xl p-8 border border-green-100">
                <h4 className="font-bold text-lg mb-4 text-green-800">Dịch vụ bao gồm</h4>
                <ul className="space-y-3">
                  {[
                    "Khách sạn tiêu chuẩn 4 sao",
                    "Vé máy bay khứ hồi (nếu có)",
                    "Các bữa ăn theo chương trình",
                    "Hướng dẫn viên nhiệt tình",
                    "Bảo hiểm du lịch",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-green-700/80">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50/50 rounded-3xl p-8 border border-red-100">
                <h4 className="font-bold text-lg mb-4 text-red-800">Không bao gồm</h4>
                <ul className="space-y-3">
                  {[
                    "Chi phí mua sắm cá nhân",
                    "Phí làm hộ chiếu/visa (nếu có)",
                    "Tiền tips cho HDV và tài xế",
                    "Các chi phí phát sinh ngoài chương trình",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-red-700/80">
                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-3xl shadow-xl border border-border p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />
                
                <div className="mb-6">
                  <p className="text-muted-foreground font-medium mb-1">Giá Tour trọn gói</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-extrabold text-primary">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.priceVND)}
                    </span>
                    <span className="text-muted-foreground pb-1">/ khách</span>
                  </div>
                </div>

                <div className="space-y-5 mb-8">
                  <div className="p-4 bg-muted/50 rounded-2xl border border-border/50">
                    <label className="text-sm text-muted-foreground mb-1 block">Ngày đi (Cố định)</label>
                    <div className="font-bold text-foreground">
                      {new Date(tour.departureDate).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-2xl border border-border/50">
                    <label className="text-sm text-muted-foreground mb-2 block">Số lượng khách</label>
                    <div className="flex items-center justify-between bg-white rounded-xl p-1 border border-border">
                      <button 
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                      >
                        -
                      </button>
                      <span className="font-bold text-lg w-12 text-center">{guests}</span>
                      <button 
                        onClick={() => setGuests(Math.min(10, guests + 1))}
                        className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-border font-bold text-lg mb-6">
                    <span>Tổng tiền</span>
                    <span className="text-primary text-xl">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.priceVND * guests)}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6 pt-4 border-t border-border">
                    <p className="font-semibold text-sm text-foreground">Thông tin liên hệ</p>
                    
                    <div>
                      <input 
                        type="text" 
                        placeholder="Họ và tên *" 
                        className={`w-full px-4 py-2.5 bg-muted/30 text-foreground rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm ${formErrors.fullName ? 'border-red-500' : 'border-border/60'}`}
                        value={fullName}
                        onChange={e => { setFullName(e.target.value); if(formErrors.fullName) setFormErrors({...formErrors, fullName: undefined}) }}
                      />
                      {formErrors.fullName && <p className="text-red-500 text-xs mt-1 ml-1">{formErrors.fullName}</p>}
                    </div>

                    <div>
                      <input 
                        type="tel" 
                        placeholder="Số điện thoại *" 
                        className={`w-full px-4 py-2.5 bg-muted/30 text-foreground rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm ${formErrors.phone ? 'border-red-500' : 'border-border/60'}`}
                        value={phone}
                        onChange={e => { setPhone(e.target.value); if(formErrors.phone) setFormErrors({...formErrors, phone: undefined}) }}
                      />
                      {formErrors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{formErrors.phone}</p>}
                    </div>

                    <div>
                      <input 
                        type="email" 
                        placeholder="Email (Tùy chọn)" 
                        className="w-full px-4 py-2.5 bg-muted/30 text-foreground rounded-xl border border-border/60 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>

                    <div>
                      <textarea 
                        placeholder="Ghi chú thêm (Tùy chọn)" 
                        rows={2}
                        className="w-full px-4 py-2.5 bg-muted/30 text-foreground rounded-xl border border-border/60 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {isBooked ? (
                  <div className="w-full py-4 bg-green-500 text-white rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-green-500/25">
                    <CheckCircle2 className="w-6 h-6" />
                    <span>Đặt Tour Thành Công!</span>
                  </div>
                ) : (
                  <button 
                    onClick={handleBookTour}
                    disabled={isBooking}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 font-bold text-lg flex items-center justify-center gap-2"
                  >
                    {isBooking ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      "Đặt Tour Ngay"
                    )}
                  </button>
                )}
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Chưa trừ tiền ngay. Bạn có thể kiểm tra lại thông tin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
