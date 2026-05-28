import axiosInstance from "./axiosInstance";
import type {
  UserProfileDto,
  UpdateProfileRequest,
  PublicUserProfileDto,
  DashboardDto,
} from "@/types/users";

export async function getMyProfile() {
  const response = await axiosInstance.get<UserProfileDto>("/Users/me");
  return response.data;
}

export async function updateMyProfile(data: UpdateProfileRequest) {
  const response = await axiosInstance.put<{ message: string }>("/Users/me", data);
  return response.data;
}

export async function getPublicProfile(userId: number) {
  const response = await axiosInstance.get<PublicUserProfileDto>(`/Users/${userId}`);
  return response.data;
}

export async function getDashboardStats() {
  const response = await axiosInstance.get<DashboardDto>("/Users/me/dashboard");
  return response.data;
}
