
import axios from "axios";

const API_URL = "https://vocal-echo-social-backend.onrender.com/api";
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  gender: "male" | "female" | "other";
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  gender: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isAdmin?: boolean;
}

// Fonctions d'authentification
export const login = async (data: LoginRequest) => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error) {
    console.error("Erreur de connexion:", error);
    throw error;
  }
};

export const register = async (data: RegisterRequest) => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    throw error;
  }
};

export const resetAvatar = async () => {
  try {
    const response = await api.put("/auth/reset-avatar");
    return response.data;
  } catch (error) {
    console.error("Erreur reset avatar:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    throw error;
  }
};

export const updateProfile = async (data: FormData) => {
  try {
    const response = await api.put("/auth/update-profile", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: (data) => data, // Important pour FormData
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Erreur lors de la mise à jour du profil");
  }
};

export const changePassword = async (data: ChangePasswordRequest) => {
  try {
    const response = await api.put("/auth/change-password", data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors du changement de mot de passe:", error);
    throw error;
  }
};

export const forgotPassword = async (data: ForgotPasswordRequest) => {
  try {
    const response = await api.post("/auth/forgot-password", data);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la demande de réinitialisation du mot de passe:",
      error
    );
    throw error;
  }
};

export default api;
