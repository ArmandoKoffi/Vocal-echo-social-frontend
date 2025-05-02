import api from "./authApi";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactMessage = async (data: ContactFormData) => {
  try {
    const response = await api.post("/contact", data);
    return response.data;
  } catch (error: any) {
    console.error("Détails de l'erreur:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    let errorMessage = "Une erreur est survenue lors de l'envoi du message";
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    throw new Error(errorMessage);
  }
};
