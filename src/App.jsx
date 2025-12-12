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
            <Route index element={<Home />} /> {/* Default route for PublicLayout */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} /> {/* Default dashboard route */}
            <Route path="youth" element={<YouthDashboard />} />
            <Route path="children" element={<ChildrenDashboard />} />
            <Route path="treasury" element={<TreasuryDashboard />} />
            <Route path="pastor" element={<PastorDashboard />} />

            {/* Settings */}
            <Route path="settings/profiles" element={<Profiles />} />
            <Route path="settings/change-password" element={<ChangePassword />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
