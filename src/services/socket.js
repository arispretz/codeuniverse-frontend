/**
 * @fileoverview Socket.IO client with reconnection, token refresh, and heartbeat.
 */

import { io } from "socket.io-client";
import { getUserToken } from "../utils/userToken.js";

const SOCKET_URL = import.meta.env.VITE_BACKEND_WS_HOST;

export async function initSocket() {
  const token = await getUserToken();
  if (!token) {
    console.warn("⚠️ No token available, connection aborted");
    return null;
  }

  const socket = io(SOCKET_URL, {
    path: "/socket.io",
    transports: ["polling"], 
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  socket.on("connect", () => {
    console.log("✅ Connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.warn("⚠️ Disconnected:", reason);
  });

  socket.on("connect_error", async (err) => {
    console.error("❌ Connection error:", err.message);
    if (err.message.includes("Unauthorized")) {
      console.warn("🚫 Token expired, refreshing...");
      try {
        const newToken = await getUserToken(true);
        socket.auth = { token: newToken };
        socket.connect();
      } catch (refreshErr) {
        console.error("❌ Failed to refresh token:", refreshErr.message);
      }
    }
  });

  socket.on("connected", (payload) => {
    console.log("📡 Server says:", payload.message);
  });

  socket.on("heartbeat_ack", (payload) => {
    console.log("💓 Server ack:", new Date(payload.ts).toISOString());
  });

  // Heartbeat every 25s
  setInterval(() => {
    if (socket.connected) {
      socket.emit("heartbeat", { ts: Date.now() });
      console.log("💓 Heartbeat sent");
    }
  }, 25000);

  return socket;
}
