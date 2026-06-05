import axiosInstance from "./axiosInstance";
import type { TourResponse, TourBooking, TourBookingRequest } from "@/types/tours";

export const searchTours = async (destination?: string, departureLocation?: string, departureDate?: string): Promise<TourResponse[]> => {
  const params = new URLSearchParams();
  if (destination && destination !== "Tất cả") params.append("destination", destination);
  if (departureLocation && departureLocation !== "Tất cả") params.append("departureLocation", departureLocation);
  if (departureDate) params.append("departureDate", departureDate);
  
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

export const updateTourBookingStatus = async (id: number, status: string): Promise<{message: string}> => {
  const response = await axiosInstance.put(`/Tour/bookings/${id}/status`, { status });
  return response.data;
};
