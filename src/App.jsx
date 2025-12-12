// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Login from './auth/Login';
import Register from './auth/Register';
import ResetPassword from './auth/ResetPassword';
import ProtectedRoute from './auth/ProtectedRoute';

// Public Pages
import Home from './pages/Home';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import YouthDashboard from './pages/youth/YouthDashboard';
import ChildrenDashboard from './pages/children/ChildrenDashboard';
import TreasuryDashboard from './pages/treasury/TreasuryDashboard';
import PastorDashboard from './pages/pastor/PastorDashboard';

// Settings
import Profiles from './pages/settings/Profiles';
import ChangePassword from './pages/settings/ChangePassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/youth" element={<YouthDashboard />} />
            <Route path="/dashboard/children" element={<ChildrenDashboard />} />
            <Route path="/dashboard/treasury" element={<TreasuryDashboard />} />
            <Route path="/dashboard/comms" element={<CommsDashboard />} />
            <Route path="/dashboard/pastor" element={<PastorDashboard />} />

            {/* Settings */}
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route
              path="/dashboard/settings/change-password"
              element={<ChangePassword />}
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
