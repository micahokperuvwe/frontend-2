<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
}>();
</script>

<template>
  <div class="mx-auto grid min-h-[calc(100vh-9rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
    <section class="space-y-6">
      <div class="inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
        Secure email auth, realtime presence, voice and video
      </div>
      <div class="space-y-4">
        <h2 class="max-w-xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
          Chat with anyone in your workspace without needing a phone number.
        </h2>
        <p class="max-w-2xl text-lg leading-8 text-slate-300">
          This MVP pairs email-based authentication with instant messaging, online presence, and browser-native WebRTC calling.
        </p>
      </div>
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-3xl border border-white/10 bg-white/6 p-5">
          <p class="text-sm text-slate-400">Authentication</p>
          <p class="mt-2 text-lg font-medium text-white">JWT + bcrypt</p>
        </div>
        <div class="rounded-3xl border border-white/10 bg-white/6 p-5">
          <p class="text-sm text-slate-400">Realtime</p>
          <p class="mt-2 text-lg font-medium text-white">Socket.IO chat</p>
        </div>
        <div class="rounded-3xl border border-white/10 bg-white/6 p-5">
          <p class="text-sm text-slate-400">Calling</p>
          <p class="mt-2 text-lg font-medium text-white">WebRTC media</p>
        </div>
      </div>
    </section>

    <section class="rounded-[2rem] border border-white/10 bg-slate-950/50 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur">
      <div class="mb-8">
        <h3 class="text-3xl font-semibold text-white">{{ title }}</h3>
        <p class="mt-2 text-slate-400">{{ subtitle }}</p>
      </div>
      <slot />
    </section>
  </div>
</template>
