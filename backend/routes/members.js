const express = require("express");
const router = express.Router();
const {
  addMember,
  getMembers,
  deleteMember
} = require("../controllers/memberController");

// 添加成员
router.post("/ledgers/:ledgerId/members", addMember);

// 获取账本中的所有成员
router.get("/ledgers/:ledgerId/members", getMembers);

// 删除某个成员
router.delete("/ledgers/:ledgerId/members/:memberId", deleteMember);

module.exports = router;