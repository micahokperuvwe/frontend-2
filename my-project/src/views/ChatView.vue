<script setup lang="ts">
import { computed, onMounted, reactive, watch } from "vue";
import CallPanel from "../components/CallPanel.vue";
import { useAuthStore } from "../stores/auth";
import { useChatStore } from "../stores/chat";

const authStore = useAuthStore();
const chatStore = useChatStore();
const composer = reactive({ message: "" });

const activeMessages = computed(() =>
  chatStore.selectedUserId ? chatStore.messages[chatStore.selectedUserId] ?? [] : []
);

const handleSend = async () => {
  if (!composer.message.trim()) {
    return;
  }

  await chatStore.sendMessage(composer.message);
  composer.message = "";
  chatStore.emitTyping(false);
};

watch(
  () => composer.message,
  (value) => {
    chatStore.emitTyping(Boolean(value.trim()));
  }
);

watch(
  () => chatStore.search,
  () => {
    void chatStore.loadUsers();
  }
);

onMounted(async () => {
  await chatStore.initialize();
});
</script>

<template>
  <div class="grid min-h-[calc(100vh-9rem)] gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
    <aside class="rounded-[2rem] border border-white/10 bg-slate-950/45 p-4 backdrop-blur">
      <div class="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
        <p class="text-sm text-slate-400">Signed in as</p>
        <h2 class="mt-2 text-xl font-semibold text-white">{{ authStore.user?.username }}</h2>
        <p class="text-sm text-slate-400">{{ authStore.user?.email }}</p>
      </div>

      <label class="mt-4 block">
        <span class="mb-2 block text-sm text-slate-400">Search by email</span>
        <input
          v-model="chatStore.search"
          type="text"
          placeholder="Search users"
          class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-300/60"
        />
      </label>

      <div class="mt-6 space-y-3 overflow-y-auto">
        <button
          v-for="user in chatStore.users"
          :key="user.id"
          class="flex w-full items-center justify-between rounded-[1.5rem] border px-4 py-3 text-left transition"
          :class="
            chatStore.selectedUserId === user.id
              ? 'border-emerald-300/50 bg-emerald-300/10'
              : 'border-white/8 bg-white/5 hover:bg-white/10'
          "
          @click="chatStore.loadMessages(user.id)"
        >
          <div>
            <p class="font-medium text-white">{{ user.username }}</p>
            <p class="text-sm text-slate-400">{{ user.email }}</p>
          </div>
          <span
            class="h-3 w-3 rounded-full"
            :class="user.isOnline ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-slate-500'"
          />
        </button>
      </div>
    </aside>

    <section class="flex min-h-[70vh] flex-col rounded-[2rem] border border-white/10 bg-slate-950/55 backdrop-blur">
      <template v-if="chatStore.selectedUser">
        <header class="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div>
            <h2 class="text-2xl font-semibold text-white">{{ chatStore.selectedUser.username }}</h2>
            <p class="text-sm text-slate-400">
              {{ chatStore.selectedUser.email }}
              <span class="mx-2">•</span>
              {{ chatStore.selectedUser.isOnline ? "Online" : "Offline" }}
              <span
                v-if="chatStore.typingUsers[chatStore.selectedUser.id]"
                class="ml-2 text-emerald-300"
              >
                typing...
              </span>
            </p>
          </div>

          <div class="flex gap-3">
            <button
              class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
              @click="chatStore.startCall(chatStore.selectedUser, 'voice')"
            >
              Voice call
            </button>
            <button
              class="rounded-full bg-emerald-400 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-300"
              @click="chatStore.startCall(chatStore.selectedUser, 'video')"
            >
              Video call
            </button>
          </div>
        </header>

        <div class="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <div
            v-for="message in activeMessages"
            :key="message.id"
            class="flex"
            :class="message.senderId === authStore.user?.id ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-xl rounded-[1.5rem] px-4 py-3"
              :class="
                message.senderId === authStore.user?.id
                  ? 'bg-emerald-400 text-slate-950'
                  : 'bg-white/8 text-white'
              "
            >
              <p>{{ message.message }}</p>
              <p
                class="mt-2 text-xs"
                :class="message.senderId === authStore.user?.id ? 'text-slate-800/70' : 'text-slate-400'"
              >
                {{ new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
              </p>
            </div>
          </div>
        </div>

        <form class="border-t border-white/10 px-6 py-5" @submit.prevent="handleSend">
          <div class="flex gap-3">
            <input
              v-model="composer.message"
              type="text"
              placeholder="Type your message"
              class="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-300/60"
            />
            <button
              type="submit"
              class="rounded-full bg-emerald-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-emerald-300"
            >
              Send
            </button>
          </div>
        </form>
      </template>

      <div v-else class="flex flex-1 items-center justify-center px-6 text-center">
        <div class="max-w-md space-y-4">
          <p class="text-xs uppercase tracking-[0.35em] text-emerald-300/80">Messaging</p>
          <h2 class="text-3xl font-semibold text-white">Choose a user to start chatting</h2>
          <p class="text-slate-400">
            Search by email, open the conversation, then send messages or launch a voice or video call.
          </p>
        </div>
      </div>
    </section>

    <CallPanel />
  </div>
</template>
