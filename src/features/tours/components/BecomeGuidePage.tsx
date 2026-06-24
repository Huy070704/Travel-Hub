
import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Checkbox } from "../../../components/ui/checkbox";

import { 
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator 
} from "../../../components/ui/breadcrumb";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "../../../components/ui/dialog";
import {
  CheckCircle, Clock, Wallet, Star, Users, Plane, FileText, Briefcase, Camera, Loader2, ChevronDown, XCircle, MessageSquareText
} from "lucide-react";
import { todayISO } from "../../../utils/dateValidation";
import { tourGuideApi, TourGuideRegistrationRequest } from "../../../api/tourGuideApi";
import { toast } from "sonner";

// Trạng thái hồ sơ HDV: "idle" = chưa đăng ký, còn lại khớp với backend IsVerified
type GuideStatus = "idle" | "Pending" | "Approved" | "Rejected";

export const getFileUrl = (path: string | undefined | null) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = ((import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace('/api', '');
  return `${baseUrl}${path}`;
};

// Trạng thái hiển thị của từng bước trong timeline
type StepState = "idle" | "active" | "loading" | "waiting" | "complete" | "rejected" | "disabled";

const REGISTER_STEPS = [
  { title: "Gửi Đăng Ký", desc: "Hoàn thành biểu mẫu này với thông tin của bạn." },
  { title: "Xem Xét Xác Minh", desc: "Hệ thống tự động kiểm tra và chuyển hồ sơ vào hàng chờ của quản trị viên." },
  { title: "Quản Trị Viên Phê Duyệt", desc: "Quản trị viên tiến hành đánh giá và đưa ra quyết định cuối cùng." },
  { title: "Hướng Dẫn Viên Hoạt Động", desc: "Tài khoản được kích hoạt quyền HDV. Bắt đầu dẫn tour!" },
];

// Ánh xạ trạng thái hồ sơ -> trạng thái 4 bước trên timeline
function getStepStates(status: GuideStatus, verifying: boolean): StepState[] {
  switch (status) {
    case "Approved":
      // Admin bấm "Chấp nhận": tất cả bước xanh, tài khoản kích hoạt quyền HDV
      return ["complete", "complete", "complete", "complete"];
    case "Rejected":
      // Admin bấm "Từ chối": bước 3 báo từ chối, bước 4 chuyển xám/disabled
      return ["complete", "complete", "rejected", "disabled"];
    case "Pending":
      // Vừa gửi: bước 2 "xác minh" vài giây rồi xanh; sau đó bước 3 loading chờ admin duyệt
      return verifying
        ? ["complete", "loading", "idle", "idle"]
        : ["complete", "complete", "waiting", "idle"];
    default:
      // Chưa gửi đăng ký
      return ["active", "idle", "idle", "idle"];
  }
}

function StepNode({ state, index }: { state: StepState; index: number }) {
  const base =
    "flex items-center justify-center w-8 h-8 rounded-full border-2 shrink-0 z-10 shadow-sm transition-colors";
  switch (state) {
    case "complete":
      return <div className={`${base} border-green-500 bg-green-500 text-white`}><CheckCircle className="h-4 w-4" /></div>;
    case "loading":
      return <div className={`${base} border-yellow-500 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500`}><Clock className="h-4 w-4" /></div>;
    case "waiting":
      return <div className={`${base} border-yellow-500 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500`}><Clock className="h-4 w-4" /></div>;
    case "rejected":
      return <div className={`${base} border-red-500 bg-red-500 text-white`}><XCircle className="h-4 w-4" /></div>;
    case "disabled":
      return <div className={`${base} border-muted bg-muted/30 text-muted-foreground/40`}><span className="text-xs font-bold">{index + 1}</span></div>;
    case "active":
      return <div className={`${base} border-primary bg-background text-primary`}><span className="text-xs font-bold">{index + 1}</span></div>;
    default:
      return <div className={`${base} border-muted bg-background text-muted-foreground`}><span className="text-xs font-bold">{index + 1}</span></div>;
  }
}

// Timeline động dùng chung cho sidebar và màn hình trạng thái
function StatusTimeline({
  status,
  verifying,
  onStep3Click,
}: {
  status: GuideStatus;
  verifying: boolean;
  onStep3Click?: () => void;
}) {
  const states = getStepStates(status, verifying);
  return (
    <div className="space-y-5 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:-translate-x-1/2 before:bg-muted">
      {REGISTER_STEPS.map((step, i) => {
        const state = states[i];
        // Bước 3 (index 2) click được để xem ghi chú của admin khi đã duyệt/từ chối
        const clickable = i === 2 && !!onStep3Click && (state === "complete" || state === "rejected");
        const cardClass =
          state === "complete" ? "border-green-500/30 bg-green-500/5"
          : (state === "loading" || state === "waiting") ? "border-yellow-500/40 bg-yellow-500/5"
          : state === "rejected" ? "border-red-500/30 bg-red-500/5"
          : state === "disabled" ? "border-transparent bg-muted/10 opacity-50"
          : state === "active" ? "border-primary/30 bg-card"
          : "border-transparent bg-muted/20";
        const titleClass =
          (state === "loading" || state === "waiting") ? "text-yellow-600 dark:text-yellow-500"
          : state === "rejected" ? "text-red-600 dark:text-red-500"
          : state === "disabled" ? "text-muted-foreground/50"
          : state === "complete" || state === "active" ? "text-foreground"
          : "text-muted-foreground";
        const badge =
          (state === "loading" || state === "waiting") ? "Đang xem xét"
          : state === "rejected" ? "Bị từ chối"
          : null;
        return (
          <div key={i} className="relative flex items-center gap-4">
            <StepNode state={state} index={i} />
            <div
              className={`flex-1 p-3 rounded border shadow-sm transition-all ${cardClass} ${
                clickable ? "cursor-pointer hover:shadow-md hover:border-primary/50" : ""
              }`}
              role={clickable ? "button" : undefined}
              tabIndex={clickable ? 0 : undefined}
              onClick={clickable ? onStep3Click : undefined}
              onKeyDown={
                clickable
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onStep3Click?.();
                      }
                    }
                  : undefined
              }
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className={`font-semibold text-sm ${titleClass}`}>{step.title}</h4>
                <div className="flex items-center gap-1.5 shrink-0">
                  {badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                        (state === "loading" || state === "waiting")
                          ? "bg-yellow-500/15 text-yellow-600 dark:text-yellow-500"
                          : "bg-red-500/15 text-red-600 dark:text-red-500"
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                  {clickable && <MessageSquareText className="h-4 w-4 text-primary" />}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
              {clickable && (
                <p className="text-[11px] font-medium text-primary mt-1.5">Xem ghi chú của Admin →</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function BecomeGuidePage() {
  const [status, setStatus] = useState<GuideStatus>("idle");
  const [verifying, setVerifying] = useState(false);
  const [adminNote, setAdminNote] = useState<string | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<TourGuideRegistrationRequest>({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    experience: "0-1",
    languages: "",
    locations: "",
    bio: "",
    tourCategories: "",
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const profile = await tourGuideApi.getMyProfile();
        // Khớp trực tiếp trạng thái backend: Pending / Approved / Rejected
        if (profile?.isVerified) {
          setStatus(profile.isVerified as GuideStatus);
        }
        setAdminNote(profile?.adminNote ?? null);
      } catch (error) {
        // Chưa có hồ sơ (404) -> giữ trạng thái "idle", hiển thị form
      } finally {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, []);

  const handleFileUpload = async (id: string, file: File) => {
    setUploading(prev => ({ ...prev, [id]: true }));
    try {
      const url = await tourGuideApi.uploadFile(file);
      toast.success(`Đã tải lên ${file.name} thành công!`);
      
      if (id === 'id-front') setFormData(prev => ({ ...prev, idFrontUrl: url }));
      if (id === 'id-back') setFormData(prev => ({ ...prev, idBackUrl: url }));
      if (id === 'cert') setFormData(prev => ({ ...prev, certUrl: url }));
      if (id === 'photo') setFormData(prev => ({ ...prev, guideAvatarUrl: url }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Lỗi tải lên file ${file.name}`);
    } finally {
      setUploading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await tourGuideApi.registerAsGuide(formData);
      // Hệ thống xác nhận: bước 1 hoàn tất. Bước 2 "xác minh" vài giây rồi xanh,
      // sau đó bước 3 chuyển sang "đang xem xét" chờ admin duyệt.
      setStatus("Pending");
      setVerifying(true);
      window.setTimeout(() => setVerifying(false), 15 * 60 * 1000); // 15 minutes
      toast.success("Đăng ký thành công! Đang chờ duyệt.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi đăng ký.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center gap-1.5">
                <Plane className="h-4 w-4" />
                Trang chủ
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Trở thành Hướng dẫn viên</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Introduction Section */}
          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-primary/5 to-background">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl">Trở thành Đối tác Hướng dẫn viên</CardTitle>
              <CardDescription className="text-base">
                Tạo ra những trải nghiệm du lịch độc đáo cho du khách và kiếm thu nhập từ công việc bạn yêu thích.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex gap-3 items-start p-4 rounded-lg bg-background/60 backdrop-blur-sm border shadow-sm transition-all hover:shadow-md">
                  <Clock className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Lịch làm việc linh hoạt</h4>
                    <p className="text-sm text-muted-foreground">Làm việc khi nào và như thế nào bạn muốn.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start p-4 rounded-lg bg-background/60 backdrop-blur-sm border shadow-sm transition-all hover:shadow-md">
                  <Wallet className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Kiếm thu nhập từ các chuyến đi</h4>
                    <p className="text-sm text-muted-foreground">Tự định giá và giữ lại nhiều hơn.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start p-4 rounded-lg bg-background/60 backdrop-blur-sm border shadow-sm transition-all hover:shadow-md">
                  <Star className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Xây dựng danh tiếng</h4>
                    <p className="text-sm text-muted-foreground">Nhận đánh giá và phát triển công việc của bạn.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start p-4 rounded-lg bg-background/60 backdrop-blur-sm border shadow-sm transition-all hover:shadow-md">
                  <Users className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Kết nối với du khách</h4>
                    <p className="text-sm text-muted-foreground">Gặp gỡ mọi người từ khắp nơi trên thế giới.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1 - Personal Information */}
            <Card className="animate-in fade-in duration-300">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">1</span>
                  Thông Tin Cá Nhân
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input id="fullName" placeholder="Nguyễn Văn A" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Ngày sinh</Label>
                  <Input id="dob" type="date" max={todayISO()} required value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Giới tính</Label>
                  <div className="relative group">
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className={`flex h-10 w-full appearance-none items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary/50 cursor-pointer ${!formData.gender ? "text-muted-foreground" : "text-foreground"}`}
                    >
                      <option value="" disabled hidden>Chọn giới tính</option>
                      <option value="male" className="text-foreground">Nam</option>
                      <option value="female" className="text-foreground">Nữ</option>
                      <option value="other" className="text-foreground">Khác</option>
                      <option value="prefer-not-to-say" className="text-foreground">Không muốn tiết lộ</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" type="tel" placeholder="0987654321" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Địa chỉ Email</Label>
                  <Input id="email" type="email" placeholder="nguyenvana@example.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Địa chỉ đầy đủ</Label>
                  <Input id="address" placeholder="123 Đường Lê Lợi, Quận 1, TP.HCM" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
              </CardContent>
            </Card>

            {/* Section 2 - Guide Information */}
            <Card className="animate-in fade-in duration-300 delay-75">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">2</span>
                  Thông Tin Hướng Dẫn Viên
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="experience">Số năm kinh nghiệm</Label>
                  <div className="relative group">
                    <select
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className={`flex h-10 w-full appearance-none items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary/50 cursor-pointer ${!formData.experience ? "text-muted-foreground" : "text-foreground"}`}
                    >
                      <option value="" disabled hidden>Chọn số năm</option>
                      <option value="0-1" className="text-foreground">0-1 năm (Người mới)</option>
                      <option value="1-3" className="text-foreground">1-3 năm</option>
                      <option value="3-5" className="text-foreground">3-5 năm</option>
                      <option value="5+" className="text-foreground">5+ năm (Chuyên gia)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none group-hover:text-primary transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="languages">Ngôn ngữ sử dụng</Label>
                  <Input id="languages" placeholder="VD: Tiếng Việt, Tiếng Anh" value={formData.languages} onChange={e => setFormData({...formData, languages: e.target.value})} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="locations">Địa điểm hoạt động</Label>
                  <Input id="locations" placeholder="VD: Hà Nội, Đà Nẵng, TP.HCM" value={formData.locations} onChange={e => setFormData({...formData, locations: e.target.value})} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Giới thiệu bản thân</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Hãy chia sẻ về kinh nghiệm, phong cách dẫn tour và những điều thú vị về bạn..." 
                    className="min-h-[120px]"
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <Label>Danh mục Tour</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {["Tour Thành Phố", "Tour Ẩm Thực", "Tour Văn Hóa", "Tour Lịch Sử", "Tour Thiên Nhiên", "Tour Khám Phá", "Khác"].map((cat) => (
                      <div key={cat} className="flex items-center space-x-2 bg-muted/40 dark:bg-muted/20 p-2 rounded-md border border-transparent hover:border-primary/30 transition-colors">
                        <Checkbox 
                           id={`cat-${cat}`} 
                           checked={formData.tourCategories?.includes(cat)}
                           onCheckedChange={(checked) => {
                             let cats = formData.tourCategories ? formData.tourCategories.split(',').filter(Boolean) : [];
                             if (checked) cats.push(cat);
                             else cats = cats.filter(c => c !== cat);
                             setFormData({...formData, tourCategories: cats.join(',')})
                           }}
                        />
                        <label
                          htmlFor={`cat-${cat}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                        >
                          {cat}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3 - Verification Documents */}
            <Card className="animate-in fade-in duration-300 delay-100">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">3</span>
                  Tài Liệu Xác Minh
                </CardTitle>
                <CardDescription>Tải lên ảnh rõ nét của các tài liệu.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'id-front', label: 'Mặt Trước CMND/CCCD', icon: <FileText className="h-6 w-6" />, field: 'idFrontUrl' },
                  { id: 'id-back', label: 'Mặt Sau CMND/CCCD', icon: <FileText className="h-6 w-6" />, field: 'idBackUrl' },
                  { id: 'cert', label: 'Chứng Chỉ Hướng Dẫn Viên', icon: <Briefcase className="h-6 w-6" />, field: 'certUrl' },
                  { id: 'photo', label: 'Hồ sơ CV (hoặc Ảnh Thẻ)', icon: <Camera className="h-6 w-6" />, field: 'guideAvatarUrl' },
                ].map((doc) => {
                  const isUploaded = !!formData[doc.field as keyof TourGuideRegistrationRequest];
                  const isUploading = uploading[doc.id];
                  return (
                  <div key={doc.id} className={`relative border-2 border-dashed ${isUploaded ? 'border-green-500 bg-green-50 dark:bg-green-500/10' : 'border-muted-foreground/30 dark:border-muted-foreground/20'} rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/40 dark:hover:bg-muted/10 transition-colors cursor-pointer group overflow-hidden min-h-[200px]`}>
                    <input 
                      type="file" 
                      accept="image/*,.pdf" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(doc.id, file);
                        // Reset input để có thể chọn lại cùng 1 file
                        e.target.value = '';
                      }}
                      disabled={isUploading}
                    />
                    
                    {isUploaded && !isUploading ? (
                      <div className="absolute inset-0 w-full h-full p-1 z-0">
                        {String(formData[doc.field as keyof TourGuideRegistrationRequest] || '').toLowerCase().endsWith('.pdf') ? (
                           <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-muted rounded-md shadow-sm">
                              <FileText className="h-10 w-10 text-red-500 mb-2" />
                              <span className="text-xs font-semibold">Tài liệu PDF</span>
                           </div>
                        ) : (
                          <img 
                            src={getFileUrl(formData[doc.field as keyof TourGuideRegistrationRequest] as string)} 
                            alt="Preview" 
                            className="w-full h-full object-cover rounded-md opacity-90 group-hover:opacity-100 transition-opacity" 
                          />
                        )}
                        <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-md z-10">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={`p-3 rounded-full mb-3 group-hover:scale-110 transition-transform ${isUploaded ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
                          {isUploaded ? <CheckCircle className="h-6 w-6" /> : doc.icon}
                        </div>
                        <p className="font-medium text-sm mb-1">{doc.label}</p>
                        <p className="text-xs text-muted-foreground mb-3">
                          {isUploading ? "Đang tải lên..." : "Kéo thả hoặc nhấp để tải lên"}
                        </p>
                      </>
                    )}
                    
                    <Button type="button" variant={isUploaded ? "outline" : "secondary"} size="sm" className={`relative z-10 mt-auto ${isUploaded ? "border-green-500 text-green-700 bg-green-50 hover:bg-green-100 shadow-sm" : ""}`}>
                      {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tải...</> : isUploaded ? "Tải Lại Tệp" : "Chọn Tệp"}
                    </Button>
                  </div>
                )})}
              </CardContent>
            </Card>

            {/* Section 5 - Review & Submit */}
            <Card className="bg-muted/20 dark:bg-muted/10 animate-in fade-in duration-300 delay-200 border-primary/10">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">5</span>
                  Xem Lại & Gửi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox id="terms" required className="mt-1" />
                    <div className="space-y-1 leading-none">
                      <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                        Tôi đồng ý với Điều Khoản Dịch Vụ
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Bạn đồng ý tuân thủ các nguyên tắc dành cho đối tác và điều khoản dịch vụ.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox id="privacy" required className="mt-1" />
                    <div className="space-y-1 leading-none">
                      <label htmlFor="privacy" className="text-sm font-medium cursor-pointer">
                        Tôi đồng ý với Chính Sách Bảo Mật
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Dữ liệu cá nhân của bạn sẽ được xử lý theo chính sách bảo mật của chúng tôi.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-4 border-t pt-6">
                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang gửi...</> : "Gửi Đăng Ký"}
                </Button>
                <Button type="button" variant="outline" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                  Lưu Nháp
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        {/* Sidebar (Desktop only) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-24 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trạng Thái Đăng Ký</CardTitle>
              <CardDescription>Điều gì xảy ra sau khi bạn đăng ký?</CardDescription>
            </CardHeader>
            <CardContent>
              <StatusTimeline status={status} verifying={verifying} onStep3Click={() => setNoteOpen(true)} />
            </CardContent>
            <CardFooter className="bg-muted/50 border-t mt-4">
              <div className="flex items-center gap-2 pt-4 pb-2 w-full justify-center text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Thời gian xem xét dự kiến: <strong>2–5 ngày làm việc</strong></span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Modal hiển thị ghi chú của Admin khi click vào bước 3 (đã duyệt/từ chối) */}
      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-primary" />
              Ghi chú của Admin
            </DialogTitle>
            <DialogDescription asChild>
              {adminNote && adminNote.trim() ? (
                <p className="text-foreground whitespace-pre-line pt-2 text-sm leading-relaxed">{adminNote}</p>
              ) : (
                <p className="italic pt-2 text-sm">Người phê duyệt đã không note gì thêm.</p>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

