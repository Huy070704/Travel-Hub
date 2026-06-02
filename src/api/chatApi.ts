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

export async function sendDirectMessage(receiverId: number, content: string) {
  const response = await axiosInstance.post<{ message: string, messageID: number }>("/Chat/messages/send", {
    receiverID: receiverId,
    content: content
  });
  return response.data;
}
