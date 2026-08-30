import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppStateProvider } from './context/AppStateContext';
import { AuthShell } from './components/layout/AuthShell';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Root Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { Onboarding } from './pages/Onboarding';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

// Frontend B Feature Components
import { HackathonExplorer } from './features/hackathons/HackathonExplorer';
import { HackathonDetails } from './features/hackathons/HackathonDetails';

import { TeamBuilder } from './features/teamBuilder/TeamBuilder';
import { TeammateProfile } from './features/teamBuilder/TeammateProfile';
import { CreateTeam } from './features/teamBuilder/CreateTeam';

import { ValidatorInput } from './features/validator/ValidatorInput';
import { ValidatorResult } from './features/validator/ValidatorResult';

import { DemoCoachInput } from './features/demoCoach/DemoCoachInput';
import { PitchAnalysisResult } from './features/demoCoach/PitchAnalysisResult';
import { DetailedFeedback } from './features/demoCoach/DetailedFeedback';
import { ImprovedPitch } from './features/demoCoach/ImprovedPitch';
import { MockJudge } from './features/demoCoach/MockJudge';

import { MentorMarketplace } from './features/mentors/MentorMarketplace';
import { FreeMentors } from './features/mentors/FreeMentors';
import { FreeMentorProfile } from './features/mentors/FreeMentorProfile';
import { FreeGuidanceRequest } from './features/mentors/FreeGuidanceRequest';
import { PaidMentors } from './features/mentors/PaidMentors';
import { PaidMentorProfile } from './features/mentors/PaidMentorProfile';
import { PaidBooking } from './features/mentors/PaidBooking';

import { CustomGoldenCursor } from './components/ui/CustomGoldenCursor';

function App() {
  return (
    <AuthProvider>
      <AppStateProvider>
        <CustomGoldenCursor />
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
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />

              {/* Hackathon Explorer */}
              <Route path="/hackathons" element={<HackathonExplorer />} />
              <Route path="/hackathons/:id" element={<HackathonDetails />} />

              {/* Student Teaming */}
              <Route path="/team-builder" element={<TeamBuilder />} />
              <Route path="/team-builder/create" element={<CreateTeam />} />
              <Route path="/team-builder/:id" element={<TeammateProfile />} />
              <Route
                path="/teaming"
                element={<Navigate to="/team-builder" replace />}
              />

              {/* AI Idea Validator */}
              <Route path="/validator" element={<ValidatorInput />} />
              <Route path="/validator/result" element={<ValidatorResult />} />

              {/* AI Demo Coach */}
              <Route path="/demo-coach" element={<DemoCoachInput />} />
              <Route
                path="/demo-coach/result"
                element={<PitchAnalysisResult />}
              />
              <Route
                path="/demo-coach/feedback"
                element={<DetailedFeedback />}
              />
              <Route
                path="/demo-coach/improved-pitch"
                element={<ImprovedPitch />}
              />
              <Route
                path="/demo-coach/mock-judge"
                element={<MockJudge />}
              />

              {/* Mentor Marketplace */}
              <Route path="/mentors" element={<MentorMarketplace />} />
              <Route path="/mentors/free" element={<FreeMentors />} />
              <Route
                path="/mentors/free/:id"
                element={<FreeMentorProfile />}
              />
              <Route
                path="/mentors/free/:id/request"
                element={<FreeGuidanceRequest />}
              />
              <Route path="/mentors/paid" element={<PaidMentors />} />
              <Route
                path="/mentors/paid/:id"
                element={<PaidMentorProfile />}
              />
              <Route
                path="/mentors/paid/:id/book"
                element={<PaidBooking />}
              />
            </Route>

          </Routes>
        </BrowserRouter>
      </AppStateProvider>
    </AuthProvider>
  );
}

export default App;

