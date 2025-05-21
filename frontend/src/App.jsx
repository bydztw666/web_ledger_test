import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LedgerPage from "./pages/LedgerPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ledger/:ledgerId" element={<LedgerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
