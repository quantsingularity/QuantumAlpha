import { configureStore } from "@reduxjs/toolkit";
import { api } from "../services/api";
import authReducer, { TOKEN_KEY, USER_KEY } from "./slices/authSlice";
import portfolioReducer from "./slices/portfolioSlice";
import strategyReducer from "./slices/strategySlice";
import themeReducer from "./slices/themeSlice";
import uiReducer from "./slices/uiSlice";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    portfolio: portfolioReducer,
    strategy: strategyReducer,
    theme: themeReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Persist auth to localStorage so sessions survive a refresh.
let lastToken;
let lastUser;
store.subscribe(() => {
  const { token, user } = store.getState().auth;
  if (token !== lastToken || user !== lastUser) {
    lastToken = token;
    lastUser = user;
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(USER_KEY);
    } catch {
      /* storage unavailable - non-fatal */
    }
  }
});

export { store };
export default store;
