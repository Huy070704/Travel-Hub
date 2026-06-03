import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { 
  ArrowLeft, 
  Star, 
  ExternalLink, 
  Filter, 
  TrendingDown, 
  MapPin, 
  DollarSign, 
  Award,
  AlertCircle,
  Sparkles,
  ChevronDown,
  CheckCircle2
} from "lucide-react";

export function TourActivityComparisonPage() {
  const navigate = useNavigate();
  const [activeSort, setActiveSort] = useState("Giá thấp nhất");
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [activePartner, setActivePartner] = useState("Tất cả");

  const sortOptions = ["Giá thấp nhất", "Đánh giá cao nhất", "Phổ biến nhất"];
  const categoryFilters = ["Tất cả", "Vé vào cổng", "Tour trọn gói", "Trải nghiệm"];
  const partnerFilters = ["Tất cả", "Klook", "Traveloka", "Local Agency", "Booking.com"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white py-12 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại lịch trình</span>
          </button>
          
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
            Lựa chọn Tour/Hoạt động tại Đà Lạt
          </h1>
          <p className="text-white/90 max-w-2xl text-lg mb-8">
            So sánh giá từ nhiều đối tác để tối ưu chi phí
          </p>

          {/* Context Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-white/70 text-sm mb-1 uppercase tracking-wider font-semibold">Hoạt động</div>
                <div className="text-xl font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-yellow-300" />
                  Vé vào cổng Thung Lũng Tình Yêu
                </div>
              </div>
              <div>
                <div className="text-white/70 text-sm mb-1 uppercase tracking-wider font-semibold">Ngân sách tối ưu</div>
                <div className="text-xl font-bold flex items-center gap-2 text-green-300">
                  <DollarSign className="w-5 h-5" />
                  150.000 VNĐ
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
              <p className="text-white/90 text-sm">
                <span className="font-semibold text-yellow-300">AI Recommendation:</span> Chúng tôi ưu tiên các lựa chọn phù hợp với ngân sách hiện tại của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar: Filters & Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Summary Panel */}
            <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-primary">
                <Sparkles className="w-5 h-5" />
                AI Phân Tích Ngân Sách
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Chi phí dự toán</span>
                  <span className="font-medium">150.000 đ</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Giá tốt nhất tìm thấy</span>
                  <span className="font-bold text-green-600">115.000 đ</span>
                </div>
                
                <div className="pt-3 border-t border-border">
                  <div className="bg-green-50 text-green-700 p-3 rounded-lg flex flex-col items-center justify-center text-center">
                    <TrendingDown className="w-6 h-6 mb-1" />
                    <span className="text-sm font-semibold">Tiết kiệm 35.000 đ</span>
                    <span className="text-xs mt-1 opacity-80">so với dự toán ban đầu</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold">Độ phù hợp (Match Score)</span>
                    <span className="text-sm font-bold text-primary">95%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>

                <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm flex gap-2 items-start mt-4">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-blue-600" />
                  <p>Đặt qua <strong>Klook</strong> để tối ưu ngân sách và vẫn đảm bảo trải nghiệm đầy đủ.</p>
                </div>
              </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-6 sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Bộ lọc</h3>
              </div>

              <div className="space-y-6">
                {/* Sort */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-foreground">Sắp xếp theo</h4>
                  <div className="space-y-2">
                    {sortOptions.map(option => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="sort" 
                          checked={activeSort === option}
                          onChange={() => setActiveSort(option)}
                          className="text-primary focus:ring-primary h-4 w-4"
                        />
                        <span className="text-sm text-muted-foreground">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-foreground">Danh mục</h4>
                  <div className="flex flex-wrap gap-2">
                    {categoryFilters.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${
                          activeCategory === cat 
                            ? "bg-primary text-white" 
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Partners */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-foreground">Đối tác cung cấp</h4>
                  <div className="space-y-2">
                    {partnerFilters.map(partner => (
                      <label key={partner} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="partner" 
                          checked={activePartner === partner}
                          onChange={() => setActivePartner(partner)}
                          className="text-primary focus:ring-primary h-4 w-4"
                        />
                        <span className="text-sm text-muted-foreground">{partner}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Results */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Card 1: Budget Option */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-primary ring-4 ring-primary/10 relative transition-transform hover:-translate-y-1">
              <div className="absolute top-4 left-0 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-r-lg uppercase tracking-wider shadow-md z-10 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                Lựa chọn tiết kiệm nhất
              </div>
              <div className="p-6 pt-12 md:p-6 md:pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-semibold text-muted-foreground mb-1">Cung cấp bởi: <span className="text-primary">Klook</span></div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Vé vào cổng Thung Lũng Tình Yêu</h3>
                        <div className="flex items-center gap-4 text-sm mb-4">
                          <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md font-medium">
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            4.6/5.0
                          </div>
                          <span className="text-muted-foreground">(500+ lượt đặt)</span>
                        </div>
                        <div className="bg-green-50 inline-block px-3 py-1.5 rounded-lg text-green-700 text-sm font-medium border border-green-100 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Tiết kiệm 35.000 VNĐ so với dự toán
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Price & CTA */}
                  <div className="md:w-64 flex flex-col justify-center items-end border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                    <div className="text-right w-full mb-4">
                      <div className="text-sm text-muted-foreground line-through mb-1">150.000 VNĐ</div>
                      <div className="text-3xl font-bold text-primary">115.000 <span className="text-xl">đ</span></div>
                    </div>
                    <a 
                      href="https://affiliate.klook.com/thung-lung-tinh-yeu?price=115000" 
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl text-center transition-colors flex items-center justify-center gap-2"
                    >
                      Đặt qua Klook
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Best Value */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-border/50 relative transition-all hover:shadow-lg hover:border-blue-300">
              <div className="absolute top-4 left-0 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-r-lg uppercase tracking-wider z-10">
                Best Value
              </div>
              <div className="p-6 pt-12 md:p-6 md:pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-muted-foreground mb-1">Cung cấp bởi: <span className="text-blue-600">Traveloka</span></div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Tour nửa ngày: Thung Lũng Tình Yêu & Vườn Dâu</h3>
                    <div className="flex items-center gap-4 text-sm mb-2">
                      <div className="flex items-center gap-1 text-yellow-600 font-medium">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        4.8/5.0
                      </div>
                      <span className="text-muted-foreground">(250+ lượt đặt)</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Bao gồm xe đưa đón, vé vào cổng và hướng dẫn viên tiếng Việt.</p>
                  </div>
                  
                  <div className="md:w-64 flex flex-col justify-center items-end border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                    <div className="text-right w-full mb-4">
                      <div className="text-2xl font-bold text-foreground">230.000 <span className="text-lg">đ</span></div>
                    </div>
                    <a 
                      href="https://affiliate.traveloka.com/thung-lung-tinh-yeu-tour?price=230000" 
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-center transition-colors flex items-center justify-center gap-2"
                    >
                      Đặt qua Traveloka
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Culture Exploration */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-border/50 relative transition-all hover:shadow-lg hover:border-purple-300">
              <div className="absolute top-4 left-0 bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-r-lg uppercase tracking-wider z-10">
                Phù hợp Culture Exploration
              </div>
              <div className="p-6 pt-12 md:p-6 md:pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-muted-foreground mb-1">Cung cấp bởi: <span className="text-purple-600">Local Agency</span></div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Tour Văn Hóa Cồng Chiêng Đà Lạt</h3>
                    <div className="flex items-center gap-4 text-sm mb-2">
                      <div className="flex items-center gap-1 text-yellow-600 font-medium">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        4.9/5.0
                      </div>
                      <span className="text-muted-foreground">(120 lượt đặt)</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Trải nghiệm giao lưu văn hóa, thưởng thức rượu cần và thịt nướng BBQ.</p>
                  </div>
                  
                  <div className="md:w-64 flex flex-col justify-center items-end border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                    <div className="text-right w-full mb-4">
                      <div className="text-2xl font-bold text-foreground">350.000 <span className="text-lg">đ</span></div>
                    </div>
                    <a 
                      href="https://local.agency.com/tour-cong-chieng?price=350000" 
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl text-center transition-colors flex items-center justify-center gap-2"
                    >
                      Đặt qua Local Agency
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Outside Budget */}
            <div className="bg-white/60 rounded-2xl shadow-sm overflow-hidden border border-border/50 relative opacity-80 transition-all hover:opacity-100 hover:shadow-md">
              <div className="absolute top-4 left-0 bg-slate-500 text-white text-xs font-bold px-3 py-1.5 rounded-r-lg uppercase tracking-wider z-10 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Nằm ngoài ngân sách
              </div>
              <div className="p-6 pt-12 md:p-6 md:pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-muted-foreground mb-1">Cung cấp bởi: <span className="text-slate-600">Booking.com</span></div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Gói nghỉ dưỡng 5 sao & Ẩm thực tại Thung Lũng</h3>
                    <div className="flex items-center gap-4 text-sm mb-2">
                      <div className="flex items-center gap-1 text-yellow-600 font-medium">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        4.5/5.0
                      </div>
                      <span className="text-muted-foreground">(40 lượt đặt)</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Trải nghiệm cao cấp với bữa ăn fine-dining và xe Limousine đưa đón tận nơi.</p>
                  </div>
                  
                  <div className="md:w-64 flex flex-col justify-center items-end border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                    <div className="text-right w-full mb-4">
                      <div className="text-2xl font-bold text-foreground">1.200.000 <span className="text-lg">đ</span></div>
                    </div>
                    <a 
                      href="https://affiliate.booking.com/dalat-premium?price=1200000" 
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl text-center transition-colors flex items-center justify-center gap-2"
                    >
                      Đặt qua Booking.com
                      <ExternalLink className="w-4 h-4" />
                    </a>
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
