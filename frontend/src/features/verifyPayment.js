import api from "../../utils/axios";

export const verifyPayment = async (paymentData) => {
  try {
    const { data } = await api.post("/api/billing/verify", paymentData);
    return data;
  } catch (error) {
    console.error("verifyPayment error:", error);
    throw error;
  }
};
