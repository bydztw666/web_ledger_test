const Member = require("../models/Member");
const Transaction = require("../models/Transaction");
const { calculateSettlement } = require("../utils/settlementCalculator");

// 获取结算结果
const getSettlement = async (req, res) => {
  try {
    const { ledgerId } = req.params;
    const { currency } = req.query; // 通过查询参数指定币种，如 ?currency=JPY

    if (!currency) return res.status(400).json({ error: "缺少币种参数" });

    const members = await Member.find({ ledgerId });
    const transactions = await Transaction.find({ ledgerId });

    const result = calculateSettlement(members, transactions, currency);
    res.json(result);
  } catch (err) {
    console.error("结算失败", err);
    res.status(500).json({ error: "服务器错误" });
  }
};

module.exports = { getSettlement };
