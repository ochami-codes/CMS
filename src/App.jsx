// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/ToastProvider";
import { Toaster } from "react-hot-toast";

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

// Setting
import ProfilePage from "./pages/settings/profiles/ProfilePage";
import ChangePassword from "./pages/settings/ChangePassword";
import MyRoleRequests from "./components/members/MyRoleRequests";

// Admin
import AdminDashboard from "./components/admin/AdminDashboard";
import ManageRoles from "./components/admin/ManageRoles";

function App() {
  return (
    <ToastProvider>
      <Router>
        <AuthProvider>
          <Toaster position="top-right" reverseOrder={false} />

          <Routes>
            {/* ============== PUBLIC ============== */}
            <Route element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/auth/reset-password-confirm"
                element={<ResetPasswordConfirm />}
              />
              <Route path="/auth/callback" element={<Callback />} />
              <Route
                path="/profile/change-password-success"
                element={<ChangePasswordSuccess />}
              />
            </Route>

            {/* ============== PROTECTED ============== */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                {/* Main */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/myrolerequest" element={<MyRoleRequests />} />

                {/* Departments */}
                <Route
                  path="/dashboard/youth"
                  element={
                    <RequirePermission permission="access_youth_dashboard">
                      <YouthDashboard />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/dashboard/children"
                  element={
                    <RequirePermission permission="access_children_dashboard">
                      <ChildrenDashboard />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/dashboard/treasury"
                  element={
                    <RequirePermission permission="access_treasury_dashboard">
                      <TreasuryDashboard />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/dashboard/pastor"
                  element={
                    <RequirePermission permission="access_pastor_dashboard">
                      <PastorDashboard />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/dashboard/communication"
                  element={
                    <RequirePermission permission="access_media_dashboard">
                      <CommunicationDashboard />
                    </RequirePermission>
                  }
                />

                {/* Settings */}
                <Route path="/dashboard/profiles" element={<ProfilePage />} />
                <Route
                  path="/dashboard/settings/change-password"
                  element={<ChangePassword />}
                />

                {/* Admin */}
                <Route
                  path="/dashboard/admin"
                  element={
                    <RequirePermission permission="access_admin_dashboard">
                      <AdminDashboard />
                    </RequirePermission>
                  }
                />

                <Route
                  path="/manage-roles"
                  element={
                    <RequirePermission permission="access_admin_dashboard">
                      <ManageRoles />
                    </RequirePermission>
                  }
                />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ToastProvider>
  );
}

export default App;
