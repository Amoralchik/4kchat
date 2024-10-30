import { createSlice } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

const initialState = {
  user: {},
  lastVisitTime: {}, // Stores last visit time by chatId
  status: 'online',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setLastVisitTime(state, action) {
      const chatId = action.payload;
      state.lastVisitTime[chatId] = DateTime.now().toISO(); // Store as ISO string for consistency
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
});

// Selectors
export const selectIsAuthenticated = (state) => !!state.user.user.email;

export const selectUser = (state) => state.user.user;

export const selectNewMessage = (state, chatId) => state.user.lastVisitTime[chatId] > DateTime.now().toISO();

export const { setUser, setLastVisitTime, setStatus } = userSlice.actions;

export default userSlice.reducer;
