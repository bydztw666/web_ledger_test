import axios from "axios";

const API_BASE = "http://localhost:4000/api";

// 获取交易列表
export async function getTransactions(ledgerId) {
  const res = await axios.get(`${API_BASE}/ledgers/${ledgerId}/transactions`);
  return res.data; // 返回交易数组
}

// 添加交易
export async function addTransaction(ledgerId, transaction) {
  const res = await axios.post(`${API_BASE}/ledgers/${ledgerId}/transactions`, transaction);
  return res.data; // 返回新增交易或确认信息
}

// 删除交易
export async function deleteTransaction(ledgerId, transactionId) {
  const res = await axios.delete(`${API_BASE}/ledgers/${ledgerId}/transactions/${transactionId}`);
  return res.data; // 返回确认信息
}
