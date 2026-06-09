import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import Autocomplete from "react-google-autocomplete";
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
  CloudSun,
  ThermometerSun,
  Plane,
  TrendingUp,
  Star,
  Bike,
  Bus,
  Train,
  Users,
  User,
  Gem,
  Tent,
  Camera,
  Cloud,
  Snowflake,
  Home,
  Hotel,
  WalletCards
} from "lucide-react";
import { FloatingBlob } from "../../../components/shared/AnimatedBackground";
import { getAiRecommendations } from "@/api/aiApi";
import type { AiRecommendRequest } from "@/types/ai";

type PlannerFormData = {
  departure: string;
  destination: string;
  budget: string;
  days: string;
  interests: string[];
  transportationPreference: string;
  travelGroup: string;
  destinationType: string;
  mainTravelGoal: string;
  preferredWeather: string;
  accommodationType: string;
  budgetStyle: string;
};

type ChoiceOption = {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type ChoiceGroupProps = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  options: ChoiceOption[];
  value: string;
  onSelect: (id: string) => void;
  compact?: boolean;
};

const inputClassName =
  "w-full px-4 py-3 bg-white/80 dark:bg-black/20 rounded-xl border border-border/70 dark:border-white/10 shadow-sm focus:bg-white dark:focus:bg-black/40 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/70 text-foreground";

function FieldLabel({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold mb-2.5 text-foreground">
      <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </span>
      <span>{children}</span>
    </label>
  );
}

