import { X } from "lucide-react";
import type { AdminUserDetail } from "@/types/admin";

interface UserDetailsModalProps {
  user: AdminUserDetail;
  onClose: () => void;
}

export function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col border border-border dark:border-slate-800">
        <div className="flex justify-between items-center p-6 border-b border-border dark:border-slate-800">
          <h3 className="text-xl font-bold dark:text-white">Chi tiết người dùng</h3>
          <button onClick={onClose} className="p-2 hover:bg-muted dark:hover:bg-slate-800 rounded-full transition-all text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex items-start gap-6 mb-8">
            <img
              src={user.avatarURL || "https://ui-avatars.com/api/?name=" + (user.fullName || user.username)}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-white dark:border-slate-800"
            />
            <div>
              <h4 className="text-2xl font-bold mb-1 dark:text-white">{user.fullName || user.username}</h4>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="mt-3 flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isBlocked ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                  {user.isBlocked ? "Đã chặn" : "Hoạt động"}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-semibold">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-border dark:border-slate-800">Thông tin cá nhân</h4>
              <ul className="space-y-4">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Tên đăng nhập:</span>
                  <span className="font-medium text-right dark:text-white">{user.username}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Mã sinh viên:</span>
                  <span className="font-medium text-right dark:text-white">{user.studentCode || "Chưa cập nhật"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Giới tính:</span>
                  <span className="font-medium text-right dark:text-white">{user.gender || "Chưa cập nhật"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Ngày sinh:</span>
                  <span className="font-medium text-right dark:text-white">{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN') : "Chưa cập nhật"}</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-border dark:border-slate-800">Thông tin hệ thống</h4>
              <ul className="space-y-4">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Ngày tham gia:</span>
                  <span className="font-medium text-right dark:text-white">{new Date(user.registrationDate).toLocaleDateString('vi-VN')}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Lần cuối online:</span>
                  <span className="font-medium text-right dark:text-white">{user.lastOnline ? new Date(user.lastOnline).toLocaleString('vi-VN') : "Chưa từng online"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Tài khoản Premium:</span>
                  <span className="font-medium text-right dark:text-white">{user.isPremium ? "Có" : "Không"}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-border dark:border-slate-800 flex justify-end gap-3 bg-gray-50 dark:bg-slate-900">
          <button onClick={onClose} className="px-6 py-2.5 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-slate-700 transition-all font-semibold">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
