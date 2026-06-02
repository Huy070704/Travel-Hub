export type AiRecommendRequest = {
  budgetVND: number;
  days: number;
  interests?: string;
  departure?: string;
  transportationPreference?: string;
  travelGroup?: string;
  destinationType?: string;
  mainTravelGoal?: string;
  preferredWeather?: string;
  accommodationType?: string;
  budgetStyle?: string;
};

export type AiRecommendResponse = {
  destinationID: number;
  name: string;
  cityProvince: string;
  matchReason: string;
  estimatedCostVND: number;
  dailyCostBreakdown: {
    accommodation: string;
    food: string;
    transportation: string;
    activities: string;
    entertainment: string;
    shopping: string;
  };
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
