import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import AdminUsers from "./AdminUsers";
import { getUserFromStorage } from "../utils/auth";

export default function DashboardWrapper() {
  const user = getUserFromStorage();

  return (
    <div>
      <div className="mb-3">
        {user.role === "admin" ? (
          <>
            <Link className="me-3" to="/dashboard/admin">Admin Dashboard</Link>
            <Link className="me-3" to="/admin/users">Manage Users</Link>
            <Link className="me-3" to="/plans">Plans</Link>
            <Link className="me-3" to="/billing">Billing</Link>
            <Link className="me-3" to="/notifications">Notifications</Link>
          </>
        ) : (
          <>
            <Link className="me-3" to="/dashboard/user">My Dashboard</Link>
            <Link className="me-3" to="/profile">Profile</Link>
            <Link className="me-3" to="/plans">Plans</Link>
            <Link className="me-3" to="/billing">Billing</Link>
          </>
        )}
      </div>

      <div>
        <Routes>
          <Route path="user" element={<UserDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route index element={user.role === "admin" ? <AdminDashboard /> : <UserDashboard />} />
        </Routes>
      </div>
    </div>
  );
}
