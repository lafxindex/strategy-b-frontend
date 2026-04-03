import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import TradeDetailPage from "./pages/TradeDetailPage";
import LoginPage from "./pages/LoginPage";
import PublicTraderPage from "./pages/PublicTraderPage";
import TraderDirectoryPage from "./pages/TraderDirectoryPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TraderDirectoryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/trader/:slug" element={<PublicTraderPage />} />
        <Route path="/trades/:id" element={<TradeDetailPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <ProfileSettingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
