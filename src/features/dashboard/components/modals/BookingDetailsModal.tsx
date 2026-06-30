import { X } from "lucide-react";
import type { TourBooking } from "@/types/tours";

interface BookingDetailsModalProps {
  booking: TourBooking;
  newStatus: string;
  onStatusChange: (status: string) => void;
  onSave: () => void;
  onClose: () => void;
  isUpdating: boolean;
}

export function BookingDetailsModal({ booking, newStatus, onStatusChange, onSave, onClose, isUpdating }: BookingDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h3 className="text-xl font-bold">Chi tiết Đặt Tour #{booking.bookingID}</h3>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-muted-foreground text-sm mb-2">Thông tin Khách hàng</h4>
              <p><strong>Họ tên:</strong> {booking.fullName}</p>
              <p><strong>Điện thoại:</strong> {booking.phone}</p>
              <p><strong>Email:</strong> {booking.email || "Không có"}</p>
              <p><strong>Ghi chú:</strong> {booking.notes || "Không có"}</p>
            </div>
            <div>
              <h4 className="font-semibold text-muted-foreground text-sm mb-2">Thông tin Tour</h4>
              <p><strong>Tour:</strong> {booking.tourTitle}</p>
              <p><strong>Ngày đi:</strong> {new Date(booking.departureDate).toLocaleDateString('vi-VN')}</p>
              <p><strong>Số khách:</strong> {booking.guests}</p>
              <p><strong>Tổng tiền:</strong> <span className="font-bold text-primary">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalPriceVND)}</span></p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h4 className="font-semibold mb-3">Cập nhật Trạng thái</h4>
            <div className="flex gap-4 items-center">
              <select
                value={newStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                className="flex-1 p-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Pending">Pending (Chờ xử lý)</option>
                <option value="Confirmed">Confirmed (Đã xác nhận)</option>
                <option value="Cancelled">Cancelled (Đã hủy)</option>
              </select>
              <button
                onClick={onSave}
                disabled={isUpdating || newStatus === booking.status}
                className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-semibold disabled:opacity-50"
              >
                {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
