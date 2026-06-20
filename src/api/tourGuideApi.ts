import api from './axiosInstance';

export interface TourGuideRegistrationRequest {
  experience?: string;
  languages?: string;
  locations?: string;
  bio?: string;
  tourCategories?: string;
  idFrontUrl?: string;
  idBackUrl?: string;
  certUrl?: string;
  guideAvatarUrl?: string;
}

export interface TourGuideProfile {
  profileID: number;
  userID: number;
  username: string;
  email: string;
  fullName: string;
  experience?: string;
  languages?: string;
  locations?: string;
  bio?: string;
  tourCategories?: string;
  idFrontUrl?: string;
  idBackUrl?: string;
  certUrl?: string;
  guideAvatarUrl?: string;
  isVerified: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export const tourGuideApi = {
  registerAsGuide: async (data: TourGuideRegistrationRequest) => {
    const response = await api.post('/tourguide/register', data);
    return response.data;
  },

  getMyProfile: async (): Promise<TourGuideProfile> => {
    const response = await api.get('/tourguide/my-profile');
    return response.data;
  },
};
