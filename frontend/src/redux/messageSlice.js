import { createSlice } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
    artifacts: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    addMessage: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.messages.push(...action.payload);
      } else if (action.payload) {
        state.messages.push(action.payload);
      }
    },

    addMessages: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.messages.push(...action.payload);
      } else if (action.payload) {
        state.messages.push(action.payload);
      }
    },

    setArtifacts: (state, action) => {
      state.artifacts = action.payload || [];
    },
  },
});

export const { setMessages, addMessage, addMessages, setArtifacts } =
  messagesSlice.actions;

export default messagesSlice.reducer;
