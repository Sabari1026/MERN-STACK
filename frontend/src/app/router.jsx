import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

// Pages
import { HomePage } from '../pages/HomePage';
import { FindJobsPage } from '../pages/FindJobsPage';
import { JobDetailsPage } from '../pages/JobDetailsPage';
import { SignInPage } from '../pages/SignInPage';
import { SignUpPage } from '../pages/SignUpPage';
import { CandidateProfilePage } from '../pages/CandidateProfilePage';
import { RecruiterDashboardPage } from '../pages/RecruiterDashboardPage';
import { CompanyDiscoveryPage } from '../pages/CompanyDiscoveryPage';
import { TalentMatchPage } from '../pages/TalentMatchPage';
import { InterviewSchedulerPage } from '../pages/InterviewSchedulerPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { SettingsPage } from '../pages/SettingsPage';
import { AboutPage } from '../pages/AboutPage';
import { ServicesPage } from '../pages/ServicesPage';
import { ApproachPage } from '../pages/ApproachPage';
import { CasesPage } from '../pages/CasesPage';
import { ContactPage } from '../pages/ContactPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { TermsPage } from '../pages/TermsPage';

/**
 * Route protection wrapper verifying authentication and role authorization
 */
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="spinner" style={{ width: '32px', height: '32px' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public Discovery Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<FindJobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/companies" element={<CompanyDiscoveryPage />} />
        <Route path="/talent-match" element={<TalentMatchPage />} />
        <Route path="/schedule" element={<InterviewSchedulerPage />} />

        {/* Public Informational Pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/approach" element={<ApproachPage />} />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Authentication Pages */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected Role-Based Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['candidate', 'admin']}>
              <CandidateProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter"
          element={
            <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
              <RecruiterDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
