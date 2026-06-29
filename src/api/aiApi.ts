import axiosInstance from "./axiosInstance";
import type { 
  AiRecommendRequest, 
  AiRecommendResponse, 
  AiGenerateItineraryRequest, 
  AiGenerateItineraryResponse,
  PaginatedAiResponse
} from "../types/ai";

export async function getAiRecommendations(data: AiRecommendRequest) {
  const response = await axiosInstance.post<PaginatedAiResponse>("/Ai/recommend", data);
  return response.data;
}

export async function generateAiItinerary(data: AiGenerateItineraryRequest) {
  const response = await axiosInstance.post<AiGenerateItineraryResponse>("/Ai/generate-itinerary", data);
  return response.data;
}

export async function getAiLimit() {
  const response = await axiosInstance.get<{ used: number; limit: number; remaining: number }>("/Ai/limit");
  return response.data;
}
