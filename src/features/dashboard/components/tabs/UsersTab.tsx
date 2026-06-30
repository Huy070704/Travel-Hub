import { useEffect, useState } from "react";
import { getAllUsers, getUserDetail, updateUser, blockUser, updateUserPoints } from "@/api/adminApi";
import type { AdminUser, AdminUserDetail } from "@/types/admin";
import { Search, ChevronDown, Edit, Eye, Ban, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { UserDetailsModal } from "../modals/UserDetailsModal";
import { EditUserModal, type EditUserForm } from "../modals/EditUserModal";

export function UsersTab() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [userOfflineFilter, setUserOfflineFilter] = useState("all");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [debouncedUserSearch, setDebouncedUserSearch] = useState("");

  // User view / edit / block modal state
  const [selectedUser, setSelectedUser] = useState<AdminUserDetail | null>(null);
  const [isUserViewOpen, setIsUserViewOpen] = useState(false);
  const [isUserEditOpen, setIsUserEditOpen] = useState(false);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [blockingUserId, setBlockingUserId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditUserForm>({ fullName: "", email: "", studentCode: "", gender: "", role: "Customer" });

  const fetchAdminUsersData = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await getAllUsers(userCurrentPage, 30, userOfflineFilter, debouncedUserSearch);
      setAdminUsers(response.users);
      setTotalUsers(response.totalUsers);
      setUserTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Debounce user search so we don't fire a request on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUserSearch(userSearch);
      setUserCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [userSearch]);

  useEffect(() => {
    fetchAdminUsersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCurrentPage, userOfflineFilter, debouncedUserSearch]);

  const handleViewUser = async (user: AdminUser) => {
    setIsUserViewOpen(true);
    setSelectedUser(null);
    try {
      const id = user.userID || (user as any).userId;
      const detail = await getUserDetail(id);
      setSelectedUser(detail);
    } catch (error) {
      console.error("Failed to fetch user detail", error);
      toast.error("Không thể tải thông tin người dùng.");
      setIsUserViewOpen(false);
    }
  };

  const handleEditUser = async (user: AdminUser) => {
    setIsUserEditOpen(true);
    setSelectedUser(null);
    try {
      const id = user.userID || (user as any).userId;
      const detail = await getUserDetail(id);
      setSelectedUser(detail);
      setEditForm({
        fullName: detail.fullName ?? "",
        email: detail.email ?? "",
        studentCode: detail.studentCode ?? "",
        gender: detail.gender ?? "",
        role: detail.role ?? "Customer",
      });
    } catch (error) {
      console.error("Failed to fetch user detail", error);
      toast.error("Không thể tải thông tin người dùng.");
      setIsUserEditOpen(false);
    }
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    setIsSavingUser(true);
    try {
      const id = selectedUser.userID || (selectedUser as any).userId;
      await updateUser(id, {
        fullName: editForm.fullName,
        email: editForm.email,
        studentCode: editForm.studentCode,
        gender: editForm.gender,
        role: editForm.role,
      });
      toast.success("Cập nhật người dùng thành công.");
      setIsUserEditOpen(false);
      fetchAdminUsersData();
    } catch (error: any) {
      console.error("Failed to update user", error);
      toast.error(error?.response?.data?.message || "Cập nhật người dùng thất bại.");
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleAdjustPoints = async (user: AdminUser, offset: number) => {
    const id = user.userID || (user as any).userId;
    const currentPoints = user.travelPoints || 0;
    const newPoints = Math.max(0, currentPoints + offset);
    try {
      await updateUserPoints(id, newPoints);
      toast.success(`Đã cập nhật Travel Point cho ${user.fullName || user.username}`);
      setAdminUsers(prev => prev.map(u => (u.userID || (u as any).userId) === id ? { ...u, travelPoints: newPoints } : u));
    } catch (err) {
      toast.error("Không thể cập nhật số điểm.");
    }
  };

  const handlePromptPoints = (user: AdminUser) => {
    const id = user.userID || (user as any).userId;
    const currentPoints = user.travelPoints || 0;

    let inputValue = currentPoints.toString();

    toast(
      (t) => (
        <div className="flex flex-col gap-3 w-full">
          <span className="font-semibold text-sm">
            Nhập số Travel Point cho <strong>{user.fullName || user.username}</strong>
          </span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              defaultValue={currentPoints}
              onChange={(e) => {
                inputValue = e.target.value;
              }}
              className="flex-1 px-3 py-1.5 bg-muted dark:bg-slate-800 rounded-lg text-sm border border-border dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary text-foreground"
              placeholder="Nhập số điểm..."
            />
            <button
              onClick={async () => {
                const newPoints = parseInt(inputValue);
                if (isNaN(newPoints) || newPoints < 0) {
                  toast.error("Vui lòng nhập số điểm hợp lệ!");
                  return;
                }
                try {
                  await updateUserPoints(id, newPoints);
                  toast.success(`Đã cập nhật Travel Point thành ${newPoints.toLocaleString()}`);
                  setAdminUsers(prev => prev.map(u => (u.userID || (u as any).userId) === id ? { ...u, travelPoints: newPoints } : u));
                  toast.dismiss(t);
                } catch (err) {
                  toast.error("Không thể cập nhật số điểm.");
                }
              }}
              className="px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-all"
            >
              Lưu
            </button>
          </div>
        </div>
      ),
      {
        duration: 15000,
        className: "border-border dark:border-slate-700 p-4 w-80",
      }
    );
  };

  const handleToggleBlock = async (user: AdminUser) => {
    const nextBlocked = !user.isBlocked;
    const confirmMsg = nextBlocked
      ? `Chặn người dùng "${user.fullName || user.username}"?`
      : `Bỏ chặn người dùng "${user.fullName || user.username}"?`;
    const description = nextBlocked
      ? "Họ sẽ bị đăng xuất và không thể truy cập lại website nữa."
      : "Họ sẽ có thể đăng nhập và sử dụng hệ thống bình thường.";

    toast(
      <div className="flex flex-col gap-1.5">
        <span className="font-semibold text-[15px]">{confirmMsg}</span>
        <span className="text-sm opacity-90">{description}</span>
      </div>,
      {
        duration: 8000,
        className: "border-border dark:border-slate-700 p-4",
        classNames: {
          actionButton: "!bg-primary hover:!bg-primary/90 !text-white !font-semibold !rounded-lg !px-4 !py-2 !transition-all",
          cancelButton: "!bg-muted hover:!bg-muted/80 !text-foreground dark:!text-white !font-semibold !rounded-lg !px-4 !py-2 !transition-all !border-transparent"
        },
        action: {
          label: "Xác nhận",
          onClick: async () => {
            const id = user.userID || (user as any).userId;
            setBlockingUserId(id);
            try {
              await blockUser(id, nextBlocked);
              toast.success(nextBlocked ? "Đã chặn người dùng thành công." : "Đã bỏ chặn người dùng thành công.");
              setAdminUsers(prev => prev.map(u => (u.userID || (u as any).userId) === id ? { ...u, isBlocked: nextBlocked } : u));
            } catch (error: any) {
              console.error("Failed to toggle block", error);
              toast.error(error?.response?.data?.message || "Thao tác thất bại.");
            } finally {
              setBlockingUserId(null);
            }
          }
        },
        cancel: {
          label: "Hủy",
          onClick: () => {}
        }
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Information */}
      <div className="bg-card dark:bg-slate-900 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold dark:text-white">Danh sách người dùng</h2>
          <p className="text-muted-foreground mt-1">Tổng số người dùng: <span className="font-bold text-primary">{totalUsers}</span></p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm theo Tên, Email, Mã ND..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-muted dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div className="relative border border-border dark:border-slate-700 rounded-xl bg-muted dark:bg-slate-800 overflow-hidden focus-within:ring-2 focus-within:ring-primary">
            <select
              value={userOfflineFilter}
              onChange={(e) => {
                setUserOfflineFilter(e.target.value);
                setUserCurrentPage(1);
              }}
              className="w-full h-full pl-4 pr-10 py-3 bg-transparent outline-none appearance-none cursor-pointer dark:text-white"
            >
              <option value="all" className="dark:bg-slate-800">Tất cả</option>
              <option value="1_24_hours" className="dark:bg-slate-800">1-24 giờ chưa online</option>
              <option value="1_30_days" className="dark:bg-slate-800">1-30 ngày chưa online</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card dark:bg-slate-900 rounded-2xl shadow-lg p-6">
        {isLoadingUsers ? (
          <div className="py-12 text-center text-muted-foreground">Đang tải dữ liệu...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border dark:border-slate-800">
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-slate-400">Người dùng</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-slate-400">Mã ND</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-slate-400">Email</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-slate-400">Travel Point</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-slate-400">Ngày tham gia</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-slate-400">Thời gian chưa online</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-slate-400">Trạng thái</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground dark:text-slate-400">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((user) => {
                    const uId = user.userID || (user as any).userId;
                    return (
                    <tr key={uId} className="border-b border-border dark:border-slate-800 hover:bg-muted/50 dark:hover:bg-slate-800/50 transition-all">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatarURL || (user as any).avatarUrl || "https://ui-avatars.com/api/?name=" + (user.fullName || user.username)} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                          <span className="font-semibold dark:text-white">{user.fullName || user.username}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono bg-muted dark:bg-slate-800 px-2.5 py-1 rounded-lg text-xs font-bold text-primary select-all">
                          {user.userCode || "N/A"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground dark:text-slate-300">{user.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-amber-500 mr-1">{(user.travelPoints || 0).toLocaleString()}</span>
                          <div className="flex items-center border border-border dark:border-slate-800 rounded-lg overflow-hidden bg-background">
                            <button
                              onClick={() => handleAdjustPoints(user, -1000)}
                              className="px-1.5 py-0.5 bg-muted/40 hover:bg-muted text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors border-r border-border dark:border-slate-800"
                              title="-1,000 Points"
                            >
                              -1K
                            </button>
                            <button
                              onClick={() => handleAdjustPoints(user, 1000)}
                              className="px-1.5 py-0.5 bg-muted/40 hover:bg-muted text-[10px] font-bold text-green-500 hover:text-green-600 transition-colors border-r border-border dark:border-slate-800"
                              title="+1,000 Points"
                            >
                              +1K
                            </button>
                            <button
                              onClick={() => handlePromptPoints(user)}
                              className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                              title="Nhập tay số điểm"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground dark:text-slate-300">{new Date(user.registrationDate).toLocaleDateString("vi-VN")}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex whitespace-nowrap px-2 py-1 rounded-full text-xs font-medium ${
                          user.offlineDurationText === "Vừa mới online" || user.offlineDurationText.includes("phút")
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : user.offlineDurationText === "Chưa từng online"
                            ? "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}>
                          {user.offlineDurationText}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {user.isBlocked ? (
                          <span className="inline-flex whitespace-nowrap px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            Đã chặn
                          </span>
                        ) : (
                          <span className="inline-flex whitespace-nowrap px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Hoạt động
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            title="Xem chi tiết"
                            className="p-2 hover:bg-muted dark:hover:bg-slate-800 rounded transition-all"
                          >
                            <Eye className="w-4 h-4 text-muted-foreground dark:text-slate-400" />
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            title="Chỉnh sửa"
                            className="p-2 hover:bg-muted dark:hover:bg-slate-800 rounded transition-all"
                          >
                            <Edit className="w-4 h-4 text-muted-foreground dark:text-slate-400" />
                          </button>
                          <button
                            onClick={() => handleToggleBlock(user)}
                            disabled={blockingUserId === uId}
                            title={user.isBlocked ? "Bỏ chặn" : "Chặn người dùng"}
                            className={`p-2 rounded transition-all disabled:opacity-50 ${
                              user.isBlocked ? "hover:bg-green-50 dark:hover:bg-green-900/30" : "hover:bg-red-50 dark:hover:bg-red-900/30"
                            }`}
                          >
                            {blockingUserId === uId ? (
                              <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                            ) : user.isBlocked ? (
                              <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-500" />
                            ) : (
                              <Ban className="w-4 h-4 text-red-500 dark:text-red-400" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )})}
                  {adminUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">
                        Không tìm thấy người dùng nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {userTotalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  disabled={userCurrentPage === 1}
                  onClick={() => setUserCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <span className="text-sm font-medium mx-4">
                  Trang {userCurrentPage} / {userTotalPages}
                </span>
                <button
                  disabled={userCurrentPage === userTotalPages}
                  onClick={() => setUserCurrentPage(prev => Math.min(userTotalPages, prev + 1))}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Details Modal */}
      {isUserViewOpen && selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={() => setIsUserViewOpen(false)} />
      )}

      {/* Edit User Modal */}
      {isUserEditOpen && selectedUser && (
        <EditUserModal
          form={editForm}
          onChange={setEditForm}
          onSave={handleSaveUser}
          onClose={() => setIsUserEditOpen(false)}
          isSaving={isSavingUser}
        />
      )}
    </div>
  );
}
