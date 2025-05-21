// frontend/src/api/settlement.js
import axios from "axios";

const API_BASE = "http://localhost:4000/api";

export async function getSettlement(ledgerId, currency = "JPY") {
  const res = await axios.get(`${API_BASE}/ledgers/${ledgerId}/settlement`, {
    params: { currency }
  });
  return res.data;
}