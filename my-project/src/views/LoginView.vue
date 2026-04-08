<script setup lang="ts">
import { reactive, ref } from "vue";
import { AxiosError } from "axios";
import AuthShell from "../components/AuthShell.vue";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const form = reactive({
  email: "",
  password: ""
});
const error = ref("");

const submit = async () => {
  error.value = "";
  try {
    await authStore.login(form);
  } catch (issue) {
    error.value =
      issue instanceof AxiosError
        ? issue.response?.data?.message ?? "Unable to sign in"
        : "Unable to sign in";
  }
};
</script>

<template>
  <AuthShell title="Welcome back" subtitle="Use your email to continue chatting.">
    <form class="space-y-5" @submit.prevent="submit">
      <label class="block space-y-2">
        <span class="text-sm text-slate-300">Email</span>
        <input
          v-model="form.email"
          type="email"
          required
          class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-300/60"
          placeholder="name@example.com"
        />
      </label>

      <label class="block space-y-2">
        <span class="text-sm text-slate-300">Password</span>
        <input
          v-model="form.password"
          type="password"
          required
          class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-300/60"
          placeholder="Enter your password"
        />
      </label>

      <p v-if="error" class="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
        {{ error }}
      </p>

      <button
        type="submit"
        class="w-full rounded-2xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
        :disabled="authStore.loading"
      >
        {{ authStore.loading ? "Signing in..." : "Sign in" }}
      </button>

      <p class="text-sm text-slate-400">
        Need an account?
        <RouterLink class="text-emerald-300" to="/register">Create one</RouterLink>
      </p>
    </form>
  </AuthShell>
</template>
