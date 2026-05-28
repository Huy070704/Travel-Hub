import axiosInstance from "./axiosInstance";
import type { 
  ItineraryDto, 
  CreateItineraryRequest, 
  UpdateItineraryRequest 
} from "@/types/itineraries";

export async function getMyItineraries() {
  const response = await axiosInstance.get<ItineraryDto[]>("/Itineraries");
  return response.data;
}

export async function getItinerary(id: number) {
  const response = await axiosInstance.get<ItineraryDto>(`/Itineraries/${id}`);
  return response.data;
}

export async function createItinerary(data: CreateItineraryRequest) {
  const response = await axiosInstance.post<{ message: string, itineraryID: number }>("/Itineraries", data);
  return response.data;
}

export async function updateItinerary(id: number, data: UpdateItineraryRequest) {
  const response = await axiosInstance.put<{ message: string }>(`/Itineraries/${id}`, data);
  return response.data;
}

export async function deleteItinerary(id: number) {
  const response = await axiosInstance.delete<{ message: string }>(`/Itineraries/${id}`);
  return response.data;
}
