export type User = {
  id: string;
  email: string;
  username: string;
  isOnline: boolean;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  readAt: string | null;
};

export type Conversation = {
  id: string;
  participants: User[];
  lastMessage: string;
  updatedAt: string;
};

export type IncomingCall = {
  from: string;
  caller: User;
  offer: RTCSessionDescriptionInit;
  callType: "voice" | "video";
};
