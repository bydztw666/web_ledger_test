const mongoose = require("mongoose"); // 引入 mongoose 模块

const LedgerSchema = new mongoose.Schema({
    ledgerId: { type: String, required: true, unique: true }, // 唯一账本 ID，用于 URL 访问
    name: { type: String, required: true }, // 账本名称
    currencies: { type: [String], default: ["JPY"] }, // 支持的币种数组，默认为日元
    createdAt: { type: Date, default: Date.now }, // 创建时间
    updatedAt: { type: Date, default: Date.now }, // 更新时间
  });
  
  module.exports = mongoose.model("Ledger", LedgerSchema); // 导出 Ledger 模型