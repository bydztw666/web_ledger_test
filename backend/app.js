const express = require("express");
const cors = require("cors");

const ledgerRoutes = require("./routes/ledgers");
const memberRoutes = require("./routes/members");
const transactionRoutes = require("./routes/transactions");
const settlementRoutes = require("./routes/settlement");

const app = express();

// ✅ 通用中间件
app.use(cors());
app.use(express.json());

// ✅ 路由挂载
app.use("/api/ledgers", ledgerRoutes);       // 创建 & 获取账本
app.use("/api", memberRoutes);                // 添加/获取/删除成员
app.use("/api", transactionRoutes);           // 添加/获取/删除交易记录
app.use("/api", settlementRoutes);            // 获取结算结果

// ✅ 根路径欢迎页
app.get("/", (req, res) => {
  res.send("✅ 服务器已启动！欢迎使用 group-splitter API！");
});

module.exports = app;
