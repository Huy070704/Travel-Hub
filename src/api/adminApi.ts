import axiosInstance from './axiosInstance';
import type { AdminUserResponse, AdminUserDetail, AdminUpdateUserPayload } from '../types/admin';

export const getAdminOverview = async () => {
  const response = await axiosInstance.get('/Admin/overview');
  return response.data;
};

export const getAllUsers = async (
  page: number = 1,
  pageSize: number = 30,
  offlineFilter: string = ''
): Promise<AdminUserResponse> => {
  const response = await axiosInstance.get('/Admin/users', {
    params: {
      page,
      pageSize,
      offlineFilter: offlineFilter === 'all' ? '' : offlineFilter,
    },
  });
  return response.data;
};

export const getUserDetail = async (userId: number): Promise<AdminUserDetail> => {
  const response = await axiosInstance.get(`/Admin/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId: number, payload: AdminUpdateUserPayload) => {
  const response = await axiosInstance.put(`/Admin/users/${userId}`, payload);
  return response.data;
};

export const blockUser = async (userId: number, isBlocked: boolean) => {
  const response = await axiosInstance.put(`/Admin/users/${userId}/block`, { isBlocked });
  return response.data;
};

export const getPendingGuides = async () => {
  const response = await axiosInstance.get('/Admin/guides/pending');
  return response.data;
};

export const approveGuide = async (profileId: number, approve: boolean, note?: string) => {
  const response = await axiosInstance.post('/Admin/guides/approve', {
    profileID: profileId,
    approve: approve,
    note: note ?? null
  });
  return response.data;
};

export const getReports = async () => {
  const response = await axiosInstance.get('/Admin/reports');
  return response.data;
};

export const updateReportStatus = async (reportId: number, status: 'Resolved' | 'Rejected') => {
  const response = await axiosInstance.put(`/Admin/reports/${reportId}/status`, { status });
  return response.data;
};
