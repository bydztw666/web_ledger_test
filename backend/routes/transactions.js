const express = require("express");
const router = express.Router();
const {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} = require("../controllers/transactionController");

// 添加交易记录
router.post("/ledgers/:ledgerId/transactions", addTransaction);

// 获取账本的所有交易记录
router.get("/ledgers/:ledgerId/transactions", getTransactions);

// 删除交易记录
router.delete("/ledgers/:transactionId", deleteTransaction);

//修改交易记录
router.patch("/ledgers/:transactionId", updateTransaction);

module.exports = router;