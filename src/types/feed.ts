export type PostDto = {
  postID: number;
  userID: number;
  username: string;
  itineraryID?: number;
  postType: string;
  title: string;
  content?: string;
  likesCount: number;
  creationDate: string; // ISO String
};

export type CreatePostRequest = {
  itineraryID?: number;
  postType: string;
  title: string;
  content?: string;
};

export type CommentDto = {
  commentID: number;
  postID: number;
  userID: number;
  username: string;
  content?: string;
  commentDate: string; // ISO String
};

export type CreateCommentRequest = {
  content: string;
};
