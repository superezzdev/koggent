import api from "../../utils/axios";

async function sendMessage(payload) {
  try {
    const { data } = await api.post("/api/agent/chat", payload);
    return data;
  } catch (error) {
    console.error("sendMessage error:", error);
    return error.response?.data || null;
  }
}

export default sendMessage;
