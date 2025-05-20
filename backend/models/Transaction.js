const mongoose = require("mongoose");
const TransactionSchema = new mongoose.Schema({
    ledgerId: { type: String, required: true }, // 所属账本 ID
    amount: { type: Number, required: true }, // 金额
    currency: { type: String, required: true }, // 币种
    payer: { type: [String], required: true }, // 支付人名字数组（支持多人）
    participants: { type: [String], required: true }, // 平摊人名字数组
    note: { type: String }, // 备注说明
    createdAt: { type: Date, default: Date.now }, // 创建时间
  });
  
  module.exports = mongoose.model("Transaction", TransactionSchema); // 导出 Transaction 模型
  