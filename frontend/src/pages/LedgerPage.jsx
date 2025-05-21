
import socket from "../socket";
import MemberList from "../components/MemberList";
import TransactionTable from "../components/TransactionTable";
import SettlementDisplay from "../components/SettlementDisplay";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function LedgerPage() {
  const { ledgerId } = useParams();

  useEffect(() => {
    if (ledgerId) {
      socket.emit("joinLedger", ledgerId);
    }
  }, [ledgerId]);

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Ledger</h1>

      {/* 成员列表区域 */}
      <section className="bg-gray-50 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Members</h2>
        <MemberList />
      </section>

      {/* 交易记录区域 */}
      <section className="bg-gray-50 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Transactions</h2>
        <TransactionTable />
      </section>

      {/* 结算结果区域 */}
      <section className="bg-gray-50 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Settlement</h2>
        <SettlementDisplay />
      </section>
    </div>
  );
}




export default LedgerPage;
