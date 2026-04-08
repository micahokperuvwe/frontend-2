<script setup lang="ts">
import { reactive, ref } from "vue";
import { AxiosError } from "axios";
import AuthShell from "../components/AuthShell.vue";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const form = reactive({
  username: "",
  email: "",
  password: ""
});
const error = ref("");

const submit = async () => {
  error.value = "";
  try {
    await authStore.register(form);
  } catch (issue) {
    error.value =
      issue instanceof AxiosError
        ? issue.response?.data?.message ?? "Unable to create account"
        : "Unable to create account";
  }
};
</script>

<template>
  <AuthShell title="Create your account" subtitle="Register once, then message and call by email.">
    <form class="space-y-5" @submit.prevent="submit">
      <label class="block space-y-2">
        <span class="text-sm text-slate-300">Username</span>
        <input
          v-model="form.username"
          type="text"
          required
          class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-300/60"
          placeholder="Display name"
        />
      </label>

      <label class="block space-y-2">
        <span class="text-sm text-slate-300">Email</span>
        <input
          v-model="form.email"
          type="email"
          required
          class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-300/60"
          placeholder="name@example.com"
        />
      </label>

      <label class="block space-y-2">
        <span class="text-sm text-slate-300">Password</span>
        <input
          v-model="form.password"
          type="password"
          required
          minlength="6"
          class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-300/60"
          placeholder="At least 6 characters"
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
        {{ authStore.loading ? "Creating account..." : "Create account" }}
      </button>

      <p class="text-sm text-slate-400">
        Already have an account?
        <RouterLink class="text-emerald-300" to="/login">Sign in</RouterLink>
      </p>
    </form>
  </AuthShell>
</template>
