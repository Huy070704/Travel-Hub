export interface AdminUser {
  userID: number;
  username: string;
  email: string;
  fullName: string | null;
  avatarURL: string | null;
  registrationDate: string;
  lastOnline: string | null;
  offlineDurationText: string;
}

export interface AdminUserResponse {
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  users: AdminUser[];
}
