import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, Crown, Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import axiosInstance from "@/api/axiosInstance";
import { useAuth } from "@/contexts/AuthContext";

export function PremiumUpgradePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();
  const { updateUser, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      axiosInstance.get("/users/me")
        .then(res => setBalance(res.data.travelPoints))
        .catch(err => console.error("Failed to load user profile", err));
    }
  }, [isAuthenticated]);

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/payment/upgrade-premium");
      toast.success("Thanh toán thành công! Chào mừng bạn đến với Premium.");
      
      // Cập nhật trạng thái người dùng trong AuthContext ngay lập tức
      updateUser({ isPremium: true });

      setTimeout(() => {
        navigate("/community");
      }, 1500);

    } catch (error: any) {
      const errData = error.response?.data;
      if (errData && errData.error === "InsufficientPoints") {
        setShowErrorModal(true);
      } else {
        toast.error("Có lỗi xảy ra khi xử lý thanh toán.");
      }
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
              Chỉ với một cốc cá phê mỗi tháng, bạn có toàn quyền truy cập vào cộng đồng du lịch sôi động nhất.
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
                <>Thanh toán ngay <Sparkles className="w-5 h-5" /></>
              )}
            </button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Thanh toán an toàn. Có thể hủy bất kỳ lúc nào.
            </p>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <AnimatePresence>
        {showErrorModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card border-2 border-red-500/30 max-w-md w-full rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden"
            >
              {/* Top red glow */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-500">
                  <span className="text-3xl font-black">!</span>
                </div>
                <h3 className="text-2xl font-extrabold text-red-500 tracking-tight">ERR! Có rắc rối rồi.</h3>
                <div className="space-y-2 text-muted-foreground font-medium">
                  <p className="text-foreground">Rất tiếc, bạn cần <span className="text-red-500 font-bold">50,000 Travel Point</span> để thực hiện hành động này.</p>
                  <div className="py-2.5 px-4 bg-muted/50 rounded-2xl inline-block text-sm border border-border/50">
                    Số dư hiện tại: <span className="font-bold text-amber-500">{balance !== null ? balance.toLocaleString() : '?'}</span> Travel Point
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => navigate("/travel-banking")}
                className="w-full h-13 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-500/20"
              >
                Nạp Travel Point ngay
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
