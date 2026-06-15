export type ConversationDto = {
  chatID: number;
  chatName?: string;
  isGroupChat: boolean;
  lastMessage?: string;
  lastMessageDate?: string; // ISO String
  participantCount: number;
  otherUserID?: number;
  avatarURL?: string;
};

export type MessageDto = {
  messageID: number;
  chatID: number;
  senderID: number;
  senderUsername: string;
  avatarURL?: string;
  content?: string;
  sentDate: string; // ISO String
};

export type SendMessageDto = {
  chatID?: number;
  receiverID?: number;
  content: string;
};

export type CreateGroupChatDto = {
  chatName: string;
  participantUserIDs: number[];
};

export type AddParticipantDto = {
  userID: number;
};
