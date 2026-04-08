<script setup lang="ts">
import { computed, onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useAuthStore } from "./stores/auth";

const authStore = useAuthStore();
const route = useRoute();

const isAuthScreen = computed(() => route.name === "login" || route.name === "register");
const isWelcomeScreen = computed(() => route.name === "welcome");

onMounted(async () => {
  await authStore.bootstrap();
});
</script>

<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),_transparent_34%),linear-gradient(135deg,#08111f_0%,#0b1b2f_52%,#13263a_100%)] text-slate-100">
    <header
      class="border-b border-white/10 backdrop-blur"
      :class="isAuthScreen ? 'bg-transparent' : 'bg-slate-950/30'"
    >
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <p class="text-xs uppercase tracking-[0.35em] text-emerald-300/80">Email Chat</p>
          <h1 class="text-xl font-semibold text-white">Realtime messaging and calls</h1>
        </div>
        <div class="flex items-center gap-3">
          <template v-if="authStore.user">
            <RouterLink
              to="/chat"
              class="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
            >
              Open chat
            </RouterLink>
            <button
              class="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
              @click="authStore.logout"
            >
              Sign out
            </button>
          </template>
          <template v-else-if="isWelcomeScreen">
            <RouterLink
              to="/login"
              class="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
            >
              Sign in
            </RouterLink>
            <RouterLink
              to="/register"
              class="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Create account
            </RouterLink>
          </template>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <router-view />
    </main>
  </div>
</template>
