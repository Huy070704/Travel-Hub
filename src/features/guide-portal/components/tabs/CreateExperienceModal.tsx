import { useState } from "react";
import { X, UploadCloud, MapPin, Check, Image as ImageIcon, Save, Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createTour } from "@/api/toursApi";
import { toast } from "sonner";

interface CreateExperienceModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateExperienceModal({ onClose, onCreated }: CreateExperienceModalProps) {
  const [activeSection, setActiveSection] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    departureLocation: "",
    departureDate: "",
    durationDays: 1,
    priceVND: 0,
    description: "",
    imageUrl: "",
    highlights: "",
    included: "",
    excluded: "",
    meetingPoint: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "durationDays" || name === "priceVND" ? Number(value) : value
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // Validate Basic Requirements
      if (!formData.title || !formData.destination || !formData.departureLocation || !formData.departureDate) {
        toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc!");
        setIsSubmitting(false);
        return;
      }
      
      let fullDescription = formData.description;
      if (formData.highlights) fullDescription += `\n\n**Điểm nổi bật:**\n${formData.highlights}`;
      if (formData.included) fullDescription += `\n\n**Bao gồm:**\n${formData.included}`;
      if (formData.excluded) fullDescription += `\n\n**Không bao gồm:**\n${formData.excluded}`;
      if (formData.meetingPoint) fullDescription += `\n\n**Điểm hẹn:**\n${formData.meetingPoint}`;

      await createTour({
        ...formData,
        description: fullDescription,
        imageUrl: imageUrls.join(','),
        departureDate: new Date(formData.departureDate).toISOString()
      });
      toast.success("Tạo Tour thành công!");
      onCreated();
    } catch (error: any) {
      console.error(error);
      toast.error("Lỗi: " + (error.response?.data?.message || error.message || "Có lỗi xảy ra khi tạo tour!"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [
    { id: "basic", label: "Thông tin cơ bản" },
    { id: "description", label: "Mô tả" },
    { id: "gallery", label: "Tải lên thư viện ảnh" },
    { id: "location", label: "Vị trí" },
    { id: "publish", label: "Cài đặt xuất bản" },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div>
            <h2 className="text-xl font-bold">Tạo trải nghiệm mới</h2>
            <p className="text-sm text-muted-foreground">Điền các chi tiết để liệt kê tour mới của bạn.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar Navigation */}
          <div className="w-64 bg-muted/50 border-r border-border p-6 hidden md:block">
            <div className="space-y-2 relative">
              <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-border" />
              {sections.map((section, index) => {
                const isActive = activeSection === section.id;
                const isPast = sections.findIndex(s => s.id === activeSection) > index;
                return (
                  <div key={section.id} className="relative flex items-center gap-4 py-3">
                    <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-card transition-colors ${
                      isActive ? 'border-primary ring-4 ring-primary/10' : 
                      isPast ? 'border-primary bg-primary' : 'border-border'
                    }`}>
                      {isPast ? <Check className="w-3 h-3 text-white" /> : <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary' : 'bg-transparent'}`} />}
                    </div>
                    <button 
                      onClick={() => setActiveSection(section.id)}
                      className={`text-sm font-medium transition-colors ${isActive ? 'text-primary' : isPast ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {section.label}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-2xl mx-auto space-y-8">
              
              {activeSection === "basic" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h3 className="text-xl font-bold mb-4">Thông tin cơ bản</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Tên trải nghiệm <span className="text-red-500">*</span></label>
                      <input name="title" value={formData.title} onChange={handleChange} type="text" placeholder="VD: Tour ẩm thực Phố Cổ Hà Nội" className="w-full px-4 py-2.5 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Điểm đến <span className="text-red-500">*</span></label>
                        <select name="destination" value={formData.destination} onChange={handleChange} className="w-full px-4 py-2.5 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all">
                          <option value="">Chọn Tỉnh/Thành phố</option>
                          <option value="Hà Nội">Hà Nội</option>
                          <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                          <option value="Đà Nẵng">Đà Nẵng</option>
                          <option value="Nha Trang">Nha Trang</option>
                          <option value="Phú Quốc">Phú Quốc</option>
                          <option value="Sapa">Sapa</option>
                          <option value="Hội An">Hội An</option>
                          <option value="Đà Lạt">Đà Lạt</option>
                          <option value="Hạ Long">Hạ Long</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Điểm khởi hành <span className="text-red-500">*</span></label>
                        <input name="departureLocation" value={formData.departureLocation} onChange={handleChange} type="text" placeholder="VD: Hà Nội" className="w-full px-4 py-2.5 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Giá (VND) <span className="text-red-500">*</span></label>
                        <input name="priceVND" value={formData.priceVND || ""} onChange={handleChange} type="number" placeholder="450000" className="w-full px-4 py-2.5 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Số ngày (Duration) <span className="text-red-500">*</span></label>
                        <input name="durationDays" value={formData.durationDays || ""} onChange={handleChange} type="number" placeholder="3" className="w-full px-4 py-2.5 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Ngày khởi hành <span className="text-red-500">*</span></label>
                        <input name="departureDate" value={formData.departureDate} onChange={handleChange} type="date" className="w-full px-4 py-2.5 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 flex justify-end">
                    <Button onClick={() => setActiveSection("description")}>Bước tiếp theo</Button>
                  </div>
                </div>
              )}

              {activeSection === "description" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h3 className="text-xl font-bold mb-4">Mô tả & Chi tiết</h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Mô tả đầy đủ</label>
                      <textarea name="description" value={formData.description} onChange={handleChange} rows={5} placeholder="Mô tả điều làm cho trải nghiệm của bạn trở nên độc đáo..." className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Điểm nổi bật</label>
                      <textarea name="highlights" value={formData.highlights} onChange={handleChange} rows={3} placeholder="Liệt kê 3-5 điểm nổi bật chính (mỗi điểm một dòng)" className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Dịch vụ bao gồm</label>
                        <textarea name="included" value={formData.included} onChange={handleChange} rows={3} placeholder="VD: Hướng dẫn viên địa phương, Nước lọc" className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Dịch vụ không bao gồm</label>
                        <textarea name="excluded" value={formData.excluded} onChange={handleChange} rows={3} placeholder="VD: Chi phí cá nhân, Tiền tip" className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-between">
                    <Button variant="outline" onClick={() => setActiveSection("basic")}>Quay lại</Button>
                    <Button onClick={() => setActiveSection("gallery")}>Bước tiếp theo</Button>
                  </div>
                </div>
              )}

              {activeSection === "gallery" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h3 className="text-xl font-bold mb-4">Tải lên thư viện ảnh</h3>
                  
                  <div className="mb-6 space-y-3">
                    <label className="block text-sm font-medium mb-1.5">Link ảnh Tour (Image URL)</label>
                    <div className="flex gap-2">
                      <input 
                        value={currentImageUrl} 
                        onChange={(e) => setCurrentImageUrl(e.target.value)} 
                        type="text" 
                        placeholder="https://images.unsplash.com/..." 
                        className="flex-1 px-4 py-2.5 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all" 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (currentImageUrl.trim()) {
                              setImageUrls(prev => [...prev, currentImageUrl.trim()]);
                              setCurrentImageUrl("");
                            }
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        onClick={() => {
                          if (currentImageUrl.trim()) {
                            setImageUrls(prev => [...prev, currentImageUrl.trim()]);
                            setCurrentImageUrl("");
                          }
                        }}
                      >
                        Thêm ảnh
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <p className="font-bold text-lg mb-1">Thư viện ảnh của bạn</p>
                    <p className="text-sm text-muted-foreground">Dán link vào ô phía trên và bấm "Thêm ảnh" để tạo bộ sưu tập.</p>
                  </div>

                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative aspect-video rounded-xl bg-muted border border-border group overflow-hidden">
                          <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                          <button 
                            onClick={() => setImageUrls(prev => prev.filter((_, i) => i !== index))}
                            className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-6 flex justify-between">
                    <Button variant="outline" onClick={() => setActiveSection("description")}>Quay lại</Button>
                    <Button onClick={() => setActiveSection("location")}>Bước tiếp theo</Button>
                  </div>
                </div>
              )}

              {activeSection === "location" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h3 className="text-xl font-bold mb-4">Vị trí & Điểm hẹn</h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Địa chỉ Điểm hẹn</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input name="meetingPoint" value={formData.meetingPoint} onChange={handleChange} type="text" placeholder="VD: 1 Tràng Tiền, Hoàn Kiếm, Hà Nội" className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                      </div>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-border bg-muted aspect-[2/1] relative flex items-center justify-center">
                      {/* Google Maps Mock */}
                      <div className="absolute inset-0 bg-muted/80 opacity-50"></div>
                      <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Hanoi&zoom=14&size=800x400&sensor=false')] bg-cover bg-center mix-blend-multiply opacity-20"></div>
                      <div className="relative z-10 flex flex-col items-center text-muted-foreground">
                        <MapPin className="w-8 h-8 mb-2" />
                        <span className="font-medium">Bản đồ tương tác</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-between">
                    <Button variant="outline" onClick={() => setActiveSection("gallery")}>Quay lại</Button>
                    <Button onClick={() => setActiveSection("publish")}>Bước tiếp theo</Button>
                  </div>
                </div>
              )}

              {activeSection === "publish" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Bạn sắp hoàn tất!</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Chi tiết trải nghiệm của bạn đã hoàn thành. Bạn có thể lưu bản nháp để chỉnh sửa sau, hoặc gửi cho quản trị viên phê duyệt để xuất bản.
                    </p>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800/50 rounded-xl p-4 flex gap-3 text-sm">
                    <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>Lưu ý: Sau khi gửi, nhóm của chúng tôi sẽ xem xét trải nghiệm của bạn trong vòng 24-48 giờ. Đảm bảo tất cả các chi tiết tuân thủ nguyên tắc của TravelHub.</p>
                  </div>

                  <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" size="lg" className="gap-2" onClick={onClose} disabled={isSubmitting}>
                      <X className="w-5 h-5" />
                      Hủy bỏ
                    </Button>
                    <Button size="lg" className="gap-2" onClick={handleSubmit} disabled={isSubmitting}>
                      <Send className="w-5 h-5" />
                      {isSubmitting ? "Đang tạo..." : "Tạo Tour và Xuất bản"}
                    </Button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
