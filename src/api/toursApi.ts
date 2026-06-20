import axiosInstance from "./axiosInstance";
import type { TourResponse, TourBooking, TourBookingRequest } from "@/types/tours";

export interface PaginatedTourResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  data: TourResponse[];
}

export const searchTours = async (
  destination?: string, 
  departureLocation?: string, 
  departureDate?: string,
  page: number = 1,
  pageSize: number = 12
): Promise<PaginatedTourResponse> => {
  const params = new URLSearchParams();
  if (destination && destination !== "Tất cả") params.append("destination", destination);
  if (departureLocation && departureLocation !== "Tất cả") params.append("departureLocation", departureLocation);
  if (departureDate) params.append("departureDate", departureDate);
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());
  
  const response = await axiosInstance.get(`/Tour/search?${params.toString()}`);
  return response.data;
};

export const getPopularDestinations = async (): Promise<string[]> => {
  const response = await axiosInstance.get('/Tour/destinations');
  return response.data;
};

export const getTourDetails = async (id: number): Promise<TourResponse> => {
  const response = await axiosInstance.get(`/Tour/${id}`);
  return response.data;
};

export const bookTour = async (data: TourBookingRequest): Promise<{message: string, bookingId: number}> => {
  const response = await axiosInstance.post('/Tour/book', data);
  return response.data;
};

export const getUserTourBookings = async (): Promise<TourBooking[]> => {
  const response = await axiosInstance.get('/Tour/bookings/user');
  return response.data;
};

export const getAllTourBookings = async (): Promise<TourBooking[]> => {
  const response = await axiosInstance.get('/Tour/bookings');
  return response.data;
};

export const updateTourBookingStatus = async (bookingId: number, status: string) => {
  const response = await axiosInstance.put(`/Tour/bookings/${bookingId}/status`, { status });
  return response.data;
};

export const createTour = async (tourData: any) => {
  const response = await axiosInstance.post('/Tour', tourData);
  return response.data;
};

export const getMyTours = async () => {
  const response = await axiosInstance.get('/Tour/my-tours');
  return response.data;
};
