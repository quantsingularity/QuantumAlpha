import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { authAPI } from "./api";

/**
 * Talks to the real backend (api/app.py) and falls back to a local demo session
 * when the network is unreachable, so the app stays usable offline / in demo.
 *
 * Backend contract (after the api.js envelope unwrap):
 *   POST /auth/login    -> { token, refresh_token, user }
 *   POST /auth/register -> { user }   (no token issued on register)
 */
class AuthService {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async login(email, password) {
    try {
      const res = await authAPI.login(email, password);
      const data = res?.data || {};
      const token = data.token || data.access_token;
      const refreshToken = data.refresh_token || data.refreshToken;
      if (refreshToken)
        await AsyncStorage.setItem("refreshToken", refreshToken);
      return {
        user: data.user || { email, name: "Trader" },
        token: token || `session-${Date.now()}`,
      };
    } catch (error) {
      if (this._isNetworkError(error)) return this._demoSession(email);
      throw new Error(
        error.response?.data?.error || "Login failed. Check your credentials.",
      );
    }
  }

  async register(userData) {
    const email = userData.email;
    try {
      const payload = {
        name:
          userData.name ||
          `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
        email,
        password: userData.password,
      };
      await authAPI.register(payload);
      // Backend does not issue a token on register; sign in to obtain one.
      return await this.login(email, userData.password);
    } catch (error) {
      if (this._isNetworkError(error))
        return this._demoSession(email, userData.name);
      throw new Error(error.response?.data?.error || "Registration failed.");
    }
  }

  async logout() {
    try {
      await authAPI.logout();
    } catch {
      /* best effort */
    }
    await AsyncStorage.removeItem("refreshToken");
    this.token = null;
    return true;
  }

  async updateProfile(userData) {
    // No profile endpoint yet - echo back the merged record.
    return { id: userData.id || "me", ...userData };
  }

  async forgotPassword() {
    // No public reset endpoint yet; acknowledge without leaking account existence.
    await new Promise((r) => setTimeout(r, 600));
    return true;
  }

  async resetPassword() {
    await new Promise((r) => setTimeout(r, 600));
    return true;
  }

  _isNetworkError(error) {
    return (
      !error?.response ||
      error.code === "ECONNABORTED" ||
      error.message === "Network Error"
    );
  }

  _demoSession(email, name) {
    return {
      user: {
        id: "demo",
        email,
        name: name || "Demo User",
        profileImage: null,
      },
      token: `demo-${Date.now()}`,
    };
  }
}

export const authService = new AuthService();
export default authService;
