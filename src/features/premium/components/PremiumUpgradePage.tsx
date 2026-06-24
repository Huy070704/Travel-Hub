import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, Crown, Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/api/axiosInstance";

export function PremiumUpgradePage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.post("/payment/upgrade-premium");
      toast.success("Thanh toán thành công! Chào mừng bạn đến với Premium.");
      
      // Reload lại trang và điều hướng về /community để làm mới AuthContext
      setTimeout(() => {
        window.location.href = "/community";
      }, 1500);

    } catch (error) {
      toast.error("Có lỗi xảy ra khi xử lý thanh toán.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="p-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Quay lại
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
          
          {/* Left: Info */}
          <div className="space-y-6 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full font-bold text-sm mx-auto md:mx-0 shadow-sm border border-amber-200">
              <Crown className="w-4 h-4" /> TRỞ THÀNH THÀNH VIÊN VIP
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
              Mở khóa giới hạn,<br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                kết nối không ngừng.
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto md:mx-0">
              Chỉ với một cốc cà phê mỗi tháng, bạn có toàn quyền truy cập vào cộng đồng du lịch sôi động nhất.
            </p>
          </div>

          {/* Right: Pricing Card */}
          <div className="bg-card border-2 border-amber-400 rounded-3xl shadow-[0_0_40px_rgba(251,191,36,0.15)] p-8 relative z-10 transform hover:-translate-y-1 transition-transform duration-300">
            {/* Ribbon */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-1 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> PHỔ BIẾN NHẤT
            </div>

            <div className="text-center mb-8 mt-2">
              <h2 className="text-2xl font-bold mb-2">Gói TravelHub Premium</h2>
              <div className="flex items-end justify-center gap-1">
                <span className="text-5xl font-black text-amber-500">50.000</span>
                <span className="text-xl font-bold text-muted-foreground mb-1">đ / tháng</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {[
                "Đăng bài viết chia sẻ hành trình và ảnh",
                "Tương tác (Like, Comment) với mọi người",
                "Nhắn tin không giới hạn cho các thành viên",
                "Tạo và quản lý nhóm chat riêng",
                "Huy hiệu Vương Miện VIP nổi bật",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                  <span className="font-medium text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> Đang xử lý thanh toán...
                </>
              ) : (
                <>Mở khóa ngay <Sparkles className="w-5 h-5" /></>
              )}
            </button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Thanh toán an toàn. Có thể hủy bất kỳ lúc nào.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
