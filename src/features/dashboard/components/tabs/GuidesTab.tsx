import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getPendingGuides, approveGuide } from "@/api/adminApi";
import { CheckCircle, Eye, XCircle } from "lucide-react";
import { toast } from "sonner";
import { GuideDetailsModal } from "../modals/GuideDetailsModal";

export function GuidesTab() {
  const navigate = useNavigate();
  const [pendingGuides, setPendingGuides] = useState<any[]>([]);
  const [isLoadingGuides, setIsLoadingGuides] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<any | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const fetchPendingGuides = async () => {
    setIsLoadingGuides(true);
    try {
      const data = await getPendingGuides();
      setPendingGuides(data);
    } catch (error) {
      console.error("Failed to fetch pending guides", error);
    } finally {
      setIsLoadingGuides(false);
    }
  };

  useEffect(() => {
    fetchPendingGuides();
  }, []);

  const handleApproveGuide = async (profileId: number, isApproved: boolean) => {
    try {
      await approveGuide(profileId, isApproved);
      toast.success(`Đã ${isApproved ? 'phê duyệt' : 'từ chối'} hướng dẫn viên thành công.`);
      setIsGuideModalOpen(false);
      fetchPendingGuides(); // Reload list
    } catch (error) {
      console.error("Failed to approve guide", error);
      toast.error("Có lỗi xảy ra khi duyệt hướng dẫn viên.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold">Danh sách Đơn Đăng Ký Chờ Duyệt</h3>
        </div>

        {isLoadingGuides ? (
          <div className="py-12 text-center text-muted-foreground">Đang tải dữ liệu...</div>
        ) : pendingGuides.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            Không có đơn đăng ký nào đang chờ duyệt.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Người Dùng</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Kinh nghiệm</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Ngôn ngữ</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Địa điểm</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Ngày Nộp Đơn</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pendingGuides.map((guide) => (
                  <tr key={guide.profileID} className="border-b border-border hover:bg-muted/50 transition-all">
                    <td className="py-3 px-4">
                      <div className="font-semibold">{guide.fullName}</div>
                      <div className="text-xs text-muted-foreground">{guide.email}</div>
                    </td>
                    <td className="py-3 px-4 text-sm">{guide.experience} năm</td>
                    <td className="py-3 px-4 text-sm">{guide.languages}</td>
                    <td className="py-3 px-4 text-sm">{guide.locations}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(guide.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedGuide(guide);
                            setIsGuideModalOpen(true);
                          }}
                          className="p-2 hover:bg-muted text-primary rounded transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleApproveGuide(guide.profileID, true)}
                          className="p-2 hover:bg-green-50 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded transition-all"
                          title="Phê duyệt"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleApproveGuide(guide.profileID, false)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded transition-all"
                          title="Từ chối"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Guide Details Modal */}
      {isGuideModalOpen && selectedGuide && (
        <GuideDetailsModal
          guide={selectedGuide}
          onClose={() => setIsGuideModalOpen(false)}
          onApprove={handleApproveGuide}
          onViewDetail={() => navigate(`/admin/guides/${selectedGuide.profileID}`, { state: { guide: selectedGuide } })}
        />
      )}
    </div>
  );
}
