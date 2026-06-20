import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Sparkles,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Star,
  Plane,
  MessageCircle,
  Globe,
  Zap,
  Shield,
  Heart,
  Calendar,
  CloudRain,
  Sun,
  Cloud,
  Loader2,
  X
} from "lucide-react";
import { GlowingButton } from "../../../components/shared/GlowingButton";
import { FloatingBlob } from "../../../components/shared/AnimatedBackground";
import { FloatingIllustrations } from "../../../components/shared/FloatingIllustrations";
import { TourSearchBar } from "../../tours/components/TourSearchBar";
import { getTrendingDestinations } from "@/api/destinationsApi";
import { getWeatherForecast } from "@/api/weatherApi";
import { getAiRecommendations } from "../../../api/aiApi";
import type { DestinationDto } from "@/types/destinations";
import type { WeatherForecastDto } from "@/types/weather";
import type { AiRecommendResponse } from "../../../types/ai";

const getPlaceholderImage = (id: number) => {
  const destImages = [
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
    "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=800",
    "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800",
    "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800"
  ];
  return destImages[id % destImages.length];
};

export function LandingPage() {
  const [trendingDestinations, setTrendingDestinations] = useState<DestinationDto[]>([]);
  const [weathers, setWeathers] = useState<Record<number, WeatherForecastDto>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [aiResults, setAiResults] = useState<AiRecommendResponse[] | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dests = await getTrendingDestinations(3);
        setTrendingDestinations(dests);

        const weatherData: Record<number, WeatherForecastDto> = {};
        for (const dest of dests) {
          try {
            const w = await getWeatherForecast(dest.destinationID, 1);
            weatherData[dest.destinationID] = w;
          } catch (e) {
            console.error("Failed to load weather for", dest.name);
          }
        }
        setWeathers(weatherData);
      } catch (error) {
        console.error("Failed to load trending", error);
      }
    };
    loadData();
  }, []);

  const handleAiSearch = async () => {
    if (!searchQuery) return;
    setIsAiLoading(true);
    try {
      const results = await getAiRecommendations({
        budgetVND: 5000000, // Default generic budget
        days: 3, // Default short trip
        interests: searchQuery
      });
      setAiResults(results);
    } catch (error) {
      console.error("Failed to get AI recommendations", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes("rain") || c.includes("storm")) return <CloudRain className="w-4 h-4" />;
    if (c.includes("cloud")) return <Cloud className="w-4 h-4" />;
    return <Sun className="w-4 h-4" />;
  };

  const features = [
    {
      icon: Sparkles,
      title: "Gợi ý cá nhân hóa bằng AI",
      description: "Nhận đề xuất điểm đến theo ngân sách và sở thích của bạn",
      gradient: "from-purple-500 to-blue-500"
    },
    {
      icon: Users,
      title: "Tìm bạn đồng hành",
      description: "Kết nối với sinh viên khác và chia sẻ chi phí cho chuyến đi",
      gradient: "from-cyan-500 to-teal-500"
    },
    {
      icon: DollarSign,
      title: "Thân thiện với ngân sách",
      description: "Khám phá nhiều nơi hơn với các gợi ý tiết kiệm chi phí",
      gradient: "from-orange-500 to-pink-500"
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Blobs — giữ 2 thay vì 3 để nhẹ hơn */}
        <FloatingBlob
          delay={0}
          className="w-[450px] h-[450px] bg-gradient-to-br from-purple-500/25 to-blue-500/25 top-0 left-0"
        />
        <FloatingBlob
          delay={3}
          className="w-[450px] h-[450px] bg-gradient-to-br from-cyan-500/25 to-teal-500/25 bottom-0 right-0"
        />

        <div className="absolute inset-0 -translate-y-10 pointer-events-none">
          <FloatingIllustrations />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10 w-full mt-5">
          <motion.div
            className="text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8 neon-primary"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold gradient-text">Nền tảng du lịch bằng AI</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Travel Smarter
              <br />
              <span className="gradient-text">with AI</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Những chuyến đi vừa túi tiền cho sinh viên. Khám phá điểm đến, kết nối bạn đồng hành và đi xa hơn trong ngân sách của bạn.
            </motion.p>

            {/* Tour Search Box */}
            <motion.div
              className="max-w-5xl mx-auto w-full relative z-50 flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <TourSearchBar />
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 text-xs xl:text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {[
                { icon: Users, label: "50k+ sinh viên" },
                { icon: MapPin, label: "200+ điểm đến" },
                { icon: DollarSign, label: "Tiết kiệm chi phí" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 glass px-3.5 py-1.5 rounded-full select-none"
                  whileHover={{ scale: 1.05 }}
                >
                  <stat.icon className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-muted-foreground hover:text-foreground transition-colors">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 bg-primary rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Vì sao chọn <span className="gradient-text">TravelHub</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Mọi thứ bạn cần cho một chuyến đi sinh viên thật trọn vẹn
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -8 }}
              >
                <div className="glass rounded-2xl p-8 h-full hover:shadow-2xl transition-all">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>

                  {/* Hover Glow */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity -z-10 blur-xl`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Destinations */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center justify-between mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                <span className="text-sm text-accent uppercase tracking-wide font-semibold">Dữ liệu mới</span>
              </div>
              <h2 className="text-4xl font-bold">Điểm đến đang thịnh hành</h2>
            </div>
            <Link to="/discover">
              <motion.button
                className="flex items-center gap-2 text-primary hover:gap-3 transition-all"
                whileHover={{ x: 5 }}
              >
                <span className="font-semibold">Xem tất cả</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trendingDestinations.map((destination, index) => {
              const weather = weathers[destination.destinationID]?.forecasts[0];

              return (
                <motion.div
                  key={destination.destinationID}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/destination/${destination.destinationID}`}>
                    <motion.div
                      className="group relative overflow-hidden rounded-2xl glass hover:shadow-2xl transition-all"
                      whileHover={{ y: -8 }}
                    >
                      <div className="aspect-[4/5] relative overflow-hidden">
                        <motion.img
                          src={getPlaceholderImage(destination.destinationID)}
                          alt={destination.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Weather Badge */}
                        {weather && (
                          <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/40 backdrop-blur-md text-white rounded-xl flex items-center gap-2 border border-white/10">
                            {getWeatherIcon(weather.condition)}
                            <span className="font-semibold text-sm">{weather.temperatureCelsius}°C</span>
                          </div>
                        )}

                        {/* Trending Badge */}
                        <div className="absolute top-4 right-4 px-3 py-1 bg-accent/90 backdrop-blur-sm text-white text-xs rounded-full font-semibold animate-pulse-glow">
                          Đang hot
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-2xl font-bold text-white mb-2">{destination.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <DollarSign className="w-4 h-4" />
                            <span>
                              {destination.estimatedBaseCostVND
                                ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(destination.estimatedBaseCostVND)
                                : "N/A"
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}

            {trendingDestinations.length === 0 && (
              <div className="col-span-3 text-center py-20 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>Đang tải điểm đến...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Community Preview */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-12 md:p-16 relative overflow-hidden">
            {/* Static gradient thay FloatingBlob để tránh thêm animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-6 h-6 text-primary" />
                  <span className="text-sm text-primary uppercase tracking-wide font-semibold">Cộng đồng</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Tìm bạn đồng hành
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Kết nối với sinh viên cùng mê du lịch, chia sẻ kinh nghiệm và chia chi phí cho những chuyến đi đáng nhớ.
                </p>
                <Link to="/community">
                  <GlowingButton>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      <span>Tham gia cộng đồng</span>
                    </div>
                  </GlowingButton>
                </Link>
              </motion.div>

              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                {[
                  { icon: Globe, label: "50k+ thành viên", color: "from-blue-500 to-cyan-500" },
                  { icon: MessageCircle, label: "Trò chuyện sôi nổi", color: "from-purple-500 to-pink-500" },
                  { icon: Heart, label: "Cộng đồng an toàn", color: "from-orange-500 to-red-500" },
                  { icon: Calendar, label: "Hoạt động mỗi ngày", color: "from-green-500 to-teal-500" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="glass rounded-2xl p-6 text-center hover-lift"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-semibold">{item.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Plane className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">TravelHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Nền tảng du lịch bằng AI dành cho sinh viên. Khám phá thế giới theo ngân sách của bạn.
              </p>
            </div>

            {[
              {
                title: "Sản phẩm",
                links: ["Điểm đến", "Gợi ý AI", "Cộng đồng", "Lập lịch trình"]
              },
              {
                title: "Công ty",
                links: ["Về chúng tôi", "Tuyển dụng", "Blog", "Liên hệ"]
              },
              {
                title: "Pháp lý",
                links: ["Quyền riêng tư", "Điều khoản", "Bảo mật", "Hỗ trợ"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 TravelHub. Đã đăng ký bản quyền.
            </p>
            <div className="flex items-center gap-4">
              {[Shield, Globe, Heart].map((Icon, index) => (
                <motion.button
                  key={index}
                  className="p-2 glass rounded-full hover:bg-primary/10 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
