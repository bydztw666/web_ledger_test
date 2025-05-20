const express = require("express");
const router = express.Router();
const { getSettlement } = require("../controllers/settlementController");

// 获取结算结果
router.get("/ledgers/:ledgerId/settlement", getSettlement);

module.exports = router;
