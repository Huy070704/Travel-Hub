export interface AdminUser {
  userID: number;
  username: string;
  email: string;
  fullName: string | null;
  avatarURL: string | null;
  registrationDate: string;
  lastOnline: string | null;
  offlineDurationText: string;
  isBlocked: boolean;
  role: string;
}

export interface AdminUserDetail {
  userID: number;
  username: string;
  email: string;
  fullName: string | null;
  avatarURL: string | null;
  dateOfBirth: string | null;
  studentCode: string | null;
  gender: string | null;
  role: string;
  isBlocked: boolean;
  isPremium: boolean;
  registrationDate: string;
  lastOnline: string | null;
}

export interface AdminUpdateUserPayload {
  fullName?: string | null;
  email?: string | null;
  studentCode?: string | null;
  gender?: string | null;
  role?: string | null;
}

export interface AdminUserResponse {
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  users: AdminUser[];
}
