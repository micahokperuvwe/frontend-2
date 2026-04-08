import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(
    import.meta.env.VITE_SOCKET_URL || "https://backend-2-ewjs.onrender.com",
    {
    auth: { token },
    transports: ["websocket"]
    }
  );

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
