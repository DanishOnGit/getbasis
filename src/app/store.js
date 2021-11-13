import { configureStore } from '@reduxjs/toolkit';
import authenticationSliceReducer from '../features/authentication/authenticationSlice';
export const store = configureStore({
  reducer: {
    auth:authenticationSliceReducer
  },
});