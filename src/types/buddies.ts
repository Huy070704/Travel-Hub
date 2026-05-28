export type BuddyRecommendationDto = {
  userID: number;
  username: string;
  avatarURL?: string;
  fullName?: string;
  matchReason: string;
  matchScore: number;
};

export type CreateBuddyRequest = {
  receiverID: number;
  postID?: number;
};

export type BuddyRequestResponseDto = {
  companionID: number;
  requesterID: number;
  requesterUsername: string;
  receiverID: number;
  status: string;
  dateRequested: string; // ISO String
};

export type UpdateBuddyRequestStatus = {
  status: string; // "Accepted" or "Declined"
};

export type BuddyDto = {
  companionID: number;
  buddyUserID: number;
  buddyUsername: string;
  avatarURL?: string;
  connectedDate: string; // ISO String
};
