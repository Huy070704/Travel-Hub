import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Coins, Sparkles, QrCode, Copy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import axiosInstance from "@/api/axiosInstance";
import qrCodeImg from "@/assets/qr_code.png";

export function TravelBankingPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [amount, setAmount] = useState<string>("50000");
  const [transferContent, setTransferContent] = useState<string>("");
  const [userCode, setUserCode] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/users/me")
      .then(res => {
        setUserCode(res.data.userCode || "USER");
      })
      .catch(err => console.error("Failed to load user profile", err));
  }, []);

  const handleCreateQR = () => {
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ!");
      return;
    }
    setTransferContent(`TRV${userCode}`);
    setStep(2);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép nội dung!");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-border/40 backdrop-blur-md bg-background/50 sticky top-0 z-40">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Quay lại
        </button>
        <div className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 flex items-center gap-1.5">
          <Coins className="w-5 h-5 text-primary" /> Travel Banking
        </div>
      </div>



      {/* Main Body */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="bg-card border border-border/85 rounded-3xl p-8 shadow-2xl space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Bạn muốn nạp bao nhiêu?</h2>
                  <p className="text-muted-foreground text-sm">Hạn mức quy đổi: 1 VND = 1 Travel Point.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-muted-foreground">Số tiền muốn nạp (VND)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Nhập số tiền muốn nạp..."
                        className="w-full h-14 pl-5 pr-14 bg-muted/30 focus:bg-background rounded-2xl outline-none border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold text-lg text-foreground animate-none"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">VND</span>
                    </div>
                  </div>

                  {/* Quick Select Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    {["50000", "100000", "200000", "500000"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmount(preset)}
                        className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                          amount === preset
                            ? "bg-primary/10 text-primary border-primary"
                            : "bg-muted/30 border-border/50 text-muted-foreground hover:bg-muted/60"
                        }`}
                      >
                        {Number(preset).toLocaleString()}đ
                      </button>
                    ))}
                  </div>

                  {/* Realtime calculations */}
                  <div className="bg-muted/40 border border-border/50 rounded-2xl p-4 space-y-2 text-sm font-medium">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Thanh toán:</span>
                      <span className="text-foreground font-semibold">{Number(amount || 0).toLocaleString()} VND</span>
                    </div>
                    <div className="flex justify-between border-t border-border/40 pt-2">
                      <span className="text-muted-foreground">Bạn nhận được:</span>
                      <span className="text-primary font-bold">{Number(amount || 0).toLocaleString()} Travel Point</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCreateQR}
                  className="w-full h-14 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/95 hover:to-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  Tạo mã QR nhận tiền <Sparkles className="w-5 h-5 text-yellow-300" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="bg-card border border-border/85 rounded-3xl p-8 shadow-2xl space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center justify-center gap-2">
                    <QrCode className="w-6 h-6 text-primary" /> Quét mã QR thanh toán
                  </h2>
                  <p className="text-muted-foreground text-sm">Vui lòng quét mã QR dưới đây bằng app ngân hàng.</p>
                </div>

                {/* QR Code Container */}
                <div className="flex justify-center p-4 bg-white rounded-2xl border border-border shadow-inner max-w-[280px] mx-auto">
                  <img src={qrCodeImg} alt="Bank QR Code" className="w-full h-auto object-contain" />
                </div>

                {/* Account details */}
                <div className="bg-muted/40 border border-border/50 rounded-2xl p-5 space-y-3.5 text-sm font-medium">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Số tiền:</span>
                    <span className="text-foreground font-extrabold text-base">{Number(amount).toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-border/40 pt-3">
                    <span className="text-muted-foreground">Nội dung chuyển khoản:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-extrabold text-base tracking-wider bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
                        {transferContent}
                      </span>
                      <button 
                        onClick={() => copyToClipboard(transferContent)}
                        className="p-1.5 hover:bg-muted rounded-md transition-colors"
                      >
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-center text-xs text-muted-foreground bg-muted/30 py-3 px-4 rounded-xl border border-border/40">
                  ⚡ Chuyển khoản xong đợi hoặc thoát hệ thống sẽ tự động cộng sau 5 phút nhé.
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => navigate("/")}
                    className="w-full h-14 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/95 hover:to-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    Quay về trang chủ
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    className="w-full py-3 bg-muted/40 hover:bg-muted text-muted-foreground rounded-2xl font-semibold transition-all border border-border/50"
                  >
                    Quay lại bước 1
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
