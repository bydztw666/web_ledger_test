import socket from "../socket";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMembers, addMember, deleteMember } from "../api/member";

function MemberList() {
  const { ledgerId } = useParams();
  const [members, setMembers] = useState([]);
  const [inputName, setInputName] = useState("");

  useEffect(() => {
    if (!ledgerId) return;
    socket.on("membersUpdated", () => {
      getMembers(ledgerId).then(setMembers).catch(console.error);
    });
    return () => socket.off("membersUpdated");
  }, [ledgerId]);

  useEffect(() => {
    if (!ledgerId) return;
    getMembers(ledgerId).then(setMembers).catch(console.error);
  }, [ledgerId]);

  const handleAdd = async () => {
    if (inputName.trim() === "") return;
    try {
      await addMember(ledgerId, inputName.trim());
      const updated = await getMembers(ledgerId);
      setMembers(updated);
      setInputName("");
    } catch (err) {
      alert("Failed to add member");
    }
  };

  const handleDelete = async (id) => {
    try {
      // 获取成员名
      const member = members.find((m) => m._id === id);
      if (!member) return;

      // 获取所有交易
      const res = await fetch(`http://localhost:4000/api/ledgers/${ledgerId}/transactions`);
      const transactions = await res.json();

      const involved = transactions.some(
        (tx) =>
          tx.payer === member.name ||
          (Array.isArray(tx.participants) && tx.participants.includes(member.name))
      );

      if (involved) {
        alert(`${member.name} is involved in a transaction and cannot be deleted.`);
        return;
      }

      await deleteMember(ledgerId, id);
      setMembers(members.filter((m) => m._id !== id));
    } catch (err) {
      alert("Failed to delete member");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Enter member name"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {members.map((member) => (
          <li
            key={member._id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span>{member.name}</span>
            <button
              onClick={() => handleDelete(member._id)}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MemberList;