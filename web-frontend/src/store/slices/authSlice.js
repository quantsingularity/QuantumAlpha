import { createSlice } from "@reduxjs/toolkit";

/**
 * Auth state is hydrated from localStorage on boot and persisted on every
 * change (see store/index.js). This is what keeps a logged-in user logged in
 * across refreshes instead of bouncing back to the login screen.
 */
const TOKEN_KEY = "qa_token";
const USER_KEY = "qa_user";

const loadInitialState = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    const user = userRaw ? JSON.parse(userRaw) : null;
    return {
      isAuthenticated: Boolean(token),
      user,
      token: token || null,
      loading: false,
      error: null,
    };
  } catch {
    return {
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,
    };
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser } =
  authSlice.actions;
export { TOKEN_KEY, USER_KEY };
export default authSlice.reducer;
