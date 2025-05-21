import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSettlement } from "../api/settlement";
import socket from "../socket";

function SettlementDisplay() {
  const { ledgerId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshSettlement = () => {
    if (!ledgerId) return;
    setLoading(true);
    getSettlement(ledgerId, "JPY")
      .then((data) => {
        console.log("📬 手动刷新结算成功：", data);
        setResults(data);
      })
      .catch((err) => {
        console.error("❌ 手动刷新结算失败：", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!ledgerId) return;
    refreshSettlement();
  }, [ledgerId]);

  useEffect(() => {
    if (!ledgerId) return;

    const handleUpdate = () => {
      console.log("📡 收到 transaction-sync 或 local-add，刷新结算 ledgerId:", ledgerId);
      getSettlement(ledgerId, "JPY")
        .then((data) => {
          console.log("📬 结算获取成功：", data);
          setResults(data);
        })
        .catch((err) => {
          console.error("❌ 获取结算失败：", err);
        });
    };

    socket.on("transaction-sync", handleUpdate);
    socket.on("local-add", handleUpdate);

    socket.onAny((eventName, ...args) => {
      console.log("📥 收到任意事件:", eventName, args);
    });

    return () => {
      socket.off("transaction-sync", handleUpdate);
      socket.off("local-add", handleUpdate);
      socket.offAny();
    };
  }, [ledgerId]);

  return (
    <div className="space-y-2">
      <button
        onClick={refreshSettlement}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "loading..." : "resattle"}
      </button>
      {results.length === 0 ? (
        <p className="text-gray-500">No settlement yet.</p>
      ) : (
        <ul className="space-y-1">
          {results.map((r, idx) => (
            <li key={idx} className="border p-2 rounded">
              {r.from} to {r.to} <strong>{r.amount} JPY</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SettlementDisplay;
