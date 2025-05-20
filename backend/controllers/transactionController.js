const Transaction = require("../models/Transaction");
const { getIO } = require("../socket/socketHandler");

// 添加交易记录
const addTransaction = async (req, res) => {
  try {
    const { ledgerId } = req.params;
    const { amount, currency, payer, participants, note } = req.body;

    if (!amount || !currency || !payer || !participants || payer.length === 0 || participants.length === 0) {
      return res.status(400).json({ error: "缺少必要字段" });
    }

    const newTransaction = await Transaction.create({
      ledgerId,
      amount,
      currency,
      payer,
      participants,
      note
    });

    // ✅ 广播新交易添加事件
    getIO().to(ledgerId).emit("transaction-added", newTransaction);

    res.status(201).json(newTransaction);
  } catch (err) {
    console.error("添加交易失败", err);
    res.status(500).json({ error: "服务器错误" });
  }
};

// 获取交易记录
const getTransactions = async (req, res) => {
  try {
    const { ledgerId } = req.params;
    const transactions = await Transaction.find({ ledgerId }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    console.error("获取交易失败", err);
    res.status(500).json({ error: "服务器错误" });
  }
};

// 删除交易记录
const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const deleted = await Transaction.findByIdAndDelete(transactionId);
    if (!deleted) return res.status(404).json({ error: "交易不存在" });

    // ✅ 广播交易删除事件
    getIO().to(deleted.ledgerId).emit("transaction-deleted", { transactionId });

    res.json({ message: "交易已删除" });
  } catch (err) {
    console.error("删除交易失败", err);
    res.status(500).json({ error: "服务器错误" });
  }
};

// 修改交易记录
const updateTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const updated = await Transaction.findByIdAndUpdate(transactionId, req.body, {
      new: true, // 返回更新后的对象
      runValidators: true // 启用 Schema 验证
    });

    if (!updated) {
      return res.status(404).json({ error: "交易记录不存在" });
    }

    // ✅ 广播更新（可选）
    getIO().to(updated.ledgerId).emit("transaction-updated", updated);

    res.json(updated);
  } catch (err) {
    console.error("更新交易失败", err);
    res.status(500).json({ error: "服务器错误" });
  }
};
module.exports = { addTransaction, getTransactions, deleteTransaction, updateTransaction };
