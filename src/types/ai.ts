export type AiRecommendRequest = {
  budgetVND: number;
  days: number;
  interests?: string;
};

export type AiRecommendResponse = {
  destinationID: number;
  name: string;
  cityProvince: string;
  matchReason: string;
  estimatedCostVND: number;
};

export type AiGenerateItineraryRequest = {
  destinationID: number;
  days: number;
  travelStyle?: string;
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
