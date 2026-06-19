import { useState } from "react";
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

export function MyExperiencesTab() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const experiences = [
    {
      id: 1,
      title: "Khám phá Phố Cổ Hà Nội & Ẩm thực đường phố",
      province: "Hà Nội",
      price: "450,000",
      duration: "3 giờ",
      maxGuests: 8,
      rating: 4.9,
      reviews: 124,
      status: "Hoạt động",
      image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=500"
    },
    {
      id: 2,
      title: "Chèo Kayak Khám phá Hang động Vịnh Hạ Long",
      province: "Quảng Ninh",
      price: "850,000",
      duration: "6 giờ",
      maxGuests: 12,
      rating: 4.8,
      reviews: 86,
      status: "Chờ duyệt",
      image: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=500"
    },
    {
      id: 3,
      title: "Trekking bản địa Sapa",
      province: "Lào Cai",
      price: "1,200,000",
      duration: "2 Ngày",
      maxGuests: 6,
      rating: 5.0,
      reviews: 42,
      status: "Đã ẩn",
      image: "https://images.unsplash.com/photo-1540845511934-7721dd7adec3?w=500"
    }
  ];

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all group">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={exp.image} 
                alt={exp.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full backdrop-blur-md ${
                  exp.status === 'Hoạt động' ? 'bg-green-500/90 text-white' :
                  exp.status === 'Chờ duyệt' ? 'bg-orange-500/90 text-white' :
                  'bg-gray-800/90 text-white'
                }`}>
                  {exp.status}
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
                  {exp.province}
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-foreground">{exp.rating} <span className="text-muted-foreground">({exp.reviews})</span></span>
                </div>
              </div>
              
              <h3 className="font-bold text-lg leading-tight mb-3 line-clamp-2 min-h-[44px]">
                {exp.title}
              </h3>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 border-b border-border pb-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  {exp.duration}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  Tối đa {exp.maxGuests}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Giá từ</p>
                  <p className="font-bold text-primary">{exp.price}₫</p>
                </div>
                
                {/* Actions Dropdown simulation via flex for now */}
                <div className="flex gap-1 border border-border rounded-lg overflow-hidden">
                  <button className="p-2 hover:bg-muted text-muted-foreground transition-colors" title="Sửa">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-muted text-muted-foreground transition-colors border-l border-border" title="Quản lý lịch trình">
                    <Calendar className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-muted text-muted-foreground transition-colors border-l border-border" title={exp.status === 'Đã ẩn' ? 'Hiện' : 'Ẩn'}>
                    {exp.status === 'Đã ẩn' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isCreateModalOpen && (
        <CreateExperienceModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
}
