import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import TradeDetailPage from "./pages/TradeDetailPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/trades/:id" element={<TradeDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
