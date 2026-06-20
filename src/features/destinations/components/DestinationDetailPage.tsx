import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import { getDestinationDetails } from "@/api/destinationsApi";
import { createItinerary } from "@/api/itinerariesApi";
import { todayISO, isTodayOrFuture, isAfter } from "@/utils/dateValidation";
import type { DestinationDto } from "@/types/destinations";
import {
  Heart,
  Share2,
  MapPin,
  CloudSun,
  DollarSign,
  Utensils,
  Hotel,
  Bus,
  Sparkles,
  Calendar,
  Star,
  ArrowRight,
  Coffee,
  ShoppingBag,
  Camera
} from "lucide-react";

export function DestinationDetailPage() {
  const { id } = useParams();
  const [savedDestination, setSavedDestination] = useState(false);
  const [realDestination, setRealDestination] = useState<DestinationDto | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      getDestinationDetails(Number(id)).then(setRealDestination).catch(console.error);
    }
  }, [id]);

  const aiRecommendations = JSON.parse(localStorage.getItem("ai_recommendations") || "[]");
  const aiMatch = aiRecommendations.find((rec: any) => rec.id.toString() === id);

  const destination = {
    name: realDestination ? `${realDestination.name}, ${realDestination.cityProvince}` : (aiMatch ? aiMatch.destination : "Bali, Indonesia"),
    country: "Việt Nam",
    rating: 4.8,
    reviews: 2847,
    description: realDestination?.description || "Một thiên đường nhiệt đới với những bãi biển tuyệt đẹp, những ngôi đền cổ kính, những thửa ruộng bậc thang xanh mướt và nền văn hóa sôi động. Hoàn hảo cho những sinh viên du lịch tiết kiệm đang tìm kiếm cả sự phiêu lưu và thư giãn.",
    images: [
      aiMatch ? aiMatch.image : "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200",
      "https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=1200",
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1200",
    ],
  };

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [weatherForecast, setWeatherForecast] = useState<any[]>([]);

  const handleSaveForLater = async () => {
    if (!startDate || !endDate) {
      toast.error("Vui lòng chọn ngày đi và ngày về trước khi lưu!");
      return;
    }
    if (!isTodayOrFuture(startDate)) {
      toast.error("Ngày đi phải là ngày trong tương lai. Vui lòng chọn lại!");
      return;
    }
    if (!isAfter(endDate, startDate)) {
      toast.error("Ngày về phải sau ngày đi. Vui lòng chọn lại!");
      return;
    }

    setIsSaving(true);
    try {
      await createItinerary({
        tripName: `Chuyến đi tới ${destination.name}`,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        totalBudgetEstimatedVND: aiMatch?.estimatedCostValue || realDestination?.estimatedBaseCostVND || 11500000,
        details: realDestination ? [{
          destinationID: realDestination.destinationID,
          dayNumber: 1,
          activityDescription: "Tham quan tự do",
          estimatedCostVND: 500000
        }] : undefined
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save itinerary:", error);
      toast.error("Có lỗi xảy ra khi lưu lịch trình. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  // Function to generate mock weather based on selected dates
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      const conditions = [
        { icon: CloudSun, condition: "Nắng nhẹ", tempOffset: 0 },
        { icon: CloudSun, condition: "Nhiều mây", tempOffset: -2 },
        { icon: CloudSun, condition: "Trời quang", tempOffset: +1 },
        { icon: CloudSun, condition: "Có mưa rào", tempOffset: -3 },
      ];

      const forecast = [];
      const numDays = Math.min(diffDays, 5); // limit to 5 days
      for (let i = 0; i < numDays; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        const dayStr = currentDate.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' });
        
        // Use a seeded random based on date to keep it stable
        const seed = currentDate.getDate() + (realDestination?.destinationID || 0);
        const condIndex = seed % conditions.length;
        const baseTemp = 28;
        
        forecast.push({
          day: dayStr,
          temp: `${baseTemp + conditions[condIndex].tempOffset}°C`,
          icon: conditions[condIndex].icon,
          condition: conditions[condIndex].condition
        });
      }
      setWeatherForecast(forecast);
    } else {
      setWeatherForecast([]);
    }
  }, [startDate, endDate, realDestination]);

  const expenses = aiMatch?.dailyCostBreakdown ? [
    { category: "Chỗ ở", icon: Hotel, daily: aiMatch.dailyCostBreakdown.accommodation, description: "Từ phòng dorm đến khách sạn bình dân" },
    { category: "Ăn uống", icon: Utensils, daily: aiMatch.dailyCostBreakdown.food, description: "Từ ẩm thực đường phố đến nhà hàng" },
    { category: "Di chuyển", icon: Bus, daily: aiMatch.dailyCostBreakdown.transportation, description: "Thuê xe máy hoặc phương tiện địa phương" },
    { category: "Hoạt động", icon: Camera, daily: aiMatch.dailyCostBreakdown.activities, description: "Tham quan, tour du lịch" },
    { category: "Giải trí", icon: Coffee, daily: aiMatch.dailyCostBreakdown.entertainment, description: "Giải trí về đêm, sự kiện" },
    { category: "Mua sắm", icon: ShoppingBag, daily: aiMatch.dailyCostBreakdown.shopping, description: "Quà lưu niệm và chợ địa phương" },
  ] : [
    { category: "Chỗ ở", icon: Hotel, daily: "300.000đ - 700.000đ", description: "Từ phòng dorm đến khách sạn bình dân" },
    { category: "Ăn uống", icon: Utensils, daily: "200.000đ - 500.000đ", description: "Từ ẩm thực đường phố đến nhà hàng" },
    { category: "Di chuyển", icon: Bus, daily: "100.000đ - 250.000đ", description: "Thuê xe máy hoặc phương tiện địa phương" },
    { category: "Hoạt động", icon: Camera, daily: "200.000đ - 600.000đ", description: "Tham quan đền chùa, tour, thể thao dưới nước" },
    { category: "Giải trí", icon: Coffee, daily: "100.000đ - 350.000đ", description: "Quán cafe, cuộc sống về đêm, beach clubs" },
    { category: "Mua sắm", icon: ShoppingBag, daily: "200.000đ - 500.000đ", description: "Quà lưu niệm và chợ địa phương" },
  ];

  const attractions = [
    {
      name: "Đền Uluwatu",
      image: "https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=400",
      distance: "25km",
      price: "75.000đ",
      rating: 4.9,
    },
    {
      name: "Ruộng bậc thang Tegalalang",
      image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400",
      distance: "18km",
      price: "50.000đ",
      rating: 4.7,
    },
    {
      name: "Rừng khỉ Sacred",
      image: "https://images.unsplash.com/photo-1558862107-d49ef2a04d72?w=400",
      distance: "12km",
      price: "120.000đ",
      rating: 4.6,
    },
    {
      name: "Bãi biển Seminyak",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
      distance: "8km",
      price: "Miễn phí",
      rating: 4.8,
    },
  ];

  const aiTips = [
    {
      title: "Thời điểm tham quan tốt nhất",
      content: "Từ tháng 4 đến tháng 10 có thời tiết đẹp nhất với lượng mưa tối thiểu. Tránh mùa cao điểm (tháng 7-8) để có giá tốt hơn.",
    },
    {
      title: "Mẹo tiết kiệm tiền",
      content: "Thuê xe máy với giá khoảng 150k/ngày thay vì đi taxi. Ăn tại các quán ăn địa phương (warungs) để có bữa ăn ngon dưới 60k.",
    },
    {
      title: "Ưu đãi sinh viên",
      content: "Nhiều điểm tham quan có giảm giá cho sinh viên. Hãy mang theo thẻ sinh viên và hỏi tại quầy vé.",
    },
    {
      title: "An toàn & Sức khỏe",
      content: "Chỉ nên uống nước đóng chai. Chú ý giao thông xe máy. Nên mua bảo hiểm du lịch cho các hoạt động phiêu lưu.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative">
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
            <div className="col-span-4 md:col-span-2 md:row-span-2">
              <img
                src={destination.images[0]}
                alt={destination.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {destination.images.slice(1, 5).map((image, index) => (
              <div key={index} className="hidden md:block overflow-hidden relative group">
                <img
                  src={image}
                  alt={`${destination.name} ${index + 2}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Optional overlay effect */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            ))}
          </div>

          {/* Floating Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="p-3 bg-card/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-card hover:scale-105 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSavedDestination(!savedDestination)}
              className={`p-3 rounded-full shadow-lg hover:scale-105 transition-all ${
                savedDestination
                  ? "bg-red-500 text-white"
                  : "bg-card/90 backdrop-blur-sm hover:bg-card"
              }`}
            >
              <Heart className={`w-5 h-5 ${savedDestination ? "fill-white" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span>{destination.country}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{destination.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{destination.rating}</span>
                  <span className="text-muted-foreground">({destination.reviews} đánh giá)</span>
                </div>
              </div>
              <p className="text-lg text-muted-foreground">{destination.description}</p>
            </div>

            {/* Weather Forecast */}
            <div className="bg-card rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Dự báo thời tiết 5 ngày tới</h3>
              {weatherForecast.length > 0 ? (
                <div className="grid grid-cols-5 gap-4">
                  {weatherForecast.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-sm text-muted-foreground mb-2">{day.day}</div>
                      <day.icon className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                      <div className="font-semibold">{day.temp}</div>
                      <div className="text-xs text-muted-foreground mt-1">{day.condition}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-6 bg-muted/30 rounded-xl">
                  <CloudSun className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p>Vui lòng chọn ngày đi và ngày về ở cột bên phải để xem dự báo thời tiết.</p>
                </div>
              )}
            </div>

            {/* Expense Breakdown */}
            <div className="bg-card rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Chi phí dự kiến hàng ngày</h3>
                {aiMatch && (
                  <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3"/> Đề xuất bởi AI
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {expenses.map((expense, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <expense.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{expense.category}</h4>
                        <div className="font-semibold text-primary">{expense.daily}/ngày</div>
                      </div>
                      <p className="text-sm text-muted-foreground">{expense.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Được phân tích tự động dựa trên sở thích của bạn</span>
                </div>
              </div>
            </div>

            {/* Nearby Attractions */}
            <div className="bg-card rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6">Các điểm tham quan lân cận</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attractions.map((attraction, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-xl">
                    <div className="aspect-video relative">
                      <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="font-semibold text-white mb-2">{attraction.name}</h4>
                        <div className="flex items-center justify-between text-sm text-white/90">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {attraction.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {attraction.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {attraction.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Travel Tips */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">{aiMatch ? "Tại sao AI đề xuất địa điểm này?" : "Lời khuyên du lịch từ AI"}</h3>
              </div>
              
              {aiMatch && (
                <div className="mb-6 p-4 bg-card/60 dark:bg-black/20 rounded-xl border border-primary/20 shadow-inner">
                  <p className="text-foreground leading-relaxed text-lg">
                    <strong className="text-primary flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4"/> Đánh giá từ AI:</strong> 
                    {aiMatch.reasons[0]}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiTips.map((tip, index) => (
                  <div key={index} className="bg-card/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4">
                    <h4 className="font-semibold mb-2">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground">{tip.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* Booking Card */}
              <div className="bg-card rounded-2xl shadow-lg p-6">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {aiMatch?.estimatedCost || (realDestination?.estimatedBaseCostVND ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(realDestination.estimatedBaseCostVND) : "11.500.000đ")}
                  </div>
                  <div className="text-sm text-muted-foreground">Tổng chi phí ước tính</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm mb-2 block font-medium">Ngày đi</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={startDate}
                        min={todayISO()}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all text-sm appearance-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm mb-2 block font-medium">Ngày về</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || todayISO()}
                        className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all text-sm appearance-none"
                      />
                    </div>
                  </div>
                </div>

                <Link
                  to={`/itinerary/${id || 1}`}
                  state={{
                    days: startDate && endDate 
                      ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1) 
                      : undefined
                  }}
                  className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-3"
                >
                  <span>Tạo lịch trình</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button 
                  onClick={handleSaveForLater}
                  disabled={isSaving || isSaved}
                  className={`w-full py-3 border-2 rounded-xl transition-all font-semibold ${
                    isSaved 
                      ? "border-green-500 text-green-500 bg-green-50" 
                      : "border-border hover:border-primary hover:text-primary"
                  }`}
                >
                  {isSaving ? "Đang lưu..." : isSaved ? "Đã lưu vào Hồ sơ!" : "Lưu lại để xem sau"}
                </button>
              </div>

              {/* Quick Facts */}
              <div className="bg-card rounded-2xl shadow-lg p-6">
                <h4 className="font-semibold mb-4">Thông tin nhanh</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tiền tệ</span>
                    <span className="font-semibold">VND (Việt Nam Đồng)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Ngôn ngữ</span>
                    <span className="font-semibold">Tiếng Việt</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Múi giờ</span>
                    <span className="font-semibold">GMT+7</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Visa</span>
                    <span className="font-semibold">Không yêu cầu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
