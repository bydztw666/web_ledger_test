const mongoose = require("mongoose");
const MemberSchema = new mongoose.Schema({
    ledgerId: { type: String, required: true }, // 所属账本 ID
    name: { type: String, required: true }, // 成员名称
    createdAt: { type: Date, default: Date.now }, // 创建时间
  });
  
  module.exports = mongoose.model("Member", MemberSchema); // 导出 Member 模型
  