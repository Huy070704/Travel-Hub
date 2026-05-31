import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Mail,
  Lock,
  User,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  Plane,
  MapPin,
  Compass,
  Globe,
  KeyRound
} from "lucide-react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { FloatingBlob } from "../../../components/shared/AnimatedBackground";
import { GlowingButton } from "../../../components/shared/GlowingButton";
import { DarkModeToggle } from "../../../components/shared/DarkModeToggle";
import {
  requestForgotPasswordOtp,
  requestRegisterOtp,
  verifyForgotPasswordOtp,
  verifyRegisterOtp
} from "@/api/authApi";

type AuthMode = "login" | "register" | "registerOtp" | "forgot" | "forgotOtp";

const getErrorMessage = (error: any, fallback: string) => {
  if (error.response?.data) {
    return typeof error.response.data === "string"
      ? error.response.data
      : error.response.data.message || fallback;
  }

  return "Lỗi mạng. Vui lòng thử lại sau.";
};

export function AuthPage() {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    fullName: "",
    rememberMe: false,
  });
  const [otpData, setOtpData] = useState({
    otp: "",
    newPassword: "",
  });

  const resetMessages = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  const switchMode = (nextMode: AuthMode) => {
    resetMessages();
    setMode(nextMode);
    setOtpData({ otp: "", newPassword: "" });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    resetMessages();

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      navigate("/");
    } catch (error: any) {
      console.error("Login failed:", error);
      setErrorMsg(getErrorMessage(error, "Email hoặc mật khẩu không đúng."));
    } finally {
      setIsLoading(false);
    }
  };

  const sendRegisterOtp = async () => {
    setIsLoading(true);
    resetMessages();

    try {
      await requestRegisterOtp({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });
      setSuccessMsg("Mã OTP 6 chữ số đã được gửi đến email của bạn.");
      setMode("registerOtp");
    } catch (error: any) {
      console.error("Register OTP failed:", error);
      setErrorMsg(getErrorMessage(error, "Không thể gửi OTP đăng ký."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendRegisterOtp();
  };

  const handleVerifyRegisterOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    resetMessages();

    try {
      await verifyRegisterOtp({
        email: formData.email,
        otp: otpData.otp,
      });
      setSuccessMsg("Tạo tài khoản thành công. Vui lòng đăng nhập.");
      setMode("login");
    } catch (error: any) {
      console.error("Register OTP verification failed:", error);
      setErrorMsg(getErrorMessage(error, "Mã OTP không hợp lệ hoặc đã hết hạn."));
    } finally {
      setIsLoading(false);
    }
  };

  const sendForgotPasswordOtp = async () => {
    setIsLoading(true);
    resetMessages();

    try {
      await requestForgotPasswordOtp({ email: formData.email });
      setSuccessMsg("Mã OTP 6 chữ số đã được gửi đến email của bạn.");
      setMode("forgotOtp");
    } catch (error: any) {
      console.error("Forgot password OTP failed:", error);
      setErrorMsg(getErrorMessage(error, "Không thể gửi OTP đặt lại mật khẩu."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendForgotPasswordOtp();
  };

  const handleVerifyForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    resetMessages();

    try {
      await verifyForgotPasswordOtp({
        email: formData.email,
        otp: otpData.otp,
        newPassword: otpData.newPassword,
      });
      setSuccessMsg("Đặt lại mật khẩu thành công. Vui lòng đăng nhập.");
      setMode("login");
    } catch (error: any) {
      console.error("Forgot password OTP verification failed:", error);
      setErrorMsg(getErrorMessage(error, "Mã OTP không hợp lệ hoặc đã hết hạn."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;

    setIsLoading(true);
    resetMessages();

    try {
      await googleLogin(credentialResponse.credential);
      navigate("/");
    } catch (error: any) {
      console.error("Google Login failed:", error);
      setErrorMsg(getErrorMessage(error, "Đăng nhập Google thất bại."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrorMsg("Đăng nhập Google đã bị hủy hoặc thất bại.");
  };

  const title =
    mode === "register"
      ? "Tạo tài khoản"
      : mode === "forgot"
        ? "Quên mật khẩu"
        : mode === "registerOtp"
          ? "Xác minh email"
          : mode === "forgotOtp"
            ? "Đặt lại mật khẩu"
            : "Chào mừng trở lại";

  const subtitle =
    mode === "register"
      ? "Nhập thông tin của bạn, TravelHub sẽ gửi OTP đến email"
      : mode === "forgot"
        ? "Nhập email để nhận OTP đặt lại mật khẩu"
        : mode === "registerOtp"
          ? `Nhập OTP đã gửi đến ${formData.email}`
          : mode === "forgotOtp"
            ? `Nhập OTP đã gửi đến ${formData.email}`
            : "Nhập thông tin đăng nhập để tiếp tục";

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingBlob
        delay={0}
        className="w-[800px] h-[800px] bg-gradient-to-br from-purple-500/30 to-blue-500/30 -top-1/4 -left-1/4"
      />
      <FloatingBlob
        delay={2}
        className="w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/30 to-teal-500/30 top-1/2 right-0"
      />
      <FloatingBlob
        delay={4}
        className="w-[500px] h-[500px] bg-gradient-to-br from-orange-500/20 to-pink-500/20 bottom-0 left-1/3"
      />

      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      <Link to="/">
        <motion.button
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 glass rounded-full hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-semibold">Về trang chủ</span>
        </motion.button>
      </Link>

      <div className="fixed top-6 right-6 z-50">
        <DarkModeToggle />
      </div>

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative">
        <motion.div
          className="hidden lg:flex items-center justify-center p-12 relative overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative z-10 max-w-lg">
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
                <Plane className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">TravelHub</h1>
                <p className="text-sm text-muted-foreground">Du lịch bằng AI</p>
              </div>
            </motion.div>

            <motion.h2
              className="text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Bắt đầu chuyến đi
              <br />
              <span className="gradient-text">tiếp theo ngay hôm nay</span>
            </motion.h2>

            <motion.p
              className="text-lg text-muted-foreground mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Tham gia cùng hàng nghìn sinh viên khám phá thế giới tiết kiệm. Nhận gợi ý từ AI và kết nối bạn đồng hành.
            </motion.p>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[
                { icon: Sparkles, text: "Gợi ý điểm đến bằng AI" },
                { icon: Globe, text: "200+ điểm đến vừa túi tiền" },
                { icon: MapPin, text: "Kết nối với 50k+ sinh viên mê du lịch" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 glass px-4 py-3 rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            <div className="absolute inset-0 pointer-events-none">
              {[
                { Icon: Plane, x: "10%", y: "20%", delay: 0, rotate: 15 },
                { Icon: Compass, x: "80%", y: "30%", delay: 2, rotate: -20 },
                { Icon: MapPin, x: "15%", y: "75%", delay: 4, rotate: 10 },
                { Icon: Globe, x: "85%", y: "70%", delay: 3, rotate: -15 },
              ].map(({ Icon, x, y, delay, rotate }, index) => (
                <motion.div
                  key={index}
                  className="absolute opacity-10"
                  style={{ left: x, top: y }}
                  animate={{
                    y: [0, -30, 0],
                    rotate: [rotate, rotate + 20, rotate],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    delay,
                    ease: "easeInOut",
                  }}
                >
                  <Icon className="w-20 h-20 text-primary" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="flex items-center justify-center p-6 lg:p-12 relative">
          <motion.div
            className="w-full max-w-md relative z-10"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass rounded-3xl p-8 shadow-2xl neon-primary">
              <div className="text-center mb-8">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold gradient-text">Chào mừng đến TravelHub</span>
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.h2
                    key={mode}
                    className="text-3xl font-bold mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {title}
                  </motion.h2>
                </AnimatePresence>

                <p className="text-muted-foreground">{subtitle}</p>
              </div>

              {mode === "login" && (
                <>
                  <div className="flex justify-center mb-6 w-full">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      theme="outline"
                      size="large"
                      text="continue_with"
                      width="100%"
                    />
                  </div>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-card text-muted-foreground">Hoặc tiếp tục bằng email</span>
                    </div>
                  </div>
                </>
              )}

              <AnimatePresence mode="wait">
                {mode === "login" && (
                  <motion.form
                    key="login"
                    onSubmit={handleLoginSubmit}
                    className="space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <EmailField value={formData.email} onChange={(email) => setFormData({ ...formData, email })} />
                    <PasswordField
                      label="Mật khẩu"
                      value={formData.password}
                      show={showPassword}
                      onToggle={() => setShowPassword(!showPassword)}
                      onChange={(password) => setFormData({ ...formData, password })}
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.rememberMe}
                          onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                          className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm text-muted-foreground">Ghi nhớ đăng nhập</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => switchMode("forgot")}
                          className="text-sm text-primary hover:underline font-semibold"
                        >
                          Quên mật khẩu?
                        </button>
                        <button
                          type="button"
                          onClick={() => switchMode("register")}
                          className="text-sm text-primary hover:underline font-semibold"
                        >
                          Đăng ký
                        </button>
                      </div>
                    </div>

                    <StatusMessage errorMsg={errorMsg} successMsg={successMsg} />
                    <GlowingButton type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </GlowingButton>
                  </motion.form>
                )}

                {mode === "register" && (
                  <motion.form
                    key="register"
                    onSubmit={handleRegisterSubmit}
                    className="space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <TextField
                      label="Họ và tên"
                      icon={User}
                      value={formData.fullName}
                      placeholder="Nguyễn Văn A"
                      onChange={(fullName) => setFormData({ ...formData, fullName })}
                    />
                    <TextField
                      label="Tên người dùng"
                      icon={User}
                      value={formData.username}
                      placeholder="johnstudent"
                      onChange={(username) => setFormData({ ...formData, username })}
                      required
                    />
                    <EmailField value={formData.email} onChange={(email) => setFormData({ ...formData, email })} />
                    <PasswordField
                      label="Mật khẩu"
                      value={formData.password}
                      show={showPassword}
                      onToggle={() => setShowPassword(!showPassword)}
                      onChange={(password) => setFormData({ ...formData, password })}
                    />
                    <StatusMessage errorMsg={errorMsg} successMsg={successMsg} />
                    <GlowingButton type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Đang gửi OTP..." : "Gửi OTP đăng ký"}
                    </GlowingButton>
                    <AuthBackButton onClick={() => switchMode("login")} text="Quay lại đăng nhập" />
                  </motion.form>
                )}

                {mode === "registerOtp" && (
                  <OtpForm
                    key="registerOtp"
                    otp={otpData.otp}
                    isLoading={isLoading}
                    errorMsg={errorMsg}
                    successMsg={successMsg}
                    submitLabel="Xác minh & tạo tài khoản"
                    loadingLabel="Đang xác minh..."
                    onOtpChange={(otp) => setOtpData({ ...otpData, otp })}
                    onSubmit={handleVerifyRegisterOtp}
                    onBack={() => switchMode("register")}
                    onResend={sendRegisterOtp}
                  />
                )}

                {mode === "forgot" && (
                  <motion.form
                    key="forgot"
                    onSubmit={handleForgotSubmit}
                    className="space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <EmailField value={formData.email} onChange={(email) => setFormData({ ...formData, email })} />
                    <StatusMessage errorMsg={errorMsg} successMsg={successMsg} />
                    <GlowingButton type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Đang gửi OTP..." : "Gửi OTP đặt lại"}
                    </GlowingButton>
                    <AuthBackButton onClick={() => switchMode("login")} text="Quay lại đăng nhập" />
                  </motion.form>
                )}

                {mode === "forgotOtp" && (
                  <motion.form
                    key="forgotOtp"
                    onSubmit={handleVerifyForgotOtp}
                    className="space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <OtpInput value={otpData.otp} onChange={(otp) => setOtpData({ ...otpData, otp })} />
                    <PasswordField
                      label="Mật khẩu mới"
                      value={otpData.newPassword}
                      show={showNewPassword}
                      onToggle={() => setShowNewPassword(!showNewPassword)}
                      onChange={(newPassword) => setOtpData({ ...otpData, newPassword })}
                    />
                    <StatusMessage errorMsg={errorMsg} successMsg={successMsg} />
                    <GlowingButton type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Đang đặt lại..." : "Xác minh & đặt lại mật khẩu"}
                    </GlowingButton>
                    <div className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={sendForgotPasswordOtp}
                        className="text-sm text-primary hover:underline font-semibold"
                      >
                        Gửi lại OTP
                      </button>
                      <button
                        type="button"
                        onClick={() => switchMode("forgot")}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        Đổi email
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <div className="lg:hidden flex items-center justify-center gap-2 mt-8">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">TravelHub</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function TextField({
  label,
  icon: Icon,
  value,
  placeholder,
  onChange,
  required = false,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 bg-background/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
          required={required}
        />
      </div>
    </div>
  );
}

function EmailField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">Địa chỉ email</label>
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="you@example.com"
          className="w-full pl-12 pr-4 py-3 bg-background/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
          required
        />
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  show,
  onToggle,
  onChange,
}: {
  label: string;
  value: string;
  show: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">{label}</label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Mật khẩu"
          className="w-full pl-12 pr-12 py-3 bg-background/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
          required
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

function OtpInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">Mã OTP</label>
      <div className="relative">
        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="Nhập mã 6 chữ số"
          className="w-full pl-12 pr-4 py-3 bg-background/50 border border-border rounded-xl tracking-[0.4em] focus:ring-2 focus:ring-primary outline-none transition-all"
          required
        />
      </div>
    </div>
  );
}

function OtpForm({
  otp,
  isLoading,
  errorMsg,
  successMsg,
  submitLabel,
  loadingLabel,
  onOtpChange,
  onSubmit,
  onBack,
  onResend,
}: {
  otp: string;
  isLoading: boolean;
  errorMsg: string;
  successMsg: string;
  submitLabel: string;
  loadingLabel: string;
  onOtpChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  onResend: () => void;
}) {
  return (
    <motion.form
      onSubmit={onSubmit}
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <OtpInput value={otp} onChange={onOtpChange} />
      <StatusMessage errorMsg={errorMsg} successMsg={successMsg} />
      <GlowingButton type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? loadingLabel : submitLabel}
      </GlowingButton>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onResend}
          className="text-sm text-primary hover:underline font-semibold"
        >
          Gửi lại OTP
        </button>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Đổi thông tin
        </button>
      </div>
    </motion.form>
  );
}

function StatusMessage({ errorMsg, successMsg }: { errorMsg: string; successMsg: string }) {
  if (errorMsg) {
    return (
      <div className="text-red-500 text-sm font-semibold text-center bg-red-500/10 py-2 rounded-lg">
        {errorMsg}
      </div>
    );
  }

  if (successMsg) {
    return (
      <div className="text-green-600 text-sm font-semibold text-center bg-green-500/10 py-2 rounded-lg">
        {successMsg}
      </div>
    );
  }

  return null;
}

function AuthBackButton({ onClick, text }: { onClick: () => void; text: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
    >
      {text}
    </button>
  );
}
