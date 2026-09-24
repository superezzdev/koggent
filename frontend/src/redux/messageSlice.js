import { createSlice } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
    artifacts: [],
    isLoading: false,

  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
      state.isLoading = false;
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
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setMessages, addMessage, addMessages, setArtifacts, setIsLoading } =
  messagesSlice.actions;

export default messagesSlice.reducer;
