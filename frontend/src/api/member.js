import axios from "axios";

const API_BASE = "http://localhost:4000/api";

// 获取成员列表
export async function getMembers(ledgerId) {
  const res = await axios.get(`${API_BASE}/ledgers/${ledgerId}/members`);
  return res.data; // 应该返回成员数组
}

// 添加成员
export async function addMember(ledgerId, name) {
  const res = await axios.post(`${API_BASE}/ledgers/${ledgerId}/members`, {
    name,
  });
  return res.data; // 成功信息或新增成员对象
}

// 删除成员
export async function deleteMember(ledgerId, memberId) {
  const res = await axios.delete(`${API_BASE}/ledgers/${ledgerId}/members/${memberId}`);
  return res.data; // 成功信息
}
