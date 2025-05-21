// src/socket/index.js
import { io } from "socket.io-client";

// 若 window.socket 已存在则复用，否则新建
const socket = window.socket || io("http://localhost:4000", {
  transports: ["websocket"],
  autoConnect: true,
});

window.socket = socket; // 绑定到 window，确保所有组件共享同一实例

console.log("🌐 socket connecting...");
socket.on("connect", () => console.log("✅ socket connected!"));

export default socket;