// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/ToastProvider";
// Layouts
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Auth
import ProtectedRoute from "./auth/ProtectedRoute";
import RequirePermission from "./components/RequirePermission";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ResetPassword from "./auth/ResetPassword";
import ResetPasswordConfirm from "./auth/ResetPasswordConfirm";
import Callback from "./auth/Callback";
import ChangePasswordSuccess from "./auth/ChangePasswordSuccess";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import YouthDashboard from "./pages/youth/YouthDashboard";
import ChildrenDashboard from "./pages/children/ChildrenDashboard";
import TreasuryDashboard from "./pages/treasury/TreasuryDashboard";
import PastorDashboard from "./pages/pastor/PastorDashboard";
import CommunicationDashboard from "./pages/communication/CommunicationDashboard";

// Settings
import ProfilePage from "./pages/settings/profiles/ProfilePage";
import ChangePassword from "./pages/settings/ChangePassword";
import MyRoleRequests from "./components/members/MyRoleRequests";

// Admin
import AdminDashboard from "./components/admin/AdminDashboard";
import InviteUser from "./auth/InviteUser";
import ManageRoles from "./components/admin/ManageRoles";

// Toaster
import { Toaster } from "react-hot-toast";

function App() {
  return (
<ToastProvider>
<Router>
<AuthProvider>
  <Router>
    <Routes>

      {/* ================= PUBLIC ================= */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/reset-password-confirm" element={<ResetPasswordConfirm />} />
        <Route path="/auth/callback" element={<Callback />} />
        <Route path="/profile/change-password-success" element={<ChangePasswordSuccess />} />
      </Route>

      {/* ================= PROTECTED ================= */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>

          {/* Main */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/myrolerequest" element={<MyRoleRequests />} />

          {/* Departments */}
          <Route
            path="/dashboard/youth"
            element={
              <RequirePermission permission="manage_youth">
                <YouthDashboard />
              </RequirePermission>
            }
          />

          <Route
            path="/dashboard/children"
            element={
              <RequirePermission permission="manage_children">
                <ChildrenDashboard />
              </RequirePermission>
            }
          />

          <Route
            path="/dashboard/treasury"
            element={
              <RequirePermission permission="view_finances">
                <TreasuryDashboard />
              </RequirePermission>
            }
          />

          <Route
            path="/dashboard/pastor"
            element={
              <RequirePermission permission="manage_departments">
                <PastorDashboard />
              </RequirePermission>
            }
          />

          <Route
            path="/dashboard/communication"
            element={
              <RequirePermission permission="manage_announcements">
                <CommunicationDashboard />
              </RequirePermission>
            }
          />

          {/* Settings */}
          <Route path="/dashboard/profiles" element={<ProfilePage />} />
          <Route path="/dashboard/settings/change-password" element={<ChangePassword />} />

          {/* ================= ADMIN ================= */}
          <Route
            path="/dashboard/admin"
            element={
              <RequirePermission role="Admin">
                <AdminDashboard />
              </RequirePermission>
            }
          />

          <Route
            path="/invite-user"
            element={
              <RequirePermission role="Admin">
                <InviteUser />
              </RequirePermission>
            }
          />

          <Route
            path="/manage-roles"
            element={
              <RequirePermission role="Admin">
                <ManageRoles />
              </RequirePermission>
            }
          />

        </Route>
      </Route>

    </Routes>
  </Router>
</AuthProvider>
</Router>
</ToastProvider>
  );
}

export default App;
