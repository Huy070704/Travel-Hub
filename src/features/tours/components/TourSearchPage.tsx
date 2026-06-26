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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  // GIỮ GIAO DIỆN CŨ - ĐỔI LOGIC: Chuyển từ mảng string[] thành string duy nhất
  const [selectedPrice, setSelectedPrice] = useState<string>("Tất cả");
  const [selectedDuration, setSelectedDuration] = useState<string>("Tất cả");
  const [sortOption, setSortOption] = useState("Giá thấp đến cao");

  const destination = searchParams.get("destination") || "";
  const departureDate = searchParams.get("date") || "";
  const departureLocation = searchParams.get("from") || "";

  // Reset page when search params change
  useEffect(() => {
    setPage(1);
  }, [destination, departureDate, departureLocation]);

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const results = await searchTours(destination, departureLocation, departureDate, page, pageSize);
        setTours(results.data);
        setTotalPages(results.totalPages);
      } catch (error) {
        console.error("Failed to fetch tours", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, [destination, departureDate, departureLocation, page]);

  // Cập nhật logic filter theo giá trị đơn lẻ
  const filteredTours = tours.filter(tour => {
    let priceMatch = true;
    if (selectedPrice !== "Tất cả") {
      if (selectedPrice === "Dưới 5 triệu") priceMatch = tour.priceVND < 5000000;
      if (selectedPrice === "5 - 10 triệu") priceMatch = tour.priceVND >= 5000000 && tour.priceVND <= 10000000;
      if (selectedPrice === "10 - 20 triệu") priceMatch = tour.priceVND > 10000000 && tour.priceVND <= 20000000;
      if (selectedPrice === "Trên 20 triệu") priceMatch = tour.priceVND > 20000000;
    }

    let durationMatch = true;
    if (selectedDuration !== "Tất cả") {
      const d = tour.durationDays;
      if (selectedDuration === "1-3 ngày") durationMatch = d >= 1 && d <= 3;
      if (selectedDuration === "4-7 ngày") durationMatch = d >= 4 && d <= 7;
      if (selectedDuration === "Trên 7 ngày") durationMatch = d > 7;
    }

    return priceMatch && durationMatch;
  });

  const sortedTours = [...filteredTours].sort((a, b) => {
    if (sortOption === "Giá thấp đến cao") return a.priceVND - b.priceVND;
    if (sortOption === "Giá cao đến thấp") return b.priceVND - a.priceVND;
    if (sortOption === "Đánh giá cao nhất") return (b.numberOfBookings || 0) - (a.numberOfBookings || 0);
    return 0;
  });

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
        
        {/* Search Bar at the top */}
        <div className="mb-10 -mt-20 relative z-50">
          <TourSearchBar />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar - GIỮ NGUYÊN GIAO DIỆN GỐC CHỈ ĐỔI LOGIC CHỌN 1 */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="glass p-6 rounded-2xl sticky top-24">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Bộ lọc</h3>
              </div>
              
              <div className="space-y-6">
                {/* Mức giá (Giao diện cũ dạng hàng ngang nhưng chỉ chọn 1) */}
                <div>
                  <h4 className="font-semibold mb-3">Mức giá</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Tất cả", "Dưới 5 triệu", "5 - 10 triệu", "10 - 20 triệu", "Trên 20 triệu"].map((price, i) => {
                      const isSelected = selectedPrice === price;
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedPrice(price)}
                          className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all duration-200 border ${
                            isSelected 
                              ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 font-semibold" 
                              : "bg-background hover:bg-muted border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {price}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Thời gian (Giao diện cũ dạng hàng ngang nhưng chỉ chọn 1) */}
                <div>
                  <h4 className="font-semibold mb-3">Thời gian</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Tất cả", "1-3 ngày", "4-7 ngày", "Trên 7 ngày"].map((duration, i) => {
                      const isSelected = selectedDuration === duration;
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedDuration(duration)}
                          className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all duration-200 border ${
                            isSelected 
                              ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 font-semibold" 
                              : "bg-background hover:bg-muted border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {duration}
                        </button>
                      );
                    })}
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
                <p className="text-muted-foreground text-sm">Tìm thấy {sortedTours.length} tours phù hợp</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sắp xếp:</span>
                <select 
                  className="bg-transparent border border-border rounded-lg px-3 py-1.5 text-sm font-medium outline-none cursor-pointer hover:bg-muted/50"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
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
            ) : sortedTours.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Không tìm thấy tour nào</h3>
                <p className="text-muted-foreground">Hãy thử thay đổi điều kiện tìm kiếm hoặc chọn điểm đến khác.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedTours.map((tour) => (
                  <Link 
                    key={tour.tourID} 
                    to={`/tours/${tour.tourID}`} 
                    className="glass rounded-2xl overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full hover:-translate-y-1 cursor-pointer block"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={tour.imageUrl?.split(',')[0] || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"} 
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
                          <span>Thời gian: <span className="font-medium text-foreground">{tour.durationText || `${tour.durationDays} ngày ${tour.durationDays - 1} đêm`}</span></span>
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

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center mt-10 gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setPage(Math.max(1, page - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={page === 1}
                  className="px-4 py-2 border border-border rounded-lg bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Trước
                </button>
                <div className="flex items-center gap-1 flex-wrap">
                  {(() => {
                    const getVisiblePages = (current: number, total: number) => {
                      if (total <= 7) return Array.from({ length: total }).map((_, i) => i + 1);
                      if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
                      if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
                      return [1, "...", current - 1, current, current + 1, "...", total];
                    };

                    return getVisiblePages(page, totalPages).map((p, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (p !== "...") {
                            setPage(p as number);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }}
                        disabled={p === "..."}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${
                          p === "..." ? "cursor-default text-muted-foreground" :
                          page === p
                            ? "bg-primary text-white"
                            : "border border-border bg-background hover:bg-muted text-foreground"
                        }`}
                      >
                        {p}
                      </button>
                    ));
                  })()}
                </div>
                <button
                  onClick={() => {
                    setPage(Math.min(totalPages, page + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-border rounded-lg bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}