import api from "./authApi";

// Types
export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
}

export interface SearchResult {
  _id: string;
  username: string;
  avatar: string;
  bio: string;
}

// Fonctions pour les utilisateurs
export const getUserProfile = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data.data;
};

export const followUser = async (userId: string) => {
  const response = await api.post(`/users/${userId}/follow`);
  return response.data.data;
};

export const searchUsers = async (query: string) => {
  const response = await api.get(`/users/search/${query}`);
  return response.data.data;
};

export const getUserFollowers = async (userId: string) => {
  const response = await api.get(`/users/${userId}/followers`);
  return response.data.data;
};

export const getUserFollowing = async (userId: string) => {
  const response = await api.get(`/users/${userId}/following`);
  return response.data.data;
};

export const updateUserProfile = async (formData: FormData) => {
  const response = await api.put("/auth/update-profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const resetUserAvatar = async () => {
  const response = await api.put("/auth/reset-avatar");
  return response.data;
}
