import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { MapPin, Calendar, Clock, DollarSign, Filter, Loader2, Star, Users, Zap, ChevronRight, Compass } from "lucide-react";
import { searchTours } from "@/api/toursApi";
import type { TourResponse } from "@/types/tours";
import { TourSearchBar } from "./TourSearchBar";
import { FloatingBlob } from "../../../components/shared/AnimatedBackground";

export function TourSearchPage() {
  const [searchParams] = useSearchParams();
  const [tours, setTours] = useState<TourResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const destination = searchParams.get("destination") || "";
  const departureDate = searchParams.get("date") || "";
  const departureLocation = searchParams.get("from") || "";

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const results = await searchTours(destination, departureLocation, departureDate);
        setTours(results);
      } catch (error) {
        console.error("Failed to fetch tours", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, [destination, departureDate, departureLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-cyan-50/30 to-background relative overflow-hidden">
      {/* Animated Background */}
      <FloatingBlob
        delay={0}
        className="w-[500px] h-[500px] bg-gradient-to-br from-blue-500/20 to-cyan-500/20 top-0 right-0"
      />
      <FloatingBlob
        delay={2}
        className="w-[420px] h-[420px] bg-gradient-to-br from-teal-500/20 to-emerald-500/20 bottom-0 left-0"
      />

      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary via-secondary to-cyan-500 text-white pt-28 pb-14 animate-gradient overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.12),transparent_32%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm text-sm font-semibold mb-5 mx-auto">
            <Compass className="w-4 h-4" />
            <span>Khám phá thế giới</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-normal mb-4">Tìm Tour Du Lịch Yêu Thích</h1>
          <p className="text-white/90 max-w-2xl mx-auto text-lg">
            Hàng ngàn điểm đến tuyệt vời đang chờ đón bạn. Hãy chọn nơi bạn muốn đến!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Search Bar at the top, pulled up into the header slightly */}
        <div className="mb-10 -mt-20 relative z-50">
          <TourSearchBar />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="glass p-6 rounded-2xl sticky top-24">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Bộ lọc</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Mức giá</h4>
                  <div className="space-y-2">
                    {["Dưới 5 triệu", "5 - 10 triệu", "10 - 20 triệu", "Trên 20 triệu"].map((price, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                        <span className="text-sm">{price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Thời gian</h4>
                  <div className="space-y-2">
                    {["1-3 ngày", "4-7 ngày", "Trên 7 ngày"].map((duration, i) => (
                      <label key={i} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                        <span className="text-sm">{duration}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {destination ? `Tour du lịch ${destination}` : "Tất cả các Tour"}
                </h2>
                <p className="text-muted-foreground text-sm">Tìm thấy {tours.length} tours phù hợp</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sắp xếp:</span>
                <select className="bg-transparent border border-border rounded-lg px-3 py-1.5 text-sm font-medium outline-none">
                  <option>Giá thấp đến cao</option>
                  <option>Giá cao đến thấp</option>
                  <option>Đánh giá cao nhất</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p>Đang tìm kiếm tour phù hợp...</p>
              </div>
            ) : tours.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Không tìm thấy tour nào</h3>
                <p className="text-muted-foreground">Hãy thử thay đổi điều kiện tìm kiếm hoặc chọn điểm đến khác.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <Link key={tour.tourID} to={`/tours/${tour.tourID}`} className="glass rounded-2xl overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full hover:-translate-y-1 cursor-pointer block">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={tour.imageUrl || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"} 
                        alt={tour.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-current" /> Đang hot
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md text-white text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        4.9 (120)
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                        <MapPin className="w-3 h-3" /> {tour.destination}
                      </div>
                      
                      <h3 className="font-bold text-lg mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {tour.title}
                      </h3>
                      
                      <div className="space-y-2 mb-4 mt-auto">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" /> 
                          <span>Khởi hành: <span className="font-medium text-foreground">{new Date(tour.departureDate).toLocaleDateString('vi-VN')}</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" /> 
                          <span>Thời gian: <span className="font-medium text-foreground">{tour.durationDays} ngày {tour.durationDays - 1} đêm</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" /> 
                          <span>Từ: <span className="font-medium text-foreground">{tour.departureLocation}</span></span>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-border flex items-center justify-between mt-auto">
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Giá chỉ từ</p>
                          <p className="text-xl font-bold text-orange-500 flex items-center">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.priceVND)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                           <div className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 flex items-center gap-1">
                             <Users className="w-3 h-3" /> {tour.numberOfBookings} khách đặt trong 24h
                           </div>
                           <button className="bg-primary hover:bg-primary/90 text-white p-2 rounded-lg transition-colors">
                             <ChevronRight className="w-5 h-5" />
                           </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
