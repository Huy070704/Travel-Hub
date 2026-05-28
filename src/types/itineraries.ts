export type ItineraryDetailDto = {
  detailID: number;
  destinationID: number;
  destinationName: string;
  dayNumber: number;
  timeSlot?: string;
  activityDescription?: string;
  estimatedCostVND?: number;
};

export type ItineraryDto = {
  itineraryID: number;
  userID: number;
  tripName: string;
  startDate: string; // ISO String
  endDate: string; // ISO String
  totalBudgetEstimatedVND?: number;
  status: string;
  details?: ItineraryDetailDto[]; // Optional since basic list doesn't include details
};

export type CreateItineraryDetailRequest = {
  destinationID: number;
  dayNumber: number;
  timeSlot?: string;
  activityDescription?: string;
  estimatedCostVND?: number;
};

export type CreateItineraryRequest = {
  tripName: string;
  startDate: string; // ISO String
  endDate: string; // ISO String
  totalBudgetEstimatedVND?: number;
  details?: CreateItineraryDetailRequest[];
};

export type UpdateItineraryRequest = {
  tripName?: string;
  startDate?: string;
  endDate?: string;
  totalBudgetEstimatedVND?: number;
  status?: string;
};
