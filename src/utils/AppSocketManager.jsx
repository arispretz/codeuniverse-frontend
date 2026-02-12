/**
 * @fileoverview React component that manages the lifecycle of the Socket.IO connection.
 */

import React, { useEffect } from "react";
import { initSocket } from "../services/socket.js";

function AppSocketManager() {
  useEffect(() => {
    let socketInstance;

    initSocket().then((socket) => {
      if (socket) {
        socketInstance = socket;

        socket.on("connect", () => console.log("✅ Socket.IO connected"));
        socket.on("disconnect", () => console.log("⚡ Socket.IO disconnected"));
      }
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        console.log("🛑 Socket.IO disconnected on cleanup");
      }
    };
  }, []);

  return null; 
}

export default AppSocketManager;
