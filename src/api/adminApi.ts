import axiosInstance from './axiosInstance';
import type { AdminUserResponse } from '../types/admin';

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

export const getPendingGuides = async () => {
  const response = await axiosInstance.get('/Admin/guides/pending');
  return response.data;
};

export const approveGuide = async (profileId: number, approve: boolean) => {
  const response = await axiosInstance.post('/Admin/guides/approve', {
    profileID: profileId,
    approve: approve
  });
  return response.data;
};
