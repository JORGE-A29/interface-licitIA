import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationsProvider } from './context/NotificationsContext';
import DashboardLayout from './components/layout/DashboardLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Analyze from './pages/Analyze';
import Company from './pages/Company';
import AIAssistant from './pages/AIAssistant';
import History from './pages/History';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Profile from './pages/Profile';
import Security from './pages/Security';

const Loader = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#f8fafc',
      flexDirection: 'column',
      gap: 12,
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        border: '3px solid #e5e7eb',
        borderTopColor: '#2563eb',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }}
    />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    <span style={{ color: '#6b7280', fontSize: 14 }}>
      Cargando...
    </span>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loader />;

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loader />;

  return !isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

function AppContent() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {[
        { path: '/dashboard', element: <Dashboard /> },
        { path: '/search', element: <Search /> },
        { path: '/analyze', element: <Analyze /> },
        { path: '/company', element: <Company /> },
        { path: '/ai-assistant', element: <AIAssistant /> },
        { path: '/history', element: <History /> },
        { path: '/settings', element: <Settings /> },
        { path: '/help', element: <Help /> },
        { path: '/profile', element: <Profile /> },
        { path: '/security', element: <Security /> },
      ].map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute>
              <DashboardLayout>{element}</DashboardLayout>
            </ProtectedRoute>
          }
        />
      ))}

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationsProvider>
          <AppContent />
        </NotificationsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
