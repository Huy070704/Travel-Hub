import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { getDestinationDetails } from "@/api/destinationsApi";
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

  const weather = [
    { day: "Thứ 2", temp: "28°C", icon: CloudSun, condition: "Nắng" },
    { day: "Thứ 3", temp: "29°C", icon: CloudSun, condition: "Nắng" },
    { day: "Thứ 4", temp: "27°C", icon: CloudSun, condition: "Nhiều mây" },
    { day: "Thứ 5", temp: "28°C", icon: CloudSun, condition: "Nắng" },
    { day: "Thứ 6", temp: "30°C", icon: CloudSun, condition: "Nóng" },
  ];

  const expenses = [
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
            <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-105 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSavedDestination(!savedDestination)}
              className={`p-3 rounded-full shadow-lg hover:scale-105 transition-all ${
                savedDestination
                  ? "bg-red-500 text-white"
                  : "bg-white/90 backdrop-blur-sm hover:bg-white"
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
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Dự báo thời tiết 5 ngày tới</h3>
              <div className="grid grid-cols-5 gap-4">
                {weather.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">{day.day}</div>
                    <day.icon className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                    <div className="font-semibold">{day.temp}</div>
                    <div className="text-xs text-muted-foreground mt-1">{day.condition}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Chi phí dự kiến hàng ngày</h3>
                <div className="text-2xl font-bold text-primary">1.100.000đ - 2.800.000đ</div>
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
                  <span className="font-semibold">Tổng trung bình hàng ngày</span>
                  <span className="text-xl font-bold text-primary">1.100.000đ - 2.800.000đ</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Cho chuyến đi 7 ngày: <span className="font-semibold">~7.700.000đ - 19.600.000đ tổng cộng</span>
                </p>
              </div>
            </div>

            {/* Nearby Attractions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
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
                <div className="mb-6 p-4 bg-white/60 dark:bg-black/20 rounded-xl border border-primary/20 shadow-inner">
                  <p className="text-foreground leading-relaxed text-lg">
                    <strong className="text-primary flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4"/> Đánh giá từ AI:</strong> 
                    {aiMatch.reasons[0]}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiTips.map((tip, index) => (
                  <div key={index} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4">
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
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-primary mb-1">11.500.000đ</div>
                  <div className="text-sm text-muted-foreground">Tổng chi phí ước tính (7 ngày)</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm mb-2 block">Ngày đi</label>
                    <div className="flex items-center gap-2 px-4 py-3 bg-muted rounded-xl">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Chọn ngày</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm mb-2 block">Ngày về</label>
                    <div className="flex items-center gap-2 px-4 py-3 bg-muted rounded-xl">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Chọn ngày</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/itinerary/${id || 1}`}
                  className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-3"
                >
                  <span>Tạo lịch trình</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button className="w-full py-3 border-2 border-border rounded-xl hover:border-primary hover:text-primary transition-all">
                  Lưu lại để xem sau
                </button>
              </div>

              {/* Quick Facts */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
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
