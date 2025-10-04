import apiClient from "./apiClient";

export type Message = {
  full_name: string;

  email: string;
  phone: string;
  subject: string;
  message: string;
};

export const sendMessage = async (data: Message) => {
  try {
    const res = await apiClient.post("contact/", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getMessages = async () => {
  const res = await apiClient.get("contact/");
  return res.data;
};
