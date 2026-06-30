import { BadgeCheck, CheckCircle, FileSearch, FileText, X, XCircle } from "lucide-react";
import { getFileUrl } from "../../lib/getFileUrl";

interface GuideDetailsModalProps {
  guide: any;
  onClose: () => void;
  onApprove: (profileId: number, isApproved: boolean) => void;
  onViewDetail: () => void;
}

export function GuideDetailsModal({ guide, onClose, onApprove, onViewDetail }: GuideDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border bg-gray-50 dark:bg-muted/30">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <BadgeCheck className="w-6 h-6 text-primary" />
            Chi Tiết Hồ Sơ Hướng Dẫn Viên
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          {/* User Identity Info */}
          <div className="flex items-start gap-6 mb-1 bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30">
            <img
              src={getFileUrl(guide.guideAvatarUrl) || "https://ui-avatars.com/api/?name=" + guide.fullName}
              alt="Avatar"
              className="w-20 h-20 rounded-xl object-cover border-4 border-white dark:border-slate-800 shadow-md"
            />
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-foreground mb-1">{guide.fullName}</h4>
              <p className="text-sm text-muted-foreground mb-4">{guide.email}</p>
              <p className="text-xs text-gray-700 dark:text-slate-300 max-w-2xl bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm">
                <span className="font-semibold block mb-1">Giới thiệu bản thân (Bio):</span>
                {guide.bio || "Không có phần giới thiệu."}
              </p>
            </div>
          </div>

          {/* Professional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
            <div className="text-l">
              <h4 className="font-semibold text-gray-900 dark:text-foreground mb-4 pb-2 border-b border-border">Thông tin chuyên môn</h4>
              <ul className="space-y-3">
                <li className="flex justify-between border-b border-gray-50 dark:border-border/50 pb-2">
                  <span className="text-muted-foreground">Kinh nghiệm:</span>
                  <span className="font-medium">{guide.experience} năm</span>
                </li>
                <li className="flex justify-between border-b border-gray-50 dark:border-border/50 pb-2">
                  <span className="text-muted-foreground">Ngôn ngữ hỗ trợ:</span>
                  <span className="font-medium text-right max-w-[200px]">{guide.languages}</span>
                </li>
                <li className="flex justify-between border-b border-gray-50 dark:border-border/50 pb-2">
                  <span className="text-muted-foreground">Địa điểm hoạt động:</span>
                  <span className="font-medium text-right max-w-[200px]">{guide.locations}</span>
                </li>
                <li className="flex justify-between border-b border-gray-50 dark:border-border/50 pb-2">
                  <span className="text-muted-foreground">Danh mục Tour:</span>
                  <span className="font-medium text-right max-w-[200px]">{guide.tourCategories}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Ngày tạo hồ sơ:</span>
                  <span className="font-medium">{new Date(guide.createdAt).toLocaleDateString('vi-VN')}</span>
                </li>
              </ul>
            </div>

            {/* Documents / Images */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-foreground mb-4 pb-2 border-b border-border">Giấy tờ tùy thân & Chứng chỉ</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground font-medium">CMND/CCCD (Mặt trước)</span>
                  <div className="aspect-video bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                    {guide.idFrontUrl ? (
                      guide.idFrontUrl.toLowerCase().endsWith('.pdf') ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-red-500">
                          <FileText className="w-8 h-8 mb-1" />
                          <span className="text-xs">Tài liệu PDF</span>
                        </div>
                      ) : (
                        <img src={getFileUrl(guide.idFrontUrl)} alt="Mặt trước CMND" className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer" />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Không có ảnh</div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground font-medium">CMND/CCCD (Mặt sau)</span>
                  <div className="aspect-video bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                    {guide.idBackUrl ? (
                      guide.idBackUrl.toLowerCase().endsWith('.pdf') ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-red-500">
                          <FileText className="w-8 h-8 mb-1" />
                          <span className="text-xs">Tài liệu PDF</span>
                        </div>
                      ) : (
                        <img src={getFileUrl(guide.idBackUrl)} alt="Mặt sau CMND" className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer" />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Không có ảnh</div>
                    )}
                  </div>
                </div>
                <div className="col-span-2 space-y-2">
                  <span className="text-sm text-muted-foreground font-medium">Chứng chỉ thẻ Hướng dẫn viên</span>
                  <div className="h-32 bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                    {guide.certUrl ? (
                      guide.certUrl.toLowerCase().endsWith('.pdf') ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-red-500">
                          <FileText className="w-8 h-8 mb-1" />
                          <span className="text-xs">Tài liệu PDF</span>
                        </div>
                      ) : (
                        <img src={getFileUrl(guide.certUrl)} alt="Chứng chỉ" className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer" />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Không có ảnh</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-6 border-t border-border bg-gray-50 dark:bg-muted/30 flex flex-col sm:flex-row sm:justify-end gap-4">
          <button
            onClick={onViewDetail}
            className="px-6 py-2.5 bg-muted text-foreground rounded-xl hover:bg-muted/70 font-semibold transition-colors flex items-center justify-center gap-2 sm:mr-auto"
          >
            <FileSearch className="w-5 h-5" />
            Xem chi tiết
          </button>
          <button
            onClick={() => onApprove(guide.profileID, false)}
            className="px-6 py-2.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <XCircle className="w-5 h-5" />
            Từ chối hồ sơ
          </button>
          <button
            onClick={() => onApprove(guide.profileID, true)}
            className="px-6 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 font-semibold shadow-sm hover:shadow transition-all flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Phê duyệt Hướng dẫn viên
          </button>
        </div>
      </div>
    </div>
  );
}
