<template>
  <section class="grid min-h-[calc(100vh-9rem)] items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
    <div class="space-y-8">
      <div class="inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
        Email-first chat platform
      </div>

      <div class="space-y-5">
        <h2 class="max-w-3xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
          Welcome to a messaging space built for email, realtime chat, and browser calling.
        </h2>
        <p class="max-w-2xl text-lg leading-8 text-slate-300">
          Sign up with your email, see who is online, send instant messages, and jump into voice or video calls without leaving the app.
        </p>
      </div>

      <div class="flex flex-wrap gap-4">
        <RouterLink
          to="/register"
          class="rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Get Started
        </RouterLink>
        <RouterLink
          to="/login"
          class="rounded-full border border-white/15 bg-white/6 px-6 py-3 font-medium text-white transition hover:bg-white/10"
        >
          Sign In
        </RouterLink>
      </div>

      <div class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
          <p class="text-sm text-slate-400">Authentication</p>
          <p class="mt-3 text-lg font-medium text-white">Email + password login</p>
        </div>
        <div class="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
          <p class="text-sm text-slate-400">Realtime chat</p>
          <p class="mt-3 text-lg font-medium text-white">Socket-powered messaging</p>
        </div>
        <div class="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
          <p class="text-sm text-slate-400">Calls</p>
          <p class="mt-3 text-lg font-medium text-white">Voice and video with WebRTC</p>
        </div>
      </div>
    </div>

    <div class="relative">
      <div class="absolute inset-0 -z-10 rounded-[2.5rem] bg-emerald-400/15 blur-3xl"></div>
      <div class="rounded-[2.5rem] border border-white/10 bg-slate-950/55 p-6 shadow-2xl shadow-black/30 backdrop-blur">
        <div class="rounded-[2rem] border border-white/10 bg-white/5 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-400">Live workspace</p>
              <h3 class="mt-1 text-xl font-semibold text-white">Team chat overview</h3>
            </div>
            <span class="rounded-full bg-emerald-400/15 px-3 py-1 text-sm text-emerald-200">3 online</span>
          </div>

          <div class="mt-6 space-y-4">
            <div class="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-white">Amina Yusuf</p>
                  <p class="text-sm text-slate-400">amina@example.com</p>
                </div>
                <span class="h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50"></span>
              </div>
              <p class="mt-4 rounded-2xl bg-emerald-400 px-4 py-3 text-sm text-slate-950">
                Quick sync in 10 minutes? I can start a video call from here.
              </p>
            </div>

            <div class="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-white">Daniel Kim</p>
                  <p class="text-sm text-slate-400">daniel@example.com</p>
                </div>
                <span class="h-3 w-3 rounded-full bg-slate-500"></span>
              </div>
              <p class="mt-4 rounded-2xl bg-white/8 px-4 py-3 text-sm text-slate-200">
                Shared the latest update. Ping me when you are ready to review.
              </p>
            </div>
          </div>

          <div class="mt-6 grid gap-3 sm:grid-cols-2">
            <div class="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
              <p class="text-sm text-slate-400">Call controls</p>
              <p class="mt-2 text-white">Accept, reject, or end calls in one place.</p>
            </div>
            <div class="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
              <p class="text-sm text-slate-400">Presence</p>
              <p class="mt-2 text-white">See who is online before you message.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
