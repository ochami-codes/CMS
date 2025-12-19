import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Auth
import ProtectedRoute from "./auth/ProtectedRoute";
import AuthCallback from "./auth/AuthCallback";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ResetPassword from "./auth/ResetPassword";
import ResetPasswordConfirm from "./auth/ResetPasswordConfirm";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import YouthDashboard from "./pages/youth/YouthDashboard";
import ChildrenDashboard from "./pages/children/ChildrenDashboard";
import TreasuryDashboard from "./pages/treasury/TreasuryDashboard";
import PastorDashboard from "./pages/pastor/PastorDashboard";

// Settings
import Profiles from "./pages/settings/Profiles";
import ChangePassword from "./pages/settings/ChangePassword";

// Admin
import ManageRoles from "./components/admin/ManageRoles";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-password-confirm" element={<ResetPasswordConfirm />} />
          </Route>

          {/* Auth callback */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/youth" element={<YouthDashboard />} />
              <Route path="/dashboard/children" element={<ChildrenDashboard />} />
              <Route path="/dashboard/treasury" element={<TreasuryDashboard />} />
              <Route path="/dashboard/pastor" element={<PastorDashboard />} />

              {/* Settings */}
              <Route path="/dashboard/settings/profiles" element={<Profiles />} />
              <Route path="/dashboard/settings/change-password" element={<ChangePassword />} />

              {/* Admin only */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/dashboard/manage-roles" element={<ManageRoles />} />
              </Route>

            </Route>
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;