
import api from "./authApi";

export interface CreateReportRequest {
  postId?: string;
  reason: string;
  details?: string;
}

export const createReport = async (data: CreateReportRequest) => {
  try {
    const response = await api.post("/api/reports", data);
    return response.data;
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  }
};
