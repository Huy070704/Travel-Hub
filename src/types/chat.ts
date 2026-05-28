export type ConversationDto = {
  chatID: number;
  chatName?: string;
  isGroupChat: boolean;
  lastMessage?: string;
  lastMessageDate?: string; // ISO String
  participantCount: number;
};

export type MessageDto = {
  messageID: number;
  chatID: number;
  senderID: number;
  senderUsername: string;
  content?: string;
  sentDate: string; // ISO String
};

export type SendMessageDto = {
  receiverID: number;
  content: string;
};
