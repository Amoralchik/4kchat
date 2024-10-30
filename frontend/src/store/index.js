import { configureStore } from '@reduxjs/toolkit';
import chatsReducer from './chats';
import userReducer from './user';

export const store = configureStore({
  reducer: {
    chats: chatsReducer,
    user: userReducer,
  },
});
