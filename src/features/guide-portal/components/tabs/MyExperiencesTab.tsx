import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  MoreVertical,
  Edit,
  Calendar,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateExperienceModal } from "./CreateExperienceModal";
import { getMyTours } from "@/api/toursApi";

export function MyExperiencesTab() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTours = async () => {
    setIsLoading(true);
    try {
      const data = await getMyTours();
      setExperiences(data);
    } catch (error) {
      console.error("Failed to fetch my tours", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);



  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trải nghiệm của tôi</h1>
          <p className="text-muted-foreground mt-1">Quản lý và tạo các tour du lịch của bạn.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="w-5 h-5" />
          Tạo trải nghiệm mới
        </Button>
      </div>

      {/* Filters Area */}
      <div className="bg-card p-4 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Tìm kiếm trải nghiệm..." 
            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all dark:text-foreground"
          />
        </div>
        <div className="flex gap-4">
          <select className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[140px] dark:text-foreground">
            <option value="">Tất cả Tỉnh/Thành</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Quảng Ninh">Quảng Ninh</option>
            <option value="Lào Cai">Lào Cai</option>
          </select>
          <select className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[140px] dark:text-foreground">
            <option value="">Tất cả Trạng thái</option>
            <option value="Active">Hoạt động</option>
            <option value="Pending">Chờ duyệt</option>
            <option value="Hidden">Đã ẩn</option>
          </select>
        </div>
      </div>

      {/* Experience Cards */}
      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          Đang tải danh sách Tour...
        </div>
      ) : experiences.length === 0 ? (
        <div className="py-20 text-center bg-card rounded-2xl border border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">Chưa có Tour nào</h3>
          <p className="text-muted-foreground mb-6">Bạn chưa tạo trải nghiệm nào. Hãy bắt đầu tạo Tour đầu tiên của bạn!</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>Tạo trải nghiệm mới</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <div key={exp.tourID} className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all group">
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-muted">
                <img 
                  src={exp.imageUrl?.split(',')[0] || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"} 
                  alt={exp.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full backdrop-blur-md bg-green-500/90 text-white">
                    Hoạt động
                  </span>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="icon" className="w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background text-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground font-medium">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {exp.destination}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-foreground">5.0 <span className="text-muted-foreground">(0)</span></span>
                  </div>
                </div>
                
                <h3 className="font-bold text-lg leading-tight mb-3 line-clamp-2 min-h-[44px]">
                  {exp.title}
                </h3>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 border-b border-border pb-4">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {exp.durationDays} Ngày
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    Khởi hành: {new Date(exp.departureDate).toLocaleDateString('vi-VN')}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Giá</p>
                    <p className="font-bold text-primary">{exp.priceVND.toLocaleString()}₫</p>
                  </div>
                
                {/* Actions Dropdown simulation via flex for now */}
                <div className="flex gap-1 border border-border rounded-lg overflow-hidden">
                  <button className="p-2 hover:bg-muted text-muted-foreground transition-colors" title="Sửa">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-muted text-muted-foreground transition-colors border-l border-border" title="Ẩn/Hiện">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {isCreateModalOpen && (
        <CreateExperienceModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onCreated={() => {
            setIsCreateModalOpen(false);
            fetchTours();
          }}
        />
      )}
    </div>
  );
}
