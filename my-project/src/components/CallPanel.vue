<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useChatStore } from "../stores/chat";

const chatStore = useChatStore();
const localVideo = ref<HTMLVideoElement | null>(null);
const remoteVideo = ref<HTMLVideoElement | null>(null);

const visible = computed(() => chatStore.activeCallUser || chatStore.incomingCall);

watch(
  () => chatStore.localStream,
  (stream) => {
    if (localVideo.value) {
      localVideo.value.srcObject = stream;
    }
  }
);

watch(
  () => chatStore.remoteStream,
  (stream) => {
    if (remoteVideo.value) {
      remoteVideo.value.srcObject = stream;
    }
  }
);

onBeforeUnmount(() => {
  if (localVideo.value) {
    localVideo.value.srcObject = null;
  }
  if (remoteVideo.value) {
    remoteVideo.value.srcObject = null;
  }
});
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div class="w-full max-w-4xl rounded-[2rem] border border-white/10 bg-slate-950 p-6 text-white shadow-2xl shadow-black/40">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-emerald-300/80">Call Session</p>
            <h3 class="mt-2 text-2xl font-semibold">
              {{ chatStore.activeCallUser?.username ?? chatStore.incomingCall?.caller.username }}
            </h3>
            <p class="mt-2 text-slate-400">{{ chatStore.callStatus }}</p>
          </div>
          <button class="rounded-full border border-white/10 px-4 py-2 text-sm" @click="chatStore.endCall()">
            End call
          </button>
        </div>

        <div class="mt-6 grid gap-4 lg:grid-cols-2">
          <div class="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-4">
            <p class="mb-3 text-sm text-slate-400">Remote</p>
            <video
              ref="remoteVideo"
              autoplay
              playsinline
              class="aspect-video w-full rounded-[1.25rem] bg-slate-950 object-cover"
            />
          </div>
          <div class="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-4">
            <p class="mb-3 text-sm text-slate-400">You</p>
            <video
              ref="localVideo"
              autoplay
              muted
              playsinline
              class="aspect-video w-full rounded-[1.25rem] bg-slate-950 object-cover"
            />
          </div>
        </div>

        <div v-if="chatStore.incomingCall" class="mt-6 flex flex-wrap gap-3">
          <button class="rounded-full bg-emerald-400 px-5 py-3 font-medium text-slate-950" @click="chatStore.acceptCall">
            Accept
          </button>
          <button class="rounded-full bg-rose-500 px-5 py-3 font-medium text-white" @click="chatStore.rejectCall">
            Reject
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
