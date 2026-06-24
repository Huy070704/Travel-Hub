export interface TourResponse {
  tourID: number;
  title: string;
  destination: string;
  departureLocation: string;
  departureDate: string;
  durationDays: number;
  durationText?: string;
  priceVND: number;
  imageUrl?: string;
  description?: string;
  numberOfBookings: number;
}

export interface TourBookingRequest {
  tourID: number;
  tourTitle: string;
  destination: string;
  imageUrl: string;
  departureDate: string;
  fullName: string;
  phone: string;
  email?: string;
  notes?: string;
  guests: number;
  totalPriceVND: number;
}

export interface TourBooking {
  bookingID: number;
  tourID: number;
  tourTitle: string;
  destination: string;
  imageUrl: string;
  departureDate: string;
  fullName: string;
  phone: string;
  email?: string;
  notes?: string;
  guests: number;
  totalPriceVND: number;
  bookingDate: string;
  status: string;
  userID: number;
  username?: string;
}
