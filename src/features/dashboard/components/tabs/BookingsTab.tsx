import { useEffect, useState } from "react";
import { getAllTourBookings, updateTourBookingStatus } from "@/api/toursApi";
import type { TourBooking } from "@/types/tours";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { BookingDetailsModal } from "../modals/BookingDetailsModal";

export function BookingsTab() {
  const [tourBookings, setTourBookings] = useState<TourBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<TourBooking | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchBookings = () => {
    getAllTourBookings().then(setTourBookings).catch(console.error);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async () => {
    if (!selectedBooking || !newStatus) return;
    setIsUpdatingStatus(true);
    try {
      await updateTourBookingStatus(selectedBooking.bookingID, newStatus);
      setIsBookingModalOpen(false);
      fetchBookings();
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Cập nhật trạng thái thất bại");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold">Danh sách Đặt Tour</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Khách hàng</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Tour</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Số người</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Tổng tiền</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Trạng thái</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Ngày đặt</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {tourBookings.map((booking) => (
                <tr key={booking.bookingID} className="border-b border-border hover:bg-muted/50 transition-all">
                  <td className="py-3 px-4">
                    <div className="font-semibold">{booking.fullName}</div>
                    <div className="text-xs text-muted-foreground">{booking.phone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium line-clamp-1">{booking.tourTitle}</div>
                    <div className="text-xs text-muted-foreground">{new Date(booking.departureDate).toLocaleDateString('vi-VN')}</div>
                  </td>
                  <td className="py-3 px-4 text-sm">{booking.guests} khách</td>
                  <td className="py-3 px-4 font-semibold text-primary">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalPriceVND)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setNewStatus(booking.status);
                        setIsBookingModalOpen(true);
                      }}
                      className="p-2 hover:bg-muted rounded transition-all text-primary"
                      title="Xem chi tiết & Cập nhật"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {tourBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    Chưa có đơn đặt tour nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {isBookingModalOpen && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          newStatus={newStatus}
          onStatusChange={setNewStatus}
          onSave={handleUpdateStatus}
          onClose={() => setIsBookingModalOpen(false)}
          isUpdating={isUpdatingStatus}
        />
      )}
    </div>
  );
}
