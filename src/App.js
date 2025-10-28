import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TopNav from "./components/TopNav";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import DashboardWrapper from "./components/DashboardWrapper";
import UserProfile from "./components/UserProfile";
import AdminUsers from "./components/AdminUsers";
import Plans from "./components/Plans";
import Billing from "./components/Billing";
import Notifications from "./components/Notifications";
import { getUserFromStorage } from "./utils/auth";

function RequireAuth({ children }) {
  const user = getUserFromStorage();
  if (!user || !user.email) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <TopNav />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard/*"
            element={
              <RequireAuth>
                <DashboardWrapper />
              </RequireAuth>
            }
          />

          <Route path="/profile" element={<RequireAuth><UserProfile /></RequireAuth>} />
          <Route path="/admin/users" element={<RequireAuth><AdminUsers /></RequireAuth>} />
          <Route path="/plans" element={<RequireAuth><Plans /></RequireAuth>} />
          <Route path="/billing" element={<RequireAuth><Billing /></RequireAuth>} />
          <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
