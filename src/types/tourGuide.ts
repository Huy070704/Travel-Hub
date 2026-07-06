import { PostDto } from "./feed";

export interface TourGuideRegistrationRequest {
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
  fullName?: string;
}

export interface TourGuideProfileDto {
  profileID: number;
  userID: number;
  username: string;
  email: string;
  fullName?: string;
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
  isVerified: string;
  adminNote?: string;
  createdAt: string;
}

export interface GuideApplicationDto {
  applicationID: number;
  guideID: number;
  guideUsername: string;
  guideAvatarURL?: string;
  postID: number;
  status: string;
  message?: string;
  proposedPriceVND?: number;
  appliedDate: string;
}

export interface ApplyGuideRequest {
  postID: number;
  message?: string;
  proposedPriceVND?: number;
}
