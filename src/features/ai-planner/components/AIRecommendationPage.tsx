import { useState, useRef } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  MapPin,
  DollarSign,
  Calendar,
  Heart,
  Compass,
  Palmtree,
  Mountain,
  Building2,
  Waves,
  ThermometerSun,
  Plane,
  TrendingUp,
  Star,
  Users,
  User,
  Home,
  Search,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { getAiRecommendations } from "../../../api/aiApi";
import { Coins } from 'lucide-react';
import type { AiRecommendRequest } from "../../../types/ai";

type PlannerFormData = {
  departure: string;
  budget: string;
  days: string;
  interests: string[];
  travelGroup: string;
  travelStyle: string;
};

// --- DATA ---
const interests = [
  { id: "beach", label: "Bãi biển", icon: Waves },
  { id: "mountain", label: "Núi", icon: Mountain },
  { id: "culture", label: "Văn hóa", icon: Building2 },
  { id: "nature", label: "Thiên nhiên", icon: Palmtree },
];

const travelGroups = [
  { id: "solo", label: "Đi một mình", icon: User },
  { id: "couple", label: "Cặp đôi", icon: Heart },
  { id: "friends", label: "Bạn bè", icon: Users },
  { id: "family", label: "Gia đình", icon: Home },
];

export function AIRecommendationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(() => {
    return localStorage.getItem("ai_showResults") === "true";
  });
  const [realRecommendations, setRealRecommendations] = useState<any[]>(() => {
    const saved = localStorage.getItem("ai_recommendations");
    return saved ? JSON.parse(saved) : [];
  });
  const [formData, setFormData] = useState<PlannerFormData>(() => {
    const saved = localStorage.getItem("ai_formData");
    return saved ? JSON.parse(saved) : {
      departure: "",
      budget: "",
      days: "",
      interests: [] as string[],
      travelGroup: "",
      travelStyle: "Budget",
    };
  });
  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem("ai_page");
    return saved ? Number(saved) : 1;
  });
  const [totalPages, setTotalPages] = useState(() => {
    const saved = localStorage.getItem("ai_totalPages");
    return saved ? Number(saved) : 1;
  });
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Scroll ref for results
  const resultsRef = useRef<HTMLDivElement>(null);

  const fetchRecommendations = async (currentPage: number, isLoadMore: boolean = false) => {
    const requestPayload: AiRecommendRequest = {
      budgetVND: Number(formData.budget),
      days: Number(formData.days),
      interests: formData.interests.join(", "),
      departure: formData.departure,
      destination: "",
      transportationPreference: "no_preference",
      travelGroup: formData.travelGroup,
      destinationType: "",
      mainTravelGoal: "",
      preferredWeather: "no_preference",
      accommodationType: "no_preference",
      budgetStyle: "balanced",
      page: currentPage,
      pageSize: 10,
    };

    localStorage.setItem("ai_formData", JSON.stringify(formData));

    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await getAiRecommendations(requestPayload);
      const mapped = response.items.map((item, index) => ({
        id: item.destinationID,
        destination: `${item.name}, ${item.cityProvince}`,
        distance: item.distance,
        country: "Việt Nam",
        image: item.imageUrl ? item.imageUrl.split(',')[0] : `https://images.unsplash.com/photo-1598977123118-4e30ba3c4f5b?w=800&q=80&auto=format&fit=crop&sig=${item.destinationID}`,
        estimatedCost: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.estimatedCostVND),
        confidence: 90 + (index % 10),
        weather: { temp: "28°C", condition: "Đẹp" },
        flightDuration: "Tùy vị trí",
        matchScore: 98 - (isLoadMore ? realRecommendations.length + index : index),
        reasons: [item.matchReason],
        highlights: ["Khám phá địa phương", "Ẩm thực đặc sắc", "Văn hóa phong phú"],
        dailyCostBreakdown: item.dailyCostBreakdown,
        estimatedCostValue: item.estimatedCostVND
      }));

      const newRecommendations = isLoadMore ? [...realRecommendations, ...mapped] : mapped;

      setRealRecommendations(newRecommendations);
      setPage(response.page);
      setTotalPages(response.totalPages);
      setShowResults(true);

      localStorage.setItem("ai_recommendations", JSON.stringify(newRecommendations));
      localStorage.setItem("ai_showResults", "true");
      localStorage.setItem("ai_page", response.page.toString());
      localStorage.setItem("ai_totalPages", response.totalPages.toString());

      if (!isLoadMore) {
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
      }
    } catch (error) {
      console.error("Failed to get AI recommendations", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const daysValue = Number(formData.days);

    // Thực hiện validate logic số ngày
    if (isNaN(daysValue) || daysValue < 1) {
      toast.error("Số ngày du lịch phải lớn hơn 0!");
      return;
    }

    if (daysValue > 7) {
      toast.error("Chuyến đi tối đa do AI lên kế hoạch hiện tại là 7 ngày!");
      return;
    }

    // Nếu hợp lệ thì mới gọi API lấy dữ liệu
    await fetchRecommendations(1, false);
  };

  const handleLoadMore = async () => {
    if (page < totalPages) {
      await fetchRecommendations(page + 1, true);
    }
  };

  const toggleInterest = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : [...prev.interests, id],
    }));
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20 pb-10">

      {/* 1. HERO SECTION (MotionSites Style) */}
      <div className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-black/40 to-background z-10" />
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
            alt="Travel Background"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center mt-[-10vh]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-sm font-medium mb-6 shadow-2xl"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span>AI-Powered Travel Planner</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 drop-shadow-lg"
          >
            Hành Trình Mơ Ước <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">Bắt Đầu Từ Đây</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md mb-12"
          >
            Để AI phân tích hàng nghìn điểm đến và thiết kế chuyến đi hoàn hảo phù hợp với phong cách, ngân sách và sở thích của riêng bạn.
          </motion.p>
        </div>

        {/* 2. SEARCH BAR (Google Travel Style) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute bottom-10 left-0 right-0 z-30 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-5xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-card dark:bg-card/90 backdrop-blur-xl p-3 md:p-4 rounded-3xl shadow-2xl shadow-primary/10 border border-border/50">
              <div className="flex flex-col md:flex-row items-center gap-2">

                {/* Departure */}
                <div className="flex-1 w-full relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={formData.departure}
                    onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                    placeholder="Bạn xuất phát từ đâu?"
                    className="w-full h-14 pl-12 pr-4 bg-muted/30 hover:bg-muted/50 focus:bg-background rounded-2xl outline-none border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all text-foreground font-medium placeholder:font-normal placeholder:text-muted-foreground selection:bg-blue-500 selection:text-white dark:selection:bg-blue-600 dark:selection:text-white"
                    required
                  />
                </div>

                <div className="hidden md:block w-px h-10 bg-border" />

                {/* Budget */}
                <div className="flex-[0.8] w-full relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Coins className="w-5 h-5" />
                  </div>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="Ngân sách (VND)"
                    className="w-full h-14 pl-12 pr-4 bg-muted/30 hover:bg-muted/50 focus:bg-background rounded-2xl outline-none border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all text-foreground font-medium placeholder:font-normal placeholder:text-muted-foreground selection:bg-blue-500 selection:text-white dark:selection:bg-blue-600 dark:selection:text-white"
                    required
                  />
                </div>

                <div className="hidden md:block w-px h-10 bg-border" />

                {/* Days */}
                <div className="flex-[0.6] w-full relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                    placeholder="Số ngày"
                    className="w-full h-14 pl-12 pr-4 bg-muted/30 hover:bg-muted/50 focus:bg-background rounded-2xl outline-none border border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all text-foreground font-medium placeholder:font-normal placeholder:text-muted-foreground selection:bg-blue-500 selection:text-white dark:selection:bg-blue-600 dark:selection:text-white"
                    required
                  />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto mt-2 md:mt-0 h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span className="md:hidden lg:inline">Khám Phá</span>
                    </>
                  )}
                </button>
              </div>

              {/* Advanced Toggle */}
              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Tuỳ chỉnh sở thích & nhóm</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
                </button>
              </div>

              {/* Advanced Options Panel */}
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 mt-4 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-6 pb-2 px-2">
                      {/* Interests */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-3">Sở thích du lịch</label>
                        <div className="flex flex-wrap gap-2">
                          {interests.map(({ id, label, icon: Icon }) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => toggleInterest(id)}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${formData.interests.includes(id)
                                ? "bg-primary/10 text-primary ring-1 ring-primary/50"
                                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                            >
                              <Icon className="w-4 h-4" />
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Travel Group */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-3">Bạn đi cùng ai?</label>
                        <div className="flex flex-wrap gap-2">
                          {travelGroups.map(({ id, label, icon: Icon }) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setFormData({ ...formData, travelGroup: id })}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${formData.travelGroup === id
                                ? "bg-secondary/10 text-secondary ring-1 ring-secondary/50"
                                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                            >
                              <Icon className="w-4 h-4" />
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Travel Style */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-3">Phong cách du lịch</label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: "Budget", label: "Tiết kiệm" },
                            { id: "Luxury", label: "Cao cấp" },
                            { id: "Adventure", label: "Phiêu lưu" },
                            { id: "Relaxation", label: "Nghỉ dưỡng" }
                          ].map(({ id, label }) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setFormData({ ...formData, travelStyle: id })}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${formData.travelStyle === id
                                ? "bg-accent/10 text-accent ring-1 ring-accent/50"
                                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>
      </div>

      {/* 3. MAIN CONTENT / RESULTS (Airbnb / TripAdvisor Style) */}
      <div ref={resultsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[50vh]">

        {!showResults && !isLoading && (
          <div className="flex flex-col items-center justify-center text-center py-20 opacity-60">
            <Compass className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium text-foreground">Chưa có kết quả nào</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              Hãy nhập thông tin chuyến đi của bạn ở trên để AI có thể gợi ý những điểm đến tuyệt vời nhất.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-2xl relative z-10 animate-bounce">
                <Sparkles className="w-10 h-10" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mt-8 text-foreground">AI Đang Phân Tích...</h3>
            <p className="text-muted-foreground mt-2 max-w-sm text-center">
              Đang rà soát hàng nghìn điểm đến, kiểm tra thời tiết và tối ưu hoá ngân sách của bạn.
            </p>
          </div>
        )}

        {showResults && !isLoading && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Gợi ý hàng đầu cho bạn</h2>
                <p className="text-muted-foreground mt-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  Được tuyển chọn kỹ lưỡng bởi TravelHub AI
                </p>
              </div>
            </div>

            {/* 4. DESTINATION CARDS LIST (Traveloka Style) */}
            <div className="flex flex-col gap-6">
              {realRecommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col md:flex-row"
                >
                  {/* Left: Image Container */}
                  <div className="relative w-full md:w-72 lg:w-80 h-56 md:h-auto shrink-0 overflow-hidden">
                    <img
                      src={rec.image}
                      alt={rec.destination}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Gradient Overlay for mobile readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {index === 0 && (
                        <div className="px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" /> Top 1 Phù hợp
                        </div>
                      )}
                    </div>

                    {/* Heart Button */}
                    <button className="absolute top-3 right-3 w-9 h-9 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>

                    {/* Mobile Title overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-white md:hidden">
                      <h3 className="text-lg font-bold line-clamp-1 drop-shadow-md">{rec.destination}</h3>
                    </div>
                  </div>

                  {/* Right: Content Container */}
                  <div className="flex flex-col md:flex-row flex-1 p-5 gap-6">

                    {/* Middle: Info */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xl font-bold text-foreground hidden md:block">{rec.destination}</h3>

                        {/* Rating block (Traveloka style: 8.7/10 Very Good) */}
                        <div className="hidden md:flex flex-col items-end">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-primary">Rất phù hợp</span>
                            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-md">
                              {rec.matchScore}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                        <MapPin className="w-4 h-4 text-secondary" />
                        <span>{rec.country}</span>
                        <span className="w-1 h-1 rounded-full bg-border mx-1" />
                        <span>Khoảng cách: {rec.distance || "Tùy vị trí"}</span>
                      </div>

                      {/* Features/Highlights */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs bg-muted/50 px-2.5 py-1.5 rounded-md text-foreground flex items-center gap-1.5 border border-border/40">
                          <ThermometerSun className="w-3.5 h-3.5 text-accent" /> {rec.weather.temp}
                        </span>
                        <span className="text-xs bg-muted/50 px-2.5 py-1.5 rounded-md text-foreground flex items-center gap-1.5 border border-border/40">
                          <Plane className="w-3.5 h-3.5 text-secondary" /> {rec.flightDuration}
                        </span>
                        <span className="text-xs bg-muted/50 px-2.5 py-1.5 rounded-md text-foreground flex items-center gap-1.5 border border-border/40">
                          <TrendingUp className="w-3.5 h-3.5 text-green-500" /> {rec.confidence}% tự tin
                        </span>
                      </div>

                      {/* AI Reason */}
                      <div className="mt-auto md:mt-4">
                        <div className="flex items-start gap-2 text-sm text-foreground/80 bg-primary/5 p-3 rounded-xl border border-primary/10">
                          <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="line-clamp-2 leading-relaxed">{rec.reasons[0]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rightmost: Pricing & CTA */}
                    <div className="w-full md:w-56 lg:w-64 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-6 flex flex-col justify-end md:items-end text-right shrink-0">

                      {/* Mobile Rating */}
                      <div className="flex md:hidden items-center justify-between w-full mb-4 pb-4 border-b border-border/50">
                        <span className="text-sm font-medium text-foreground">Đánh giá AI:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-primary">Rất phù hợp</span>
                          <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
                            {rec.matchScore}
                          </div>
                        </div>
                      </div>

                      <div className="mb-1.5 text-sm text-green-600 dark:text-green-400 font-medium flex items-center justify-end gap-1">
                        <Star className="w-4 h-4 fill-current" /> Đề xuất hàng đầu
                      </div>

                      <div className="text-xs text-muted-foreground line-through mb-0.5">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rec.estimatedCostValue * 1.15)}
                      </div>

                      <div className="text-2xl font-bold text-accent mb-1">{rec.estimatedCost}</div>
                      <div className="text-xs text-muted-foreground mb-4">Tổng ước tính (bao gồm thuế)</div>

                      <Link
                        to={rec.id >= 20000 ? `/tours/${rec.id - 20000}` : `/destination/${rec.id}`}
                        className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground text-center rounded-xl font-semibold transition-colors shadow-lg shadow-primary/20 mt-auto md:mt-0"
                      >
                        {rec.id >= 20000 ? "Xem Chi Tiết Tour" : "Chọn Điểm Đến"}
                      </Link>
                    </div>

                  </div>
                </motion.div>
              ))}
            </div>

            {page < totalPages && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-8 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-full shadow-lg transition-all disabled:opacity-70 flex items-center gap-2"
                >
                  {isLoadingMore ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Tải Thêm Điểm Đến</>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
