import { Loader2, X } from "lucide-react";

export interface EditUserForm {
  fullName: string;
  email: string;
  studentCode: string;
  gender: string;
  role: string;
}

interface EditUserModalProps {
  form: EditUserForm;
  onChange: (form: EditUserForm) => void;
  onSave: () => void;
  onClose: () => void;
  isSaving: boolean;
}

export function EditUserModal({ form, onChange, onSave, onClose, isSaving }: EditUserModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col border border-border dark:border-slate-800">
        <div className="flex justify-between items-center p-6 border-b border-border dark:border-slate-800">
          <h3 className="text-xl font-bold dark:text-white">Chỉnh sửa người dùng</h3>
          <button onClick={onClose} className="p-2 hover:bg-muted dark:hover:bg-slate-800 rounded-full transition-all text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-slate-300">Họ và tên</label>
            <input
              type="text"
              value={form.fullName}
              onChange={e => onChange({ ...form, fullName: e.target.value })}
              className="w-full p-3 bg-muted/50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white"
              placeholder="Nhập họ và tên..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-slate-300">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => onChange({ ...form, email: e.target.value })}
              className="w-full p-3 bg-muted/50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white"
              placeholder="Nhập email..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-slate-300">Mã sinh viên</label>
            <input
              type="text"
              value={form.studentCode}
              onChange={e => onChange({ ...form, studentCode: e.target.value })}
              className="w-full p-3 bg-muted/50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white"
              placeholder="Nhập mã sinh viên..."
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-slate-300">Giới tính</label>
              <select
                value={form.gender}
                onChange={e => onChange({ ...form, gender: e.target.value })}
                className="w-full p-3 bg-muted/50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer dark:text-white"
              >
                <option value="" className="dark:bg-slate-800">Chưa chọn</option>
                <option value="Male" className="dark:bg-slate-800">Nam</option>
                <option value="Female" className="dark:bg-slate-800">Nữ</option>
                <option value="Other" className="dark:bg-slate-800">Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-slate-300">Vai trò</label>
              <select
                value={form.role}
                onChange={e => onChange({ ...form, role: e.target.value })}
                className="w-full p-3 bg-muted/50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer dark:text-white"
              >
                <option value="Customer" className="dark:bg-slate-800">Customer</option>
                <option value="TourGuide" className="dark:bg-slate-800">TourGuide</option>
                <option value="Admin" className="dark:bg-slate-800">Admin</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-border dark:border-slate-800 flex justify-end gap-3 bg-gray-50 dark:bg-slate-900">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-slate-700 transition-all font-semibold"
            disabled={isSaving}
          >
            Hủy
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-semibold flex items-center gap-2 shadow-sm"
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
