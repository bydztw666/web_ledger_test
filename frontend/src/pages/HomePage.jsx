import { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 

function HomePage() {
  const navigate = useNavigate(); 
  const [joinId, setJoinId] = useState(""); 

  const handleCreateLedger = async () => {
   
    try {
      const res = await axios.post("http://localhost:4000/api/ledgers", {
        name: "New Ledger", 
        currencies: ["JPY"], 
      });
      const newId = res.data.ledgerId; 
      navigate(`/ledger/${newId}`); 
    } catch (err) {
      alert("Failed to create ledger"); 
    }
  };

  const handleJoinLedger = () => {
   
    if (joinId.trim() !== "") {
      navigate(`/ledger/${joinId}`); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center space-y-6 p-4">
      {/* 页面整体容器，垂直居中 */}
      <h1 className="text-3xl font-bold">web-Ledger</h1>

      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        onClick={handleCreateLedger}
      >
        Create New Ledger
      </button>

      <div className="flex flex-col items-center space-y-2">
        <input
          type="text"
          placeholder="Enter Ledger ID"
          value={joinId}
          onChange={(e) => setJoinId(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleJoinLedger}
        >
          Join Ledger
        </button>
      </div>
    </div>
  );
}

export default HomePage; // 导出该组件，供 App.jsx 使用
