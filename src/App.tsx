import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import QuestsPage from './pages/QuestsPage';
import QuestDetailPage from './pages/QuestDetailPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/quests" element={
              <ProtectedRoute>
                <Layout>
                  <QuestsPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/quests/:id" element={
              <ProtectedRoute>
                <Layout>
                  <QuestDetailPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <Layout>
                  <CommunityPage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Layout>
                  <AdminPage />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Redirect to dashboard for authenticated users */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              className: 'bg-dark-card text-white border border-primary-800/30',
              style: {
                background: '#16213e',
                color: '#ffffff',
                border: '1px solid rgba(29, 78, 216, 0.3)',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;