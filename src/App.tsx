import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAppStore } from "@/store";
import { useEffect } from "react";
import Login from "@/pages/Login";
import EmployeeLayout from "@/components/EmployeeLayout";
import AdminLayout from "@/components/AdminLayout";
import EmployeeHome from "@/pages/employee/Home";
import EmployeeOrders from "@/pages/employee/Orders";
import EmployeeBalance from "@/pages/employee/Balance";
import EmployeeProfile from "@/pages/employee/Profile";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminOrders from "@/pages/admin/Orders";
import AdminMenus from "@/pages/admin/Menus";
import AdminDishes from "@/pages/admin/Dishes";
import AdminReports from "@/pages/admin/Reports";
import AdminSubsidy from "@/pages/admin/Subsidy";
import AdminUsers from "@/pages/admin/Users";
import AdminDepartments from "@/pages/admin/Departments";
import AdminSettings from "@/pages/admin/Settings";

function RequireAuth({ children, requireAdmin = false }: { children: JSX.Element; requireAdmin?: boolean }) {
  const currentUser = useAppStore((s) => s.currentUser);
  const viewMode = useAppStore((s) => s.viewMode);
  const location = useLocation();
  const switchViewMode = useAppStore((s) => s.switchViewMode);

  useEffect(() => {
    if (currentUser && requireAdmin && viewMode === "employee") {
      switchViewMode("admin");
    }
    if (currentUser && !requireAdmin && viewMode === "admin" && currentUser.role === "employee") {
      switchViewMode("employee");
    }
  }, [currentUser, requireAdmin, viewMode, switchViewMode]);

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireAdmin && currentUser.role === "employee") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <EmployeeLayout />
            </RequireAuth>
          }
        >
          <Route index element={<EmployeeHome />} />
          <Route path="orders" element={<EmployeeOrders />} />
          <Route path="balance" element={<EmployeeBalance />} />
          <Route path="profile" element={<EmployeeProfile />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RequireAuth requireAdmin>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="menus" element={<AdminMenus />} />
          <Route path="dishes" element={<AdminDishes />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="subsidy" element={<AdminSubsidy />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
