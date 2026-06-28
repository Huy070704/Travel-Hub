export type AiRecommendRequest = {
  budgetVND: number;
  days: number;
  interests?: string;
  departure?: string;
  destination?: string;
  transportationPreference?: string;
  travelGroup?: string;
  destinationType?: string;
  mainTravelGoal?: string;
  preferredWeather?: string;
  accommodationType?: string;
  budgetStyle?: string;
  page?: number;
  pageSize?: number;
};

export type AiRecommendResponse = {
  destinationID: number;
  name: string;
  cityProvince: string;
  matchReason: string;
  distance: string;
  estimatedCostVND: number;
  imageUrl?: string;
  dailyCostBreakdown: {
    accommodation: string;
    food: string;
    transportation: string;
    activities: string;
    entertainment: string;
    shopping: string;
  };
};

export type PaginatedAiResponse = {
  items: AiRecommendResponse[];
  totalCount: number;
  page: number;
  totalPages: number;
};

export type AiGenerateItineraryRequest = {
  destinationID: number;
  days: number;
  travelStyle?: string;
  budgetVND?: number;
};

export type AiActivity = {
  time: string;
  description: string;
  estimatedCostVND: number;
};

export type AiDayItinerary = {
  dayNumber: number;
  activities: AiActivity[];
};

export type AiGenerateItineraryResponse = {
  title: string;
  totalDays: number;
  days: AiDayItinerary[];
};
