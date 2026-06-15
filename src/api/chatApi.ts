import axiosInstance from "./axiosInstance";
import type { ConversationDto, MessageDto } from "@/types/chat";
import type { PaginatedList } from "@/types/destinations";

export async function getConversations() {
  const response = await axiosInstance.get<ConversationDto[]>("/Chat/conversations");
  return response.data;
}

export async function getMessages(chatId: number, page: number = 1, pageSize: number = 20) {
  const response = await axiosInstance.get<PaginatedList<MessageDto>>(`/Chat/conversations/${chatId}/messages`, {
    params: { page, pageSize }
  });
  return response.data;
}

export async function sendDirectMessage(receiverId: number | undefined, content: string, chatId?: number) {
  const response = await axiosInstance.post<{ message: string, messageID: number }>("/Chat/messages/send", {
    receiverID: receiverId,
    chatID: chatId,
    content: content
  });
  return response.data;
}

export async function createGroupChat(chatName: string, participantUserIDs: number[] = []) {
  const response = await axiosInstance.post<{ message: string, chatID: number }>("/Chat/groups", {
    chatName,
    participantUserIDs
  });
  return response.data;
}

export async function addParticipantToGroup(chatId: number, userId: number) {
  const response = await axiosInstance.post<{ message: string }>(`/Chat/${chatId}/participants`, {
    userID: userId
  });
  return response.data;
}

export async function deleteGroupChat(chatId: number) {
  const response = await axiosInstance.delete<{ message: string }>(`/Chat/groups/${chatId}`);
  return response.data;
}

export async function deleteMessage(messageId: number) {
  const response = await axiosInstance.delete<{ message: string }>(`/Chat/messages/${messageId}`);
  return response.data;
}
