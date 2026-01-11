import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Auth
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ResetPassword from "./auth/ResetPassword";
import ResetPasswordConfirm from "./auth/ResetPasswordConfirm";
import VerifyEmailInfo from "./auth/VerifyEmailInfo";
import EmailVerified from "./auth/EmailVerified";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import YouthDashboard from "./pages/youth/YouthDashboard";
import ChildrenDashboard from "./pages/children/ChildrenDashboard";
import TreasuryDashboard from "./pages/treasury/TreasuryDashboard";
import EnvelopeEntry from "./pages/treasury/EnvelopeEntry";
import PastorDashboard from "./pages/pastor/PastorDashboard";

// Settings
import ProfilePage from "./pages/settings/profiles/ProfilePage";
import ChangePassword from "./pages/settings/ChangePassword";

// Admin
import AdminDashboard from "./components/admin/AdminDashboard";

// Toaster
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
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
             <Route path="/verify-email-info" element={<VerifyEmailInfo />} />
             <Route path="/email-verified" element={<EmailVerified />} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/youth" element={<YouthDashboard />} />
                <Route path="/dashboard/children" element={<ChildrenDashboard />} />
                <Route path="/dashboard/treasury" element={<TreasuryDashboard />} />
                <Route path="/dashboard/treasury/envelope" element={<EnvelopeEntry />}/>
                <Route path="/dashboard/pastor" element={<PastorDashboard />} />

                {/* Settings */}
                <Route path="/dashboard/settings/profiles" element={<ProfilePage />} />
                <Route path="/dashboard/settings/change-password" element={<ChangePassword />} />

                {/* Admin only */}
                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                  <Route path="/dashboard/admin" element={<AdminDashboard />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
