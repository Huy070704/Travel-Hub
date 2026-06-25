import { useState, useEffect } from "react";
import { X, UploadCloud, Loader2, Save, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createDestination, updateDestination } from "@/api/destinationsApi";
import { tourGuideApi } from "@/api/tourGuideApi";
import { toast } from "sonner";
import type { DestinationDto } from "@/types/destinations";

interface DestinationModalProps {
  onClose: () => void;
  onSaved: () => void;
  initialData?: DestinationDto | null;
}

export function DestinationModal({ onClose, onSaved, initialData }: DestinationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isEditMode] = useState(!!initialData);

  const [formData, setFormData] = useState({
    name: "",
    cityProvince: "",
    description: "",
    keyMain: "",
    rate: 5.0,
    entranceFee: 0,
    accommodationCost: 0,
    totalTourCost: 0,
    tourPricePerPerson: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        cityProvince: initialData.cityProvince || "",
        description: initialData.description || "",
        keyMain: initialData.keyMain || "",
        rate: initialData.rate || 5.0,
        entranceFee: initialData.entranceFee || 0,
        accommodationCost: initialData.accommodationCost || 0,
        totalTourCost: initialData.totalTourCost || 0,
        tourPricePerPerson: initialData.tourPricePerPerson || 0
      });
      if (initialData.image) {
        setImageUrls(initialData.image.split(',').filter(Boolean));
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumberField = ['rate', 'entranceFee', 'accommodationCost', 'totalTourCost', 'tourPricePerPerson'].includes(name);
    setFormData(prev => ({
      ...prev,
      [name]: isNumberField ? Number(value) : value
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const url = await tourGuideApi.uploadFile(file);
      setImageUrls(prev => [...prev, url]);
      toast.success("Tải ảnh lên thành công!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi tải ảnh lên");
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      if (!formData.name || !formData.cityProvince) {
        toast.error("Vui lòng nhập tên điểm đến và Tỉnh/Thành phố!");
        return;
      }

      const submitData = {
        ...formData,
        image: imageUrls.join(',')
      };

      if (isEditMode && initialData) {
        await updateDestination(initialData.destinationID, submitData);
        toast.success("Cập nhật Điểm đến thành công!");
      } else {
        await createDestination(submitData);
        toast.success("Thêm Điểm đến thành công!");
      }
      
      onSaved();
    } catch (error: any) {
      console.error(error);
      toast.error("Lỗi: " + (error.response?.data?.message || error.message || "Có lỗi xảy ra!"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div>
            <h2 className="text-xl font-bold">{isEditMode ? "Cập nhật Điểm đến" : "Thêm Điểm đến mới"}</h2>
            <p className="text-sm text-muted-foreground">Quản lý thông tin và hình ảnh điểm đến.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="space-y-8">
            
            {/* Thông tin cơ bản */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><MapPin className="w-5 h-5"/> Thông tin cơ bản</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tên địa danh <span className="text-red-500">*</span></label>
                  <input name="name" value={formData.name} onChange={handleChange} type="text" placeholder="VD: Vịnh Hạ Long" className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tỉnh/Thành phố <span className="text-red-500">*</span></label>
                  <input name="cityProvince" value={formData.cityProvince} onChange={handleChange} type="text" placeholder="VD: Quảng Ninh" className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Mô tả</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Mô tả về điểm đến..." className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Từ khóa chính (KeyMain)</label>
                  <input name="keyMain" value={formData.keyMain} onChange={handleChange} type="text" placeholder="VD: biển, thiên nhiên, di sản" className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                </div>
              </div>
            </div>

            <hr className="border-border" />

            {/* Chi phí & Đánh giá */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Chi phí & Đánh giá</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Đánh giá (Rate)</label>
                  <input name="rate" value={formData.rate} onChange={handleChange} type="number" step="0.1" className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Phí tham quan (VND)</label>
                  <input name="entranceFee" value={formData.entranceFee} onChange={handleChange} type="number" className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Chi phí lưu trú (VND)</label>
                  <input name="accommodationCost" value={formData.accommodationCost} onChange={handleChange} type="number" className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tổng chi phí Tour (VND)</label>
                  <input name="totalTourCost" value={formData.totalTourCost} onChange={handleChange} type="number" className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Giá / Người (VND)</label>
                  <input name="tourPricePerPerson" value={formData.tourPricePerPerson} onChange={handleChange} type="number" className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                </div>
              </div>
            </div>

            <hr className="border-border" />

            {/* Hình ảnh */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Thư viện ảnh <span className="text-sm font-normal text-muted-foreground ml-2">(Tải lên 1 hoặc nhiều ảnh)</span></h3>
              
              <div className="border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[140px]">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploadingImage}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                />
                {isUploadingImage ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                    <p className="text-sm font-medium text-primary">Đang tải ảnh lên...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-5 h-5 text-primary" />
                    </div>
                    <p className="font-bold mb-1">Tải ảnh lên từ máy</p>
                    <p className="text-xs text-muted-foreground">Nhấp hoặc kéo thả ảnh vào đây</p>
                  </>
                )}
              </div>

              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-video rounded-xl bg-muted border border-border group overflow-hidden">
                      <img src={url.startsWith('http') ? url : `http://localhost:8080${url}`} alt={`Preview ${index}`} className="w-full h-full object-cover" />
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
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
            <Save className="w-4 h-4" />
            {isSubmitting ? "Đang lưu..." : "Lưu Điểm đến"}
          </Button>
        </div>
      </div>
    </div>
  );
}
