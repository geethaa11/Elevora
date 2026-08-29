import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthShell } from './components/layout/AuthShell';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { FeaturePlaceholder } from './pages/FeaturePlaceholder';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>

          {/* Public & Auth Routes */}
          <Route element={<AuthShell />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Onboarding */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />

          {/* Protected Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />

            <Route
              path="/hackathons"
              element={
                <FeaturePlaceholder
                  title="Hackathon Explorer"
                  description="Find and join upcoming hackathons."
                />
              }
            />

            <Route
              path="/validator"
              element={
                <FeaturePlaceholder
                  title="AI Idea Validator"
                  description="Validate and refine your hackathon ideas with AI."
                />
              }
            />

            <Route
              path="/teaming"
              element={
                <FeaturePlaceholder
                  title="Student Teaming"
                  description="Find the perfect team members for your next project."
                />
              }
            />

            <Route
              path="/mentors"
              element={
                <FeaturePlaceholder
                  title="Mentor Marketplace"
                  description="Connect with experienced mentors."
                />
              }
            />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
