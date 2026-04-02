import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import TradeDetailPage from "./pages/TradeDetailPage";
import LoginPage from "./pages/LoginPage";
import PublicTraderPage from "./pages/PublicTraderPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/trades/:id" element={<TradeDetailPage />} />
        <Route path="/trader/:slug" element={<PublicTraderPage />} />
      </Routes>
    </Router>
  );
}

export default App;
