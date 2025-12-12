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
            <Route path="pages/Home" element={<Home />} />
            <Route path="auth/Login" element={<Login />} />
            <Route path="auth/Register" element={<Register />} />
            <Route path="auth/ResetPassword" element={<ResetPassword />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="pages/Dashboard" element={<Dashboard />} />
            <Route path="pages/youth/YouthDashboard" element={<YouthDashboard />} />
            <Route path="pages/children/ChildrenDashboard" element={<ChildrenDashboard />} />
            <Route path="pages/treasury/TreasuryDashboard" element={<TreasuryDashboard />} />
            <Route path="pages/pastor/PastorDashboard" element={<PastorDashboard />} />

            {/* Settings */}
            <Route path="pages/settings/Profiles" element={<Profile />} />
            <Route
              path="/pages/settings/ChangePassword"
              element={<ChangePassword />}
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
