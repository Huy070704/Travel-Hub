import axiosInstance from "./axiosInstance";
import type { 
  AiRecommendRequest, 
  AiRecommendResponse, 
  AiGenerateItineraryRequest, 
  AiGenerateItineraryResponse 
} from "../types/ai";

export async function getAiRecommendations(data: AiRecommendRequest) {
  const response = await axiosInstance.post<AiRecommendResponse[]>("/Ai/recommend", data);
  return response.data;
}

export async function generateAiItinerary(data: AiGenerateItineraryRequest) {
  const response = await axiosInstance.post<AiGenerateItineraryResponse>("/Ai/generate-itinerary", data);
  return response.data;
}