function ChoiceGroup({ label, icon: LabelIcon, options, value, onSelect, compact = true }: ChoiceGroupProps) {
  return (
    <div className="rounded-2xl border border-border/60 dark:border-white/10 bg-white/70 dark:bg-black/20 p-4 shadow-sm">
      <FieldLabel icon={LabelIcon}>{label}</FieldLabel>
      <div className={compact ? "flex flex-wrap gap-2" : "grid grid-cols-2 gap-2"}>
        {options.map(({ id, label: optionLabel, icon: OptionIcon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium shadow-sm transition-all ${
              value === id
                ? "border-primary bg-gradient-to-r from-primary/10 to-secondary/10 text-primary shadow-primary/10"
                : "border-border/70 dark:border-white/10 bg-white/80 dark:bg-black/40 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/20 text-foreground"
            }`}
          >
            {OptionIcon && <OptionIcon className="w-4 h-4" />}
            <span>{optionLabel}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

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
      destination: "",
      budget: "",
      days: "",
      interests: [] as string[],
      transportationPreference: "",
      travelGroup: "",
      destinationType: "",
      mainTravelGoal: "",
      preferredWeather: "",
      accommodationType: "",
      budgetStyle: "",
    };
  });

  const interests = [
    { id: "beach", label: "Biển & nghỉ dưỡng", icon: Waves },
    { id: "adventure", label: "Phiêu lưu & leo núi", icon: Mountain },
    { id: "culture", label: "Văn hóa & lịch sử", icon: Building2 },
    { id: "nature", label: "Thiên nhiên", icon: Palmtree },
  ];

  const transportationPreferences = [
    { id: "motorbike", label: "Xe máy", icon: Bike },
    { id: "bus", label: "Xe khách", icon: Bus },
    { id: "train", label: "Tàu hỏa", icon: Train },
    { id: "airplane", label: "Máy bay", icon: Plane },
    { id: "no_preference", label: "Không ưu tiên" },
  ];

  const travelGroups = [
    { id: "solo", label: "Đi một mình", icon: User },
    { id: "friends", label: "Bạn bè", icon: Users },
    { id: "couple", label: "Cặp đôi", icon: Heart },
    { id: "family", label: "Gia đình", icon: Home },
    { id: "group", label: "Nhóm", icon: Users },
  ];

  const destinationTypes = [
    { id: "beach", label: "Biển", icon: Waves },
    { id: "mountain", label: "Núi", icon: Mountain },
    { id: "city", label: "Thành phố", icon: Building2 },
    { id: "island", label: "Đảo", icon: Palmtree },
    { id: "camping", label: "Cắm trại", icon: Tent },
    { id: "food_tour", label: "Ẩm thực" },
  ];

  const mainTravelGoals = [
    { id: "relaxation", label: "Nghỉ dưỡng", icon: Waves },
    { id: "adventure", label: "Phiêu lưu", icon: Mountain },
    { id: "photography", label: "Chụp ảnh", icon: Camera },
    { id: "budget_travel", label: "Tiết kiệm", icon: DollarSign },
    { id: "local_experience", label: "Trải nghiệm địa phương", icon: Compass },
  ];

  const preferredWeatherOptions = [
    { id: "cool", label: "Mát mẻ", icon: Cloud },
    { id: "sunny", label: "Nắng đẹp", icon: ThermometerSun },
    { id: "cold", label: "Se lạnh", icon: Snowflake },
    { id: "no_preference", label: "Không ưu tiên" },
  ];

  const accommodationTypes = [
    { id: "hostel", label: "Nhà nghỉ", icon: Building2 },
    { id: "homestay", label: "Homestay", icon: Home },
    { id: "hotel", label: "Khách sạn", icon: Hotel },
    { id: "resort", label: "Resort", icon: Gem },
    { id: "no_preference", label: "Không ưu tiên" },
  ];

  const budgetStyles = [
    { id: "budget", label: "Tiết kiệm", icon: DollarSign },
    { id: "balanced", label: "Cân bằng", icon: WalletCards },
    { id: "premium", label: "Cao cấp", icon: Gem },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requestPayload: AiRecommendRequest = {
      budgetVND: Number(formData.budget),
      days: Number(formData.days),
      interests: formData.interests.join(", "),
      departure: formData.departure,
      destination: formData.destination,
      transportationPreference: formData.transportationPreference,
      travelGroup: formData.travelGroup,
      destinationType: formData.destinationType,
      mainTravelGoal: formData.mainTravelGoal,
      preferredWeather: formData.preferredWeather,
      accommodationType: formData.accommodationType,
      budgetStyle: formData.budgetStyle,
    };

    localStorage.setItem("ai_formData", JSON.stringify(formData));
    setIsLoading(true);
    try {
      const response = await getAiRecommendations(requestPayload);
      const mapped = response.map((item, index) => ({
        id: item.destinationID,
        destination: `${item.name}, ${item.cityProvince}`,
        distance: item.distance,
        country: "Việt Nam",
        image: `https://images.unsplash.com/photo-1598977123118-4e30ba3c4f5b?w=800&q=80&auto=format&fit=crop&sig=${item.destinationID}`,
        estimatedCost: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.estimatedCostVND),
        confidence: 90 + (index % 10),
        weather: { temp: "28°C", condition: "Đẹp" },
        flightDuration: "Tùy vị trí",
        matchScore: 98 - index,
        reasons: [item.matchReason],
        highlights: ["Khám phá địa phương", "Ẩm thực đặc sắc", "Văn hóa phong phú"],
        dailyCostBreakdown: item.dailyCostBreakdown,
        estimatedCostValue: item.estimatedCostVND
      }));
      setRealRecommendations(mapped);
      setShowResults(true);
      localStorage.setItem("ai_recommendations", JSON.stringify(mapped));
      localStorage.setItem("ai_showResults", "true");
    } catch (error) {
      console.error("Failed to get AI recommendations", error);
    } finally {
      setIsLoading(false);
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

  const updateChoice = (field: keyof Omit<PlannerFormData, "departure" | "destination" | "budget" | "days" | "interests">, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
      <div className="relative bg-gradient-to-br from-primary via-secondary to-cyan-500 text-white py-14 animate-gradient overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.12),transparent_32%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm text-sm font-semibold mb-5">
            <Sparkles className="w-4 h-4" />
            <span>Gợi ý chuyến đi thông minh</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-normal">Gợi ý du lịch bằng AI</h1>
          </div>
          <p className="text-white/90 max-w-2xl">
            Cho TravelHub biết chuyến đi bạn mong muốn, AI sẽ tìm các điểm đến phù hợp với ngân sách và sở thích của bạn.
          </p>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(360px,40%)_minmax(0,50%)] justify-center gap-8 xl:gap-10">
          {/* Search Form - Sticky Sidebar */}
          <div>
            <div className="sticky top-20">
              <form onSubmit={handleSubmit} className="bg-white/90 dark:bg-black/40 backdrop-blur-xl rounded-2xl shadow-xl shadow-primary/5 border border-white/80 dark:border-white/10 p-5 md:p-6 space-y-4">
                <div className="flex items-start justify-between gap-3 pb-2">
                  <div>
                    <h2 className="font-bold text-xl">Lên kế hoạch chuyến đi</h2>
                    <p className="text-sm text-muted-foreground">Chọn nhanh sở thích để gợi ý chính xác hơn</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
                    <Compass className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 dark:border-white/10 bg-white/70 dark:bg-black/20 p-4 shadow-sm space-y-4">
                  <div>
                    <FieldLabel icon={MapPin}>Xuất phát từ</FieldLabel>
                    <Autocomplete
                      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                      onPlaceSelected={(place) => setFormData({ ...formData, departure: place?.formatted_address || place?.name || "" })}
                      defaultValue={formData.departure}
                      options={{ types: ["(regions)"] }}
                      placeholder="Ví dụ: TP. Hồ Chí Minh"
                      className={inputClassName}
                      required
                    />
                  </div>

                  <div>
                    <FieldLabel icon={MapPin}>Vị trí/Thành phố muốn đến</FieldLabel>
                    <Autocomplete
                      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                      onPlaceSelected={(place) => setFormData({ ...formData, destination: place?.formatted_address || place?.name || "" })}
                      defaultValue={formData.destination}
                      options={{ types: ["(regions)"] }}
                      placeholder="Ví dụ: Đà Lạt, Lâm Đồng"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <FieldLabel icon={DollarSign}>Tổng ngân sách (VND)</FieldLabel>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="Ví dụ: 5000000"
                    className={inputClassName}
                    required
                  />
                  </div>

                  <div>
                    <FieldLabel icon={Calendar}>Số ngày</FieldLabel>
                  <input
                    type="number"
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                    placeholder="Ví dụ: 3"
                    className={inputClassName}
                    required
                  />
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 dark:border-white/10 bg-white/70 dark:bg-black/20 p-4 shadow-sm">
                  <FieldLabel icon={Heart}>Sở thích du lịch</FieldLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {interests.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleInterest(id)}
                        className={`flex min-h-[86px] flex-col items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium shadow-sm transition-all ${
                          formData.interests.includes(id)
                            ? "border-primary bg-gradient-to-br from-primary/10 to-secondary/10 text-primary shadow-primary/10"
                            : "border-border/70 dark:border-white/10 bg-white/80 dark:bg-black/40 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/20 text-foreground"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-center leading-snug">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <ChoiceGroup
                  label="Phương tiện ưu tiên"
                  icon={Plane}
                  options={transportationPreferences}
                  value={formData.transportationPreference}
                  onSelect={(value) => updateChoice("transportationPreference", value)}
                />

                <ChoiceGroup
                  label="Bạn đi cùng ai"
                  icon={Users}
                  options={travelGroups}
                  value={formData.travelGroup}
                  onSelect={(value) => updateChoice("travelGroup", value)}
                />

                <ChoiceGroup
                  label="Loại điểm đến"
                  icon={Compass}
                  options={destinationTypes}
                  value={formData.destinationType}
                  onSelect={(value) => updateChoice("destinationType", value)}
                />

                <ChoiceGroup
                  label="Mục tiêu chính"
                  icon={Sparkles}
                  options={mainTravelGoals}
                  value={formData.mainTravelGoal}
                  onSelect={(value) => updateChoice("mainTravelGoal", value)}
                />

                <ChoiceGroup
                  label="Thời tiết mong muốn"
                  icon={CloudSun}
                  options={preferredWeatherOptions}
                  value={formData.preferredWeather}
                  onSelect={(value) => updateChoice("preferredWeather", value)}
                />

                <ChoiceGroup
                  label="Loại chỗ ở"
                  icon={Hotel}
                  options={accommodationTypes}
                  value={formData.accommodationType}
                  onSelect={(value) => updateChoice("accommodationType", value)}
                />

                <ChoiceGroup
                  label="Phong cách chi tiêu"
                  icon={WalletCards}
                  options={budgetStyles}
                  value={formData.budgetStyle}
                  onSelect={(value) => updateChoice("budgetStyle", value)}
                />

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 neon-primary font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>AI đang suy nghĩ...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Nhận gợi ý</span>
                    </>
                  )}
                </motion.button>
              </form>

              {/* AI Assistant Panel */}
              <motion.div
                className="mt-6 bg-white/75 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-5 border border-white/80 dark:border-white/10 shadow-lg shadow-primary/5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Trợ lý du lịch AI</h4>
                    <p className="text-sm text-muted-foreground">
                      AI phân tích hơn 1000 điểm đến, đánh giá thực tế, thời tiết và dữ liệu ngân sách để tìm lựa chọn hợp với bạn.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Results */}
          <div>
            {!showResults && !isLoading && (
              <div className="bg-white/90 dark:bg-black/40 backdrop-blur-xl rounded-2xl shadow-xl shadow-primary/5 border border-white/80 dark:border-white/10 p-10 md:p-12 text-center overflow-hidden relative">
                <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary mx-auto mb-6 flex items-center justify-center shadow-xl shadow-primary/20">
                  <Compass className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Sẵn sàng khám phá?</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Điền sở thích của bạn ở bên trái để AI tìm điểm đến phù hợp nhất với ngân sách và gu du lịch của bạn.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="bg-white/90 dark:bg-black/40 backdrop-blur-xl rounded-2xl shadow-xl shadow-primary/5 border border-white/80 dark:border-white/10 p-10 md:p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary mx-auto mb-6 flex items-center justify-center animate-pulse shadow-xl shadow-primary/20">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">AI đang phân tích...</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Đang rà soát hàng nghìn điểm đến và đối chiếu với sở thích của bạn.
                </p>
                <div className="flex flex-col gap-2 max-w-md mx-auto">
                  {["Phân tích lựa chọn ngân sách", "Kiểm tra điều kiện thời tiết", "Tìm điểm đến phù hợp nhất"].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div
                        className="w-2 h-2 rounded-full bg-primary animate-pulse"
                        style={{ animationDelay: `${i * 200}ms` }}
                      />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showResults && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">Gợi ý hàng đầu cho bạn</h3>
                    <p className="text-muted-foreground">Dựa trên sở thích và ngân sách của bạn</p>
                  </div>
                </div>

                {realRecommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    className="bg-white/90 dark:bg-black/40 backdrop-blur-xl rounded-2xl shadow-lg shadow-primary/5 border border-white/80 dark:border-white/10 overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all hover-lift"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="grid md:grid-cols-5 gap-0">
                      {/* Image */}
                      <div className="md:col-span-2 relative h-64 md:h-auto">
                        <img
                          src={rec.image}
                          alt={rec.destination}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-black/60 backdrop-blur-sm rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm text-foreground">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>#{index + 1} phù hợp</span>
                        </div>
                        <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 backdrop-blur-sm text-white rounded-full text-sm font-semibold shadow-sm">
                          {rec.matchScore}% phù hợp
                        </div>
                      </div>

                      {/* Content */}
                      <div className="md:col-span-3 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-2xl font-bold mb-1">{rec.destination}</h4>
                            <p className="text-muted-foreground">{rec.country}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{rec.estimatedCost}</div>
                            <div className="text-xs text-muted-foreground">Tổng chi phí ước tính</div>
                          </div>
                        </div>

                        {/* Quick Info */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-sm rounded-xl bg-muted/60 p-3">
                            <MapPin className="w-4 h-4 text-rose-500" />
                            <div>
                              <div className="font-semibold">{rec.distance || "N/A"}</div>
                              <div className="text-xs text-muted-foreground">Khoảng cách</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm rounded-xl bg-muted/60 p-3">
                            <ThermometerSun className="w-4 h-4 text-orange-500" />
                            <div>
                              <div className="font-semibold">{rec.weather.temp}</div>
                              <div className="text-xs text-muted-foreground">{rec.weather.condition}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm rounded-xl bg-muted/60 p-3">
                            <Plane className="w-4 h-4 text-primary" />
                            <div>
                              <div className="font-semibold">{rec.flightDuration}</div>
                              <div className="text-xs text-muted-foreground">Thời gian di chuyển</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm rounded-xl bg-muted/60 p-3">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <div>
                              <div className="font-semibold">{rec.confidence}%</div>
                              <div className="text-xs text-muted-foreground">Độ tin cậy</div>
                            </div>
                          </div>
                        </div>

                        {/* Why AI Recommends */}
                        <div className="mb-4">
                          <h5 className="font-semibold mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            Vì sao AI gợi ý điểm này
                          </h5>
                          <ul className="space-y-1.5">
                            {rec.reasons.map((reason, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Highlights */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {rec.highlights.map((highlight, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Link
                            to={`/destination/${rec.id}`}
                            className="flex-1 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all text-center font-semibold"
                          >
                            Xem chi tiết
                          </Link>
                          <button className="px-6 py-3 border border-border rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
