import { defineStore } from "pinia";
import { ref } from "vue";
import router from "../router";
import { api } from "../services/api";
import { connectSocket, disconnectSocket } from "../services/socket";
import type { User } from "../types/chat";

type AuthPayload = {
  user: User;
  token: string;
};

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("chat_token"));
  const storedUser = localStorage.getItem("chat_user");
  const user = ref<User | null>(storedUser ? (JSON.parse(storedUser) as User) : null);
  const loading = ref(false);

  const setSession = (payload: AuthPayload) => {
    token.value = payload.token;
    user.value = payload.user;
    localStorage.setItem("chat_token", payload.token);
    localStorage.setItem("chat_user", JSON.stringify(payload.user));
    connectSocket(payload.token);
  };

  const clearSession = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("chat_token");
    localStorage.removeItem("chat_user");
    disconnectSocket();
  };

  const bootstrap = async () => {
    if (!token.value) {
      return;
    }

    try {
      const { data } = await api.get<{ user: User }>("/auth/me");
      user.value = data.user;
      localStorage.setItem("chat_user", JSON.stringify(data.user));
      connectSocket(token.value);
    } catch {
      clearSession();
    }
  };

  const register = async (payload: { email: string; username: string; password: string }) => {
    loading.value = true;
    try {
      const { data } = await api.post<AuthPayload>("/auth/register", payload);
      setSession(data);
      await router.push({ name: "chat" });
    } finally {
      loading.value = false;
    }
  };

  const login = async (payload: { email: string; password: string }) => {
    loading.value = true;
    try {
      const { data } = await api.post<AuthPayload>("/auth/login", payload);
      setSession(data);
      await router.push({ name: "chat" });
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    clearSession();
    await router.push({ name: "login" });
  };

  return {
    token,
    user,
    loading,
    bootstrap,
    login,
    register,
    logout
  };
});
