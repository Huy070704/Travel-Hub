import axiosInstance from "./axiosInstance";
import type { 
  BuddyRecommendationDto, 
  CreateBuddyRequest, 
  UpdateBuddyRequestStatus, 
  BuddyDto 
} from "@/types/buddies";

export async function getBuddyRecommendations() {
  const response = await axiosInstance.get<BuddyRecommendationDto[]>("/Buddies/recommendations");
  return response.data;
}

export async function sendBuddyRequest(data: CreateBuddyRequest) {
  const response = await axiosInstance.post<{ message: string, companionID: number }>("/Buddies/requests", data);
  return response.data;
}

export async function respondToBuddyRequest(id: number, data: UpdateBuddyRequestStatus) {
  const response = await axiosInstance.put<{ message: string }>(`/Buddies/requests/${id}`, data);
  return response.data;
}

export async function getAcceptedBuddies() {
  const response = await axiosInstance.get<BuddyDto[]>("/Buddies");
  return response.data;
}

export async function getPendingRequests() {
  const response = await axiosInstance.get<BuddyDto[]>("/Buddies/requests/pending");
  return response.data;
}
