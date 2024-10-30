import { createSlice } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

const initialState = {
  chats: [],
  selected: 0,
  waitingMessages: [],
  chatsMessages: {},
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats(state, action) {
      state.chats = action.payload;
    },
    addChat(state, action) {
      state.chats.push(action.payload);
    },
    setSelected(state, action) {
      state.selected = action.payload;
    },
    addWaitingMessages(state, action) {
      state.waitingMessages.push(action.payload);
    },
    removeWaitingMessages(state, action) {
      const { id } = action.payload;
      state.waitingMessages = state.waitingMessages.filter((m) => m.id === id);
    },
    setChatMessage(state, action) {
      const { chatId, messages } = action.payload;
      if (messages.length === 0) return;
      state.chatsMessages[chatId] = messages;
    },
    removeChatMessage(state, action) {
      const { chatId, message } = action.payload;
      if (Object.keys(state.chatsMessages).includes(String(chatId))) {
        state.chatsMessages[chatId] = state.chatsMessages[chatId].filter((m) => m.id !== message.id);
      }

      const chat = state.chats.find((c) => c.id === chatId);
      if (chat) {
        chat.messages = chat.messages.filter((m) => m.id !== message.id);
      }
    },
    addChatMessage(state, action) {
      const { chatId, message } = action.payload;
      if (!state.chatsMessages[chatId]) {
        state.chatsMessages[chatId] = [message];
      } else {
        state.chatsMessages[chatId].push(message);
      }
    },
    updateChatMessage(state, action) {
      const { chatId, message } = action.payload;
      if (Object.keys(state.chatsMessages).includes(String(chatId))) {
        state.chatsMessages[chatId] = state.chatsMessages[chatId].map((m) => {
          if (m.id === message.id) return message;
          return m;
        });
      }

      const chat = state.chats.find((c) => c.id === chatId);
      if (chat) {
        chat.messages = chat.messages.map((m) => {
          if (m.id === message.id) return message;
          return m;
        });
      }
    },
  },
});

// Selectors
export const selectAllChats = (state) =>
  state.chats.chats.map((c) => {
    const waitingMessages = state.chats.waitingMessages.filter((m) => m.chatId === c.id);
    if (waitingMessages.length >= 1) {
      return { ...c, messages: waitingMessages.slice(-1) };
    }

    if (Object.keys(state.chats.chatsMessages).includes(String(c.id)) && state.chats.chatsMessages[c.id].length > 0) {
      return { ...c, messages: state.chats.chatsMessages[c.id].slice(-1) };
    }

    const chat = state.chats.chats.find((ch) => ch.id === c.id);
    if (chat?.messages.length > 0) {
      return chat;
    }

    return {
      ...c,
      messages: [
        {
          author: { name: '' },
          content: 'nothing here yet',
          editedAt: DateTime.now(),
        },
      ],
    };
  });

export const selectedChats = (state) => state.chats.chats[state.chats.selected] || [];
export const sliceChats = (state) => state.chats.chats;

export const selectChatMessages = (state, chatId) => [
  ...(state.chats.chatsMessages[chatId] || []),
  ...state.chats.waitingMessages.filter((m) => m.chatId === chatId),
];

export const {
  setChats,
  addChat,
  setSelected,
  addWaitingMessages,
  removeWaitingMessages,
  addChatMessage,
  setChatMessage,
  removeChatMessage,
  updateChatMessage,
} = chatsSlice.actions;

export default chatsSlice.reducer;
