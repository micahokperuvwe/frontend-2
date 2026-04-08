import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { api } from "../services/api";
import { connectSocket, getSocket } from "../services/socket";
import { useAuthStore } from "./auth";
import type { Conversation, IncomingCall, Message, User } from "../types/chat";

type CallType = "voice" | "video";

export const useChatStore = defineStore("chat", () => {
  const users = ref<User[]>([]);
  const conversations = ref<Conversation[]>([]);
  const messages = ref<Record<string, Message[]>>({});
  const selectedUserId = ref<string | null>(null);
  const search = ref("");
  const typingUsers = ref<Record<string, boolean>>({});
  const incomingCall = ref<IncomingCall | null>(null);
  const activeCallUser = ref<User | null>(null);
  const activeCallType = ref<CallType | null>(null);
  const isDialing = ref(false);
  const localStream = ref<MediaStream | null>(null);
  const remoteStream = ref<MediaStream | null>(null);
  const peerConnection = ref<RTCPeerConnection | null>(null);
  const callStatus = ref("Idle");
  const authStore = useAuthStore();

  const selectedUser = computed(
    () => users.value.find((user) => user.id === selectedUserId.value) ?? null
  );

  const socket = () => {
    if (!authStore.token) {
      return null;
    }

    return getSocket() ?? connectSocket(authStore.token);
  };

  const syncConversationPreview = (message: Message) => {
    const userId =
      message.senderId === authStore.user?.id ? message.receiverId : message.senderId;
    const participant = users.value.find((user) => user.id === userId);

    if (!participant) {
      return;
    }

    const existing = conversations.value.find((conversation) => conversation.id === message.conversationId);

    if (existing) {
      existing.lastMessage = message.message;
      existing.updatedAt = message.createdAt;
      conversations.value = [existing, ...conversations.value.filter((item) => item.id !== existing.id)];
      return;
    }

    conversations.value = [
      {
        id: message.conversationId,
        participants: [participant],
        lastMessage: message.message,
        updatedAt: message.createdAt
      },
      ...conversations.value
    ];
  };

  const attachSocketListeners = () => {
    const currentSocket = socket();

    if (!currentSocket) {
      return;
    }

    currentSocket.removeAllListeners();

    currentSocket.on("messages:new", (message: Message) => {
      const otherUserId =
        message.senderId === authStore.user?.id ? message.receiverId : message.senderId;
      messages.value[otherUserId] = [...(messages.value[otherUserId] ?? []), message];
      syncConversationPreview(message);
    });

    currentSocket.on("presence:updated", ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
      users.value = users.value.map((user) => (user.id === userId ? { ...user, isOnline } : user));
      conversations.value = conversations.value.map((conversation) => ({
        ...conversation,
        participants: conversation.participants.map((participant) =>
          participant.id === userId ? { ...participant, isOnline } : participant
        )
      }));
    });

    currentSocket.on("typing:start", ({ from }: { from: string }) => {
      typingUsers.value[from] = true;
    });

    currentSocket.on("typing:stop", ({ from }: { from: string }) => {
      typingUsers.value[from] = false;
    });

    currentSocket.on("call:incoming", (payload: IncomingCall) => {
      incomingCall.value = payload;
      callStatus.value = `${payload.caller.username} is calling`;
    });

    currentSocket.on(
      "call:accepted",
      async ({ from, answer, callType }: { from: string; answer: RTCSessionDescriptionInit; callType: CallType }) => {
        activeCallType.value = callType;
        callStatus.value = "Call connected";
        if (peerConnection.value && answer) {
          await peerConnection.value.setRemoteDescription(new RTCSessionDescription(answer));
        }
        activeCallUser.value = users.value.find((item) => item.id === from) ?? null;
        isDialing.value = false;
      }
    );

    currentSocket.on("call:rejected", () => {
      callStatus.value = "Call rejected";
      void endCall(false);
    });

    currentSocket.on("call:ice-candidate", async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      if (peerConnection.value && candidate) {
        await peerConnection.value.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    currentSocket.on("call:ended", () => {
      callStatus.value = "Call ended";
      void endCall(false);
    });
  };

  const loadUsers = async () => {
    const { data } = await api.get<{ users: User[] }>("/users", {
      params: search.value ? { search: search.value } : {}
    });
    users.value = data.users;
  };

  const loadConversations = async () => {
    const { data } = await api.get<{ conversations: Conversation[] }>("/conversations");
    conversations.value = data.conversations.map((conversation) => ({
      ...conversation,
      participants: conversation.participants.filter((participant) => participant.id !== authStore.user?.id)
    }));
  };

  const loadMessages = async (userId: string) => {
    const { data } = await api.get<{ conversationId: string | null; messages: Message[] }>(
      `/conversations/${userId}/messages`
    );
    messages.value[userId] = data.messages;
    selectedUserId.value = userId;
  };

  const initialize = async () => {
    await Promise.all([loadUsers(), loadConversations()]);
    attachSocketListeners();
  };

  const sendMessage = async (messageText: string) => {
    if (!selectedUserId.value || !messageText.trim()) {
      return;
    }

    socket()?.emit("messages:send", {
      receiverId: selectedUserId.value,
      message: messageText.trim()
    });
  };

  const emitTyping = (isTyping: boolean) => {
    if (!selectedUserId.value) {
      return;
    }

    socket()?.emit(isTyping ? "typing:start" : "typing:stop", {
      to: selectedUserId.value
    });
  };

  const createPeerConnection = (remoteUserId: string) => {
    const connection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    connection.onicecandidate = (event) => {
      if (event.candidate) {
        socket()?.emit("call:ice-candidate", {
          to: remoteUserId,
          candidate: event.candidate.toJSON()
        });
      }
    };

    connection.ontrack = (event) => {
      remoteStream.value = event.streams[0];
    };

    peerConnection.value = connection;
    return connection;
  };

  const prepareMedia = async (callType: CallType) => {
    localStream.value = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: callType === "video"
    });
    return localStream.value;
  };

  const startCall = async (user: User, callType: CallType) => {
    activeCallUser.value = user;
    activeCallType.value = callType;
    callStatus.value = "Calling...";
    isDialing.value = true;

    const stream = await prepareMedia(callType);
    const connection = createPeerConnection(user.id);
    stream.getTracks().forEach((track) => connection.addTrack(track, stream));

    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);

    socket()?.emit("call:request", {
      to: user.id,
      offer,
      callType
    });
  };

  const acceptCall = async () => {
    if (!incomingCall.value) {
      return;
    }

    activeCallUser.value = incomingCall.value.caller;
    activeCallType.value = incomingCall.value.callType;

    const stream = await prepareMedia(incomingCall.value.callType);
    const connection = createPeerConnection(incomingCall.value.from);
    stream.getTracks().forEach((track) => connection.addTrack(track, stream));

    await connection.setRemoteDescription(new RTCSessionDescription(incomingCall.value.offer));
    const answer = await connection.createAnswer();
    await connection.setLocalDescription(answer);

    socket()?.emit("call:accept", {
      to: incomingCall.value.from,
      answer,
      callType: incomingCall.value.callType
    });

    callStatus.value = "Call connected";
    incomingCall.value = null;
  };

  const rejectCall = () => {
    if (!incomingCall.value) {
      return;
    }

    socket()?.emit("call:reject", {
      to: incomingCall.value.from,
      callType: incomingCall.value.callType
    });
    incomingCall.value = null;
    callStatus.value = "Call rejected";
  };

  const endCall = async (notifyRemote = true) => {
    if (notifyRemote && activeCallUser.value) {
      socket()?.emit("call:end", {
        to: activeCallUser.value.id,
        callType: activeCallType.value
      });
    }

    peerConnection.value?.close();
    peerConnection.value = null;
    localStream.value?.getTracks().forEach((track) => track.stop());
    remoteStream.value?.getTracks().forEach((track) => track.stop());
    localStream.value = null;
    remoteStream.value = null;
    activeCallUser.value = null;
    activeCallType.value = null;
    isDialing.value = false;
    incomingCall.value = null;
  };

  return {
    users,
    conversations,
    messages,
    selectedUserId,
    selectedUser,
    search,
    typingUsers,
    incomingCall,
    activeCallUser,
    activeCallType,
    localStream,
    remoteStream,
    callStatus,
    initialize,
    loadUsers,
    loadMessages,
    sendMessage,
    emitTyping,
    startCall,
    acceptCall,
    rejectCall,
    endCall
  };
});
