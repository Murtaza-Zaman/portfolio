import { create } from "zustand";

const tokenKey = "murtaza_access_token";
const userKey = "murtaza_auth_user";

function readToken() {
  try {
    return localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey) || null;
  } catch {
    return null;
  }
}

function readUser() {
  try {
    const raw = localStorage.getItem(userKey) || sessionStorage.getItem(userKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create((set) => ({
  token: readToken(),
  user: readUser(),
  setSession: (sessionData) => {
    const data = sessionData?.data || sessionData;
    const token = data?.token ?? data?.accessToken ?? null;
    const user = data?.user ?? null;
    try {
      if (token) {
        localStorage.setItem(tokenKey, token);
        sessionStorage.setItem(tokenKey, token);
        if (user) {
          localStorage.setItem(userKey, JSON.stringify(user));
        }
      } else {
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(userKey);
        sessionStorage.removeItem(tokenKey);
      }
    } catch {
      // Ignore storage errors in restricted iframe/browser modes
    }
    set({ token, user });
  },
  clearSession: () => {
    try {
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(userKey);
      sessionStorage.removeItem(tokenKey);
    } catch {
      // Ignore storage errors
    }
    set({ token: null, user: null });
  },
}));

export function getAccessToken() {
  return useAuthStore.getState().token;
}
