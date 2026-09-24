import axios from "axios";

export const deductCredits = async (userId, agent, specificAgent) => {
  try {
    const resolvedAgent = specificAgent || agent || "chat";

    if (!userId) {
      console.warn("deductCredits: Missing userId");
      return { success: false, message: "User not authenticated" };
    }

    const { data } = await axios.post(
      `${process.env.AUTH_SERVICE}/deduct-credits`,
      { userId, agent: resolvedAgent },
    );

    return {
      success: true,
      credits: data.credits,
      totalCredits: data.totalCredits,
      plan: data.plan,
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to deduct credits";
    console.warn("deductCredits error:", message);
    return {
      success: false,
      message,
      credits: error.response?.data?.credits,
    };
  }
};
