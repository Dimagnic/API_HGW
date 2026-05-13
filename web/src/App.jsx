import React from 'react';
import { Route, Routes, HashRouter as Router, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ScrollToTop from './components/ScrollToTop';
import DashboardPage from './pages/DashboardPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import TeamMembersPage from './pages/TeamMembersPage.jsx';
import ReferralsPage from './pages/ReferralsPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import BonusesPage from './pages/BonusesPage.jsx';
import RankingsPage from './pages/RankingsPage.jsx';
import AIAssistantPage from './pages/AIAssistantPage.jsx';
import TrainingCenterPage from './pages/TrainingCenterPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import APIDocumentationPage from './pages/APIDocumentationPage.jsx';
import { SettingsProvider } from './contexts/SettingsProvider.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><SignupPage /></PageWrapper>} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><DashboardPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/team-members" element={<ProtectedRoute><PageWrapper><TeamMembersPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/referrals" element={<ProtectedRoute><PageWrapper><ReferralsPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><PageWrapper><ProductsPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><PageWrapper><OrdersPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/bonuses" element={<ProtectedRoute><PageWrapper><BonusesPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/rankings" element={<ProtectedRoute><PageWrapper><RankingsPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/ai-assistant" element={<ProtectedRoute><PageWrapper><AIAssistantPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/training-center" element={<ProtectedRoute><PageWrapper><TrainingCenterPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><PageWrapper><SettingsPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/api-documentation" element={<ProtectedRoute><PageWrapper><APIDocumentationPage /></PageWrapper></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AnimatedRoutes />
        </Router>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;