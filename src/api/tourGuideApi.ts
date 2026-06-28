import api from './axiosInstance';

export interface TourGuideRegistrationRequest {
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
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
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  address?: string;
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
  adminNote?: string | null;
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

  uploadFile: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.url;
  },

  getLibraryImages: async (): Promise<string[]> => {
    const response = await api.get('/uploads/library');
    return response.data;
  },
};
