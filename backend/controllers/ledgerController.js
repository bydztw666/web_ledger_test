const Ledger = require("../models/Ledger");
const { nanoid } = require("nanoid");

// 创建账本
const createLedger = async (req, res) => {
  try {
    const { name, currencies } = req.body;
    if (!name) return res.status(400).json({ error: "账本名称不能为空" });

    const newLedger = await Ledger.create({
      name,
      currencies: currencies || ["JPY"],
      ledgerId: nanoid(8)
    });
    res.status(201).json(newLedger);
  } catch (err) {
    console.error("创建账本失败", err);
    res.status(500).json({ error: "服务器错误" });
  }
};

// 获取账本
const getLedger = async (req, res) => {
  try {
    const { ledgerId } = req.params;
    const ledger = await Ledger.findOne({ ledgerId });
    if (!ledger) return res.status(404).json({ error: "账本未找到" });
    res.json(ledger);
  } catch (err) {
    console.error("获取账本失败", err);
    res.status(500).json({ error: "服务器错误" });
  }
};

module.exports = { createLedger, getLedger };
