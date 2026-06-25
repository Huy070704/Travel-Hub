import axiosInstance from "./axiosInstance";
import type { DestinationDto, PaginatedList } from "@/types/destinations";

export async function getDestinations(
  search?: string,
  budget?: string,
  category?: string,
  page: number = 1,
  pageSize: number = 10
) {
  const response = await axiosInstance.get<PaginatedList<DestinationDto>>("/Destinations", {
    params: { search, budget, category, page, pageSize },
  });
  return response.data;
}

export async function getTrendingDestinations(limit: number = 5) {
  const response = await axiosInstance.get<DestinationDto[]>("/Destinations/trending", {
    params: { limit },
  });
  return response.data;
}

export async function getDestinationDetails(id: number) {
  const response = await axiosInstance.get<DestinationDto>(`/Destinations/${id}`);
  return response.data;
}

export async function createDestination(data: Partial<DestinationDto>) {
  const response = await axiosInstance.post<{ message: string; destinationId: number }>("/Destinations", data);
  return response.data;
}

export async function updateDestination(id: number, data: Partial<DestinationDto>) {
  const response = await axiosInstance.put<{ message: string; destinationId: number }>(`/Destinations/${id}`, data);
  return response.data;
}
