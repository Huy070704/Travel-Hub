
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
  CheckCircle, Clock, Wallet, Star, Users, Plane, FileText, Briefcase, Camera, Loader2, ChevronDown
} from "lucide-react";
import { todayISO } from "../../../utils/dateValidation";
import { tourGuideApi, TourGuideRegistrationRequest } from "../../../api/tourGuideApi";
import { toast } from "sonner";

export function BecomeGuidePage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        if (profile.isVerified === "Pending") {
          setIsSubmitted(true);
        }
      } catch (error) {
        // Not found is fine
      } finally {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await tourGuideApi.registerAsGuide(formData);
      setIsSubmitted(true);
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

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl min-h-[80vh] flex flex-col items-center justify-center">
        <Card className="w-full text-center border-primary/20 shadow-lg animate-in fade-in zoom-in duration-300">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl sm:text-3xl">Gửi Đăng Ký Thành Công</CardTitle>
            <CardDescription className="text-base mt-2">
              Đơn đăng ký của bạn đã được tiếp nhận và hiện đang được xem xét. Chúng tôi sẽ thông báo cho bạn sau khi quá trình xác minh hoàn tất.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Thời gian xem xét dự kiến: <strong className="text-foreground">2–5 ngày làm việc</strong></span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsSubmitted(false)}>
              Xem Trạng Thái Đăng Ký
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link to="/">Quay Về Trang Chủ</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
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
                  { id: 'id-front', label: 'Mặt Trước CMND/CCCD', icon: <FileText className="h-6 w-6" /> },
                  { id: 'id-back', label: 'Mặt Sau CMND/CCCD', icon: <FileText className="h-6 w-6" /> },
                  { id: 'cert', label: 'Chứng Chỉ Hướng Dẫn Viên', icon: <Briefcase className="h-6 w-6" /> },
                  { id: 'photo', label: 'Hồ sơ CV', icon: <Briefcase className="h-6 w-6" /> },
                ].map((doc) => (
                  <div key={doc.id} className="border-2 border-dashed border-muted-foreground/30 dark:border-muted-foreground/20 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/40 dark:hover:bg-muted/10 transition-colors cursor-pointer group">
                    <div className="p-3 bg-primary/10 rounded-full text-primary mb-3 group-hover:scale-110 transition-transform">
                      {doc.icon}
                    </div>
                    <p className="font-medium text-sm mb-1">{doc.label}</p>
                    <p className="text-xs text-muted-foreground mb-3">Kéo thả hoặc nhấp để tải lên</p>
                    <Button type="button" variant="secondary" size="sm">Chọn Tệp</Button>
                  </div>
                ))}
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
              <CardTitle>Hướng Dẫn Trạng Thái Đăng Ký</CardTitle>
              <CardDescription>Điều gì xảy ra sau khi bạn đăng ký?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[13px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
                
                {/* Step 1 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-primary bg-background text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-4 rounded border bg-card shadow-sm ml-4 md:ml-0">
                    <h4 className="font-semibold text-sm">Gửi Đăng Ký</h4>
                    <p className="text-xs text-muted-foreground mt-1">Hoàn thành biểu mẫu này với thông tin của bạn.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-muted bg-background text-muted-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-4 rounded border bg-muted/20 ml-4 md:ml-0">
                    <h4 className="font-semibold text-sm text-muted-foreground">Xem Xét Xác Minh</h4>
                    <p className="text-xs text-muted-foreground mt-1">Chúng tôi xem xét tài liệu của bạn.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-muted bg-background text-muted-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-4 rounded border bg-muted/20 ml-4 md:ml-0">
                    <h4 className="font-semibold text-sm text-muted-foreground">Quản Trị Viên Phê Duyệt</h4>
                    <p className="text-xs text-muted-foreground mt-1">Nhóm của chúng tôi tiến hành đánh giá cuối cùng.</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-muted bg-background text-muted-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <span className="text-xs font-bold">4</span>
                  </div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-4 rounded border bg-muted/20 ml-4 md:ml-0">
                    <h4 className="font-semibold text-sm text-muted-foreground">Hướng Dẫn Viên Hoạt Động</h4>
                    <p className="text-xs text-muted-foreground mt-1">Bắt đầu dẫn tour!</p>
                  </div>
                </div>

              </div>
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
    </div>
  );
}

