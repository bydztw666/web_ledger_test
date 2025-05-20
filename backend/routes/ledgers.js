const express = require("express");
const router = express.Router();
const { createLedger, getLedger } = require("../controllers/ledgerController");

// 根路由：返回提示用户选择创建或输入 ledgerId
router.get("/", (req, res) => {
  res.send("欢迎使用团体记账系统！请选择创建新账本或输入已有账本 ID 进入。\n\nPOST /api/ledgers 创建新账本\nGET /api/ledgers/:ledgerId 访问已有账本");
});

// 创建账本
router.post("/", createLedger);

// 获取账本页面（如果直接进入 /:ledgerId）
router.get("/:ledgerId", getLedger);

module.exports = router;