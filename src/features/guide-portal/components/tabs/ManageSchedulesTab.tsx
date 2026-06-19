import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  Users, 
  Calendar as CalendarIcon,
  CheckCircle2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function ManageSchedulesTab() {
  const [selectedDate, setSelectedDate] = useState<number | null>(15);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Mock calendar days (simplification for UI demonstration)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  // Mock slots for selected date
  const slots = [
    { id: 1, tour: "Tour ẩm thực Phố Cổ Hà Nội", startTime: "09:00", endTime: "12:00", capacity: 8, booked: 5, status: "Trống" },
    { id: 2, tour: "Tour ẩm thực Phố Cổ Hà Nội", startTime: "18:00", endTime: "21:00", capacity: 8, booked: 8, status: "Đã đầy" }
  ];

  const handleSaveSlot = () => {
    setIsAddModalOpen(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý lịch trình</h1>
          <p className="text-muted-foreground mt-1">Thiết lập thời gian rảnh và quản lý các khung giờ tour.</p>
        </div>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 dark:bg-green-900/40 dark:border-green-800 dark:text-green-300 p-4 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <p className="font-medium">Đã thêm khung giờ lịch trình mới thành công!</p>
          </div>
          <button onClick={() => setShowSuccess(false)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Calendar */}
        <div className="lg:col-span-2 bg-card rounded-3xl shadow-sm border border-border p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Tháng 10 năm 2024</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full w-8 h-8">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full w-8 h-8">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-semibold text-muted-foreground pb-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 sm:gap-4">
            {/* Empty slots for start of month alignment (mock) */}
            <div className="aspect-square"></div>
            <div className="aspect-square"></div>
            
            {days.map(day => {
              const isSelected = selectedDate === day;
              const hasSlots = day === 12 || day === 15 || day === 18 || day === 24;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center text-sm sm:text-base font-medium transition-all hover:border-primary/50 border-2 ${
                    isSelected 
                      ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' 
                      : 'bg-muted/50 border-transparent hover:bg-muted text-foreground'
                  }`}
                >
                  {day}
                  {hasSlots && (
                    <div className={`absolute bottom-2 flex gap-1 ${isSelected ? 'opacity-100' : 'opacity-60'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`}></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Selected Date Details */}
        <div className="bg-card rounded-3xl shadow-sm border border-border p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Ngày đã chọn</p>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-primary" />
                {selectedDate} Tháng 10, 2024
              </h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {selectedDate === 15 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Khung giờ đã lên lịch</h3>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full font-medium">2 Khung giờ</span>
                </div>
                
                {slots.map(slot => (
                  <div key={slot.id} className="relative pl-4">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full ${slot.status === 'Đã đầy' ? 'bg-orange-400' : 'bg-green-500'}`} />
                    <div className="bg-muted/50 border border-border rounded-2xl p-4 hover:border-primary/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg">{slot.startTime} - {slot.endTime}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          slot.status === 'Đã đầy' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        }`}>
                          {slot.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-3 line-clamp-1">{slot.tour}</p>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          <span>{slot.booked}/{slot.capacity} Đã đặt</span>
                        </div>
                        <button className="text-primary hover:underline font-medium text-xs">Sửa</button>
                      </div>
                      
                      {/* Capacity Bar */}
                      <div className="w-full bg-border rounded-full h-1.5 mt-3 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${slot.status === 'Đã đầy' ? 'bg-orange-500' : 'bg-green-500'}`}
                          style={{ width: `${(slot.booked / slot.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-muted" />
                </div>
                <h3 className="font-bold text-lg mb-1">Chưa có khung giờ nào</h3>
                <p className="text-sm text-muted-foreground mb-6">Bạn không có khung giờ tour nào đang hoạt động cho ngày này.</p>
              </div>
            )}
          </div>

          <div className="pt-6 mt-4 border-t border-border">
            <Button className="w-full py-6 text-lg gap-2 rounded-2xl shadow-md shadow-primary/20" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-5 h-5" />
              Thêm khung giờ mới
            </Button>
          </div>
        </div>
      </div>

      {/* Add Slot Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/50">
              <h2 className="text-xl font-bold">Thêm khung giờ mới</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Chọn trải nghiệm</label>
                <select className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all">
                  <option value="">Tour ẩm thực Phố Cổ Hà Nội</option>
                  <option value="">Chèo Kayak Khám phá Hang động Vịnh Hạ Long</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Ngày</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="text" readOnly value={`${selectedDate} Tháng 10, 2024`} className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-xl outline-none text-muted-foreground font-medium cursor-not-allowed" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Thời gian bắt đầu</label>
                  <input type="time" defaultValue="09:00" className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Thời gian kết thúc</label>
                  <input type="time" defaultValue="12:00" className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Số khách tối đa (Tùy chọn ghi đè)</label>
                <input type="number" placeholder="Mặc định: 8" className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Ghi chú nội bộ</label>
                <textarea rows={2} placeholder="Bất kỳ ghi chú cụ thể nào cho khung giờ này..." className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-muted/50 flex gap-4 justify-end">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="px-6 rounded-xl bg-card hover:bg-muted">Hủy</Button>
              <Button onClick={handleSaveSlot} className="px-8 rounded-xl shadow-md shadow-primary/20">Lưu khung giờ</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
