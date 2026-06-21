import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { approveGuide } from "@/api/adminApi";
import {
  BadgeCheck,
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";

const GENDER_LABELS: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
  "prefer-not-to-say": "Không muốn tiết lộ",
};

export function GuideProfileDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  // Guide data is passed via router state from the Admin dashboard list.
  const guide = (location.state as any)?.guide ?? null;
  const [adminNote, setAdminNote] = useState("");

  const handleApproveGuide = async (isApproved: boolean) => {
    if (!guide) return;
    try {
      await approveGuide(guide.profileID, isApproved, adminNote);
      alert(`Đã ${isApproved ? "phê duyệt" : "từ chối"} hướng dẫn viên thành công.`);
      navigate("/admin");
    } catch (error) {
      console.error("Failed to approve guide", error);
      alert("Có lỗi xảy ra khi duyệt hướng dẫn viên.");
    }
  };

  // Fallback when the page is opened directly (no guide in state).
  if (!guide) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-card text-card-foreground rounded-2xl shadow-lg p-10 text-center max-w-md">
          <BadgeCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Không tìm thấy hồ sơ</h2>
          <p className="text-muted-foreground mb-6">
            Không có dữ liệu hồ sơ hướng dẫn viên (ID: {params.profileId}). Vui lòng mở lại từ danh sách duyệt HDV.
          </p>
          <button
            onClick={() => navigate("/admin")}
            className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-semibold transition-all inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại Bảng quản trị
          </button>
        </div>
      </div>
    );
  }

  const documents = [
    { label: "CMND/CCCD (Mặt trước)", url: guide.idFrontUrl },
    { label: "CMND/CCCD (Mặt sau)", url: guide.idBackUrl },
    { label: "Chứng chỉ thẻ Hướng dẫn viên", url: guide.certUrl },
    { label: "Hồ sơ CV", url: null },
  ];

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-8">

        {/* Top bar */}
        <button
          onClick={() => navigate("/admin")}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại danh sách
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-8">
          Chi tiết hồ sơ ứng viên: {guide.fullName}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column (col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-6 flex flex-col items-center">
              <img
                src={guide.guideAvatarUrl || "https://ui-avatars.com/api/?name=" + guide.fullName}
                alt={guide.fullName}
                className="w-full aspect-square object-cover rounded-xl mb-4 border border-border/50"
              />
              <h2 className="text-lg font-bold text-center">{guide.fullName}</h2>
              <p className="text-sm text-muted-foreground mb-3">HDV-{guide.profileID?.toString().padStart(6, '0') || 'N/A'}</p>

              <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 mb-6">
                Đang chờ duyệt
              </span>

              <div className="w-full space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="truncate" title={guide.email}>Email: {guide.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>Điện thoại: {guide.phone || "—"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* Thông tin cá nhân */}
            <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-bold mb-4">Thông tin cá nhân</h3>
              <div className="space-y-3 text-sm">
                <p>
                  <span className="font-semibold inline-block w-32">Ngày sinh:</span>
                  {guide.dateOfBirth ? new Date(guide.dateOfBirth).toLocaleDateString("vi-VN") : "—"}
                </p>
                <p>
                  <span className="font-semibold inline-block w-32">Giới tính:</span>
                  {guide.gender ? GENDER_LABELS[guide.gender] ?? guide.gender : "—"}
                </p>
                <p className="flex">
                  <span className="font-semibold inline-block w-32 shrink-0">Địa chỉ:</span>
                  <span>{guide.address || "—"}</span>
                </p>
                <div className="pt-1">
                  <span className="font-semibold block mb-1">Năng lực ngôn ngữ:</span>
                  <ul className="list-disc list-inside ml-2 text-muted-foreground">
                    {guide.languages ? (
                      String(guide.languages).split(',').map((lang, idx) => (
                        <li key={idx}>{lang.trim()}</li>
                      ))
                    ) : (
                      <li>—</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Kinh nghiệm & Trình độ */}
            <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-bold mb-4">Kinh nghiệm & Trình độ</h3>
              <div className="space-y-3 text-sm">
                <p>
                  <span className="font-semibold inline-block w-40">Kinh nghiệm:</span>
                  {guide.experience ? `${guide.experience} năm` : "—"}
                </p>
                <p>
                  <span className="font-semibold inline-block w-40">Danh mục Tour:</span>
                  {guide.tourCategories || "—"}
                </p>
                <p className="flex">
                  <span className="font-semibold inline-block w-40 shrink-0">Địa điểm hoạt động:</span>
                  <span>{guide.locations || "—"}</span>
                </p>
                <div className="pt-1">
                  <span className="font-semibold block mb-1">Ghi chú (Bio):</span>
                  <p className="text-muted-foreground whitespace-pre-line">{guide.bio || "—"}</p>
                </div>
              </div>
            </div>

            {/* Đánh giá & Phản hồi */}
            <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-bold mb-4">Đánh giá & Phản hồi</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-muted-foreground">Ghi chú của Admin</label>
                  <textarea
                    className="w-full p-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
                    rows={3}
                    placeholder="Ghi chú gửi tới ứng viên khi duyệt/từ chối (tuỳ chọn)..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  />
                </div>
                <div className="space-y-2 text-sm pt-2">
                  <div className="flex items-center">
                    <span className="w-24 font-semibold">Kỹ năng:</span>
                    <span className="text-yellow-400 text-lg tracking-widest">★★★★☆</span>
                    <span className="ml-2 text-muted-foreground font-medium">- 4</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 font-semibold">Giao tiếp:</span>
                    <span className="text-yellow-400 text-lg tracking-widest">★★★★★</span>
                    <span className="ml-2 text-muted-foreground font-medium">- 5</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 font-semibold">Kiến thức:</span>
                    <span className="text-yellow-400 text-lg tracking-widest">★★★★☆</span>
                    <span className="ml-2 text-muted-foreground font-medium">- 4</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* Tài liệu đính kèm */}
            <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-bold mb-4">Tài liệu đính kèm</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documents.map((doc, idx) => (
                  <div key={idx} className="space-y-2 group">
                    <span className="text-sm font-medium text-foreground line-clamp-1" title={doc.label}>
                      {doc.label}
                    </span>
                    <div className="aspect-[4/3] bg-muted/50 rounded-xl overflow-hidden border border-border transition-all hover:border-primary/40 relative flex items-center justify-center">
                      {doc.url && doc.url.startsWith("http") ? (
                        <a href={doc.url} target="_blank" rel="noreferrer" className="w-full h-full block">
                          <img
                            src={doc.url}
                            alt={doc.label}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </a>
                      ) : (
                        <div className="text-muted-foreground flex flex-col items-center gap-2">
                          <FileText className="w-8 h-8 opacity-20" />
                          <span className="text-xs font-medium opacity-60">Chưa có</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hành động phê duyệt */}
            <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-bold mb-4">Hành động phê duyệt</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleApproveGuide(true)}
                  className="w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Duyệt trở thành Hướng dẫn viên
                </button>
                <button
                  onClick={() => handleApproveGuide(false)}
                  className="w-full py-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Từ chối hồ sơ
                </button>
                <div className="flex items-center gap-2 mt-4 pt-2">
                  <input type="checkbox" id="sendEmail" className="w-4 h-4 rounded border-input text-primary focus:ring-primary" defaultChecked />
                  <label htmlFor="sendEmail" className="text-sm text-foreground font-medium">
                    Gửi email thông báo cho ứng viên
                  </label>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

