import { useEffect, useState } from "react";
import socket from "../socket";
import { useParams } from "react-router-dom";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
} from "../api/transaction";
import { getMembers } from "../api/member";

function TransactionTable() {
  const { ledgerId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    payer: "",
    amount: "",
    participants: "",
    currency: "JPY"
  });

  useEffect(() => {
    if (!ledgerId) return;
    getTransactions(ledgerId).then(setTransactions).catch(console.error);
  }, [ledgerId]);

  useEffect(() => {
    if (!ledgerId) return;
    getMembers(ledgerId).then(setMembers).catch(console.error);
  }, [ledgerId]);

  const handleChange = (e) => {
    const { name, value, options, type } = e.target;
    if (name === "participants" && type === "select-multiple") {
      const selected = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setForm({ ...form, [name]: selected });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAdd = async () => {
    const { payer, amount, participants, currency } = form;
    if (!payer || !amount || !participants || !currency) return;

    try {
      await addTransaction(ledgerId, {
        payer,
        amount: parseFloat(amount),
        participants: Array.isArray(participants) ? participants : [participants],
        currency,
      });
      const updated = await getTransactions(ledgerId);
      setTransactions(updated);
      // Debug log before emitting events
      console.log("📤 emitting local-add");
      socket.emit("transaction-sync");
      socket.emit("local-add");
      setForm({ payer: "", amount: "", participants: "", currency: "" });
    } catch (err) {
      alert("Failed to add transaction");
    }
  };

  const handleDelete = async (id) => {
    const targetTx = transactions.find(tx => tx._id === id);
    if (!targetTx) return;

    const involvedName = targetTx.payer;

    // 检查是否存在该成员在其他交易中作为payer或参与者
    const stillOwing = transactions.some(tx =>
      tx._id !== id && (tx.payer === involvedName || (Array.isArray(tx.participants) && tx.participants.includes(involvedName)))
    );

    if (stillOwing) {
      alert("This member still has unsettled transactions and cannot be deleted.");
      return;
    }

    try {
      await deleteTransaction(ledgerId, id);
      const updated = await getTransactions(ledgerId);
      setTransactions(updated);
      console.log("📤 emitting local-add");
      socket.emit("transaction-sync");
      socket.emit("local-add");
    } catch (err) {
      alert("Failed to delete transaction");
    }
  };

  const handleMemberDelete = async (name) => {
    try {
      const res = await fetch(`http://localhost:4000/api/ledgers/${ledgerId}/members/${name}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete member");
      const updated = await getMembers(ledgerId);
      setMembers(updated);
    } catch (err) {
      alert("Failed to delete member.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <select
          name="payer"
          value={form.payer}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Select Payer</option>
          {members.map((m) => (
            <option key={m._id} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>

        <input
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="border p-2 rounded"
        />

        <div className="col-span-3 flex flex-wrap gap-2">
          {members.map((m) => (
            <label key={m._id} className="inline-flex items-center gap-1">
              <input
                type="checkbox"
                value={m.name}
                checked={Array.isArray(form.participants) && form.participants.includes(m.name)}
                onChange={(e) => {
                  const selected = Array.isArray(form.participants) && form.participants.includes(m.name)
                    ? form.participants.filter(p => p !== m.name)
                    : [...(Array.isArray(form.participants) ? form.participants : []), m.name];
                  setForm({ ...form, participants: selected });
                }}
              />
              {m.name}
            </label>
          ))}
          <button
            onClick={async () => {
              try {
                const updated = await getMembers(ledgerId);
                setMembers(updated);
              } catch (err) {
                alert("Failed to refresh members");
              }
            }}
            className="text-sm text-blue-500 underline ml-2"
          >
            🔄 Refresh Members
          </button>
        </div>

        <select
          name="currency"
          value={form.currency}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="JPY">JPY</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>
      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Transaction
      </button>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Payer</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Participants</th>
            <th className="p-2 border">currency</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id} className="text-center">
              <td className="p-2 border">{tx.payer}</td>
              <td className="p-2 border">{tx.amount}</td>
              <td className="p-2 border">{tx.participants.join(", ")}</td>
              <td className="p-2 border">{tx.currency}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleDelete(tx._id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default TransactionTable;