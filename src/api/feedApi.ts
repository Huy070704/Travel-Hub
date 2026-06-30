import axiosInstance from "./axiosInstance";
import type { 
  PostDto, 
  CreatePostRequest, 
  CommentDto, 
  CreateCommentRequest 
} from "@/types/feed";
import type { PaginatedList } from "@/types/destinations"; // reusing PaginatedList type

export async function getPosts(page: number = 1, pageSize: number = 10) {
  const response = await axiosInstance.get<PaginatedList<PostDto>>("/Feed/posts", {
    params: { page, pageSize, _: Date.now() }
  });
  return response.data;
}

export async function createPost(data: CreatePostRequest) {
  const response = await axiosInstance.post<{ message: string, postID: number }>("/Feed/posts", data);
  return response.data;
}

export async function deletePost(postId: number) {
  const response = await axiosInstance.delete<{ message: string, postID: number }>(`/Feed/posts/${postId}`);
  return response.data;
}

export async function toggleLike(postId: number) {
  const response = await axiosInstance.post<{ message: string, likesCount: number }>(`/Feed/posts/${postId}/like`);
  return response.data;
}

export async function getComments(postId: number, page: number = 1, pageSize: number = 10) {
  const response = await axiosInstance.get<PaginatedList<CommentDto>>(`/Feed/posts/${postId}/comments`, {
    params: { page, pageSize }
  });
  return response.data;
}

export async function addComment(postId: number, data: CreateCommentRequest) {
  const response = await axiosInstance.post<{ message: string, commentID: number }>(`/Feed/posts/${postId}/comments`, data);
  return response.data;
}

export async function deleteComment(commentId: number) {
  const response = await axiosInstance.delete<{ message: string, commentID: number }>(`/Feed/comments/${commentId}`);
  return response.data;
}

export async function reportPost(postId: number, reason: string) {
  const response = await axiosInstance.post<{ message: string }>(`/Feed/posts/${postId}/report`, { reason });
  return response.data;
}
