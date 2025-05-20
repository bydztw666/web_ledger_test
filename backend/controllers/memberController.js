const Member = require("../models/Member");
const { getIO } = require("../socket/socketHandler");


// 添加成员
const addMember = async (req, res) => {
  try {
    const { ledgerId } = req.params;
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: "成员名不能为空" });

    const newMember = await Member.create({ name, ledgerId });

    // ✅ 广播新成员添加事件
    getIO().to(ledgerId).emit("member-added", newMember);

    res.status(201).json(newMember);
  } catch (err) {
    console.error("添加成员失败", err);
    res.status(500).json({ error: "服务器错误" });
  }
};

// 获取账本的所有成员
const getMembers = async (req, res) => {
  try {
    const { ledgerId } = req.params;
    const members = await Member.find({ ledgerId });
    res.json(members);
  } catch (err) {
    console.error("获取成员失败", err);
    res.status(500).json({ error: "服务器错误" });
  }
};

// 删除成员
const deleteMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const deleted = await Member.findByIdAndDelete(memberId);
    if (!deleted) return res.status(404).json({ error: "成员不存在" });

   // ✅ 广播成员删除事件
   getIO().to(deleted.ledgerId).emit("member-deleted", { memberId });

    res.json({ message: "成员已删除" });
  } catch (err) {
    console.error("删除成员失败", err);
    res.status(500).json({ error: "服务器错误" });
  }
};

module.exports = { addMember, getMembers, deleteMember };
