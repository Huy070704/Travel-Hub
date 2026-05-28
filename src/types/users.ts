export type UserProfileDto = {
  userID: number;
  username: string;
  email: string;
  avatarURL?: string;
  fullName?: string;
  dateOfBirth?: string; // ISO string
  studentCode?: string;
  gender?: string;
  registrationDate: string; // ISO string
  preferredBudgetVND?: number;
  travelStyle?: string;
  favoriteActivities?: string;
  maxDurationDays?: number;
  preferredDestinations?: string;
};

export type UpdateProfileRequest = {
  avatarURL?: string;
  fullName?: string;
  dateOfBirth?: string; // ISO string
  gender?: string;
  preferredBudgetVND?: number;
  travelStyle?: string;
  favoriteActivities?: string;
  maxDurationDays?: number;
  preferredDestinations?: string;
};

export type PublicUserProfileDto = {
  userID: number;
  username: string;
  avatarURL?: string;
  fullName?: string;
  gender?: string;
  travelStyle?: string;
  favoriteActivities?: string;
  preferredDestinations?: string;
};

export type DashboardDto = {
  upcomingTripsCount: number;
  pendingBuddyRequestsCount: number;
  savedDestinationsCount: number;
};
