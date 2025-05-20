let ioInstance = null;

function initSocket(server) {
  const { Server } = require("socket.io");
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("🧠 新客户端连接：", socket.id);

    socket.on("join-ledger", (ledgerId) => {
      socket.join(ledgerId);
      console.log(`📦 客户端 ${socket.id} 加入账本房间 ${ledgerId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ 客户端断开：", socket.id);
    });
  });
}

function getIO() {
  if (!ioInstance) {
    throw new Error("Socket.io 尚未初始化");
  }
  return ioInstance;
}

module.exports = { initSocket, getIO };
