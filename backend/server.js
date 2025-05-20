const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const { initSocket } = require("./socket/socketHandler");
require("dotenv").config();

const PORT = process.env.PORT || 4000;
const server = http.createServer(app); // 用于绑定 socket.io

// 初始化 WebSocket
initSocket(server);

// 连接 MongoDB 并启动服务
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB 连接成功");
    server.listen(PORT, () => {
      console.log(`🚀 后端运行在 http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB 连接失败", err);
  });
