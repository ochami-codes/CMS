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
import ChoirDashboard from "./pages/choir/ChoirDashboard";
import DeaconryDashboard from "./pages/deaconry/DeaconryDashboard";
import ClerkDashboard from "./pages/clerk/ClerkDashboard";
import SabbathSchoolDashboard from "./pages/s_school/SabbathSchoolDashboard";
import AloDashboard from "./pages/alo/AloDashboard";
import AmoDashboard from "./pages/amo/AmoDashboard";
// Setting
import ProfilePage from "./pages/settings/profiles/ProfilePage";
import ChangePassword from "./pages/settings/ChangePassword";
import MyRoleRequests from "./components/members/MyRoleRequests";

// Admin
import AdminDashboard from "./components/admin/AdminDashboard";
import ManageRoles from "./components/admin/ManageRoles";
const departmentRoutes = [
  { path: "youth", component: YouthDashboard, permission: "access_youth_dashboard" },
  { path: "children", component: ChildrenDashboard, permission: "access_children_dashboard" },
  { path: "choir", component: ChoirDashboard, permission: "access_choir_dashboard" },
  { path: "deaconry", component: DeaconryDashboard, permission: "access_deaconry_dashboard" },
  { path: "alo", component: AloDashboard, permission: "access_alo_dashboard" },
  { path: "amo", component: AmoDashboard, permission: "access_amo_dashboard" },
  { path: "s-school", component: SabbathSchoolDashboard, permission: "access_s_school_dashboard" },
  { path: "clerk", component: ClerkDashboard, permission: "access_clerk_dashboard" },
  { path: "treasury", component: TreasuryDashboard, permission: "access_treasury_dashboard" },
  { path: "pastor", component: PastorDashboard, permission: "access_pastor_dashboard" },
  { path: "communication", component: CommunicationDashboard, permission: "access_media_dashboard" },
];
function App() {
  const withPermission = (Component, permission) => (
    <RequirePermission permission={permission}>
      <Component />
    </RequirePermission>
  );

  return (
    <ToastProvider>
      <Router>
        <AuthProvider>
          <Toaster position="top-right" reverseOrder={false} />

          <Routes>
            {/* ========== PUBLIC ========== */}
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

            {/* ========== PROTECTED ========== */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                {/* Main */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/myrolerequest" element={<MyRoleRequests />} />

                {/* Departments (Dynamic) */}
                {departmentRoutes.map(({ path, component, permission }) => (
                  <Route
                    key={path}
                    path={`/dashboard/${path}`}
                    element={withPermission(component, permission)}
                  />
                ))}

                {/* Settings */}
                <Route path="/dashboard/profiles" element={<ProfilePage />} />
                <Route
                  path="/dashboard/settings/change-password"
                  element={<ChangePassword />}
                />

                {/* Admin */}
                <Route
                  path="/dashboard/admin"
                  element={withPermission(
                    AdminDashboard,
                    "access_admin_dashboard"
                  )}
                />
                <Route
                  path="/manage-roles"
                  element={withPermission(
                    ManageRoles,
                    "access_admin_dashboard"
                  )}
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
