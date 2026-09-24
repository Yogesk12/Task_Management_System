import { createSlice } from "@reduxjs/toolkit";
import { getToken } from "../../utils/authStorage.js";

const storedToken = getToken();

const initialState = {
  user: null,
  token: storedToken,
  isAuthenticated: !!storedToken,
  authInitializing: !!storedToken,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.authInitializing = false;
      state.error = null;
    },

    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.authInitializing = false;
    },

    getUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    getUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.authInitializing = false;
      state.error = null;
    },

    getUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.authInitializing = false;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.authInitializing = false;
      state.loading = false;
      state.error = null;
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  getUserStart,
  getUserSuccess,
  getUserFailure,
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;