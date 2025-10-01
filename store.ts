import { configureStore } from '@reduxjs/toolkit';
import LoginSlice from './src/features/LoginSlice';

export const store = configureStore({
  reducer: {
    // Reducers will be added here
    login: LoginSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;