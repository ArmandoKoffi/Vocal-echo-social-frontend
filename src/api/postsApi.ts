import api from "./authApi";

// Types
export interface Post {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  audioUrl: string;
  audioDuration?: number;
  description?: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  hasLiked: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content?: string;
  audioUrl?: string;
  audioDuration?: number;
  timestamp: string;
}

export interface CreatePostRequest {
  description?: string;
  audioDuration: number;
  audio: File;
}

export interface CreateCommentRequest {
  content?: string;
  audioDuration?: number;
  audio?: File;
}

export interface UpdatePostRequest {
  description?: string;
  audioDuration?: number;
  audio?: File;
}

// Fonctions pour les posts
export const getAllPosts = async () => {
  const response = await api.get("/posts");
  return response.data.data;
};

export const getUserPosts = async (userId: string) => {
  const response = await api.get(`/posts/user/${userId}`);
  return response.data.data;
};

export const createPost = async (data: CreatePostRequest) => {
  const formData = new FormData();
  if (data.description) formData.append("description", data.description);
  formData.append("audioDuration", data.audioDuration.toString());
  formData.append("audio", data.audio);

  const response = await api.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};

export const updatePost = async (postId: string, data: FormData | { description: string }) => {
  const headers = data instanceof FormData 
    ? { "Content-Type": "multipart/form-data" } 
    : { "Content-Type": "application/json" };

  const response = await api.put(`/posts/${postId}`, data, { headers });
  return response.data.data;
};

export const likePost = async (postId: string) => {
  try {
    const response = await api.post(`/posts/${postId}/like`);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Action échouée");
    }

    return {
      likes: response.data.data.likes,
      hasLiked: response.data.data.hasLiked,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Problème de communication avec le serveur"
    );
  }
};

export const commentOnPost = async (
  postId: string,
  data: FormData | { content: string }
) => {
  const headers =
    data instanceof FormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" };

  const response = await api.post(`/posts/${postId}/comment`, data, {
    headers,
  });
  return response.data.data;
};

export const deletePost = async (postId: string) => {
  try {
    const response = await api.delete(`/posts/${postId}`);
    
    if (!response.data?.success) {
      throw new Error(response.data?.message || "Échec de la suppression");
    }
    
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      "Problème lors de la suppression du post"
    );
  }
};
