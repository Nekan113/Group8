import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { ROLES } from './constants'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RecipientRegisterPage from './pages/RecipientRegisterPage'
import DonorRegisterPage from './pages/DonorRegisterPage'
import ProfilePage from './pages/ProfilePage'
import DonorDashboardPage from './pages/DonorDashboardPage'
import DonorListingsPage from './pages/DonorListingsPage'
import RecipientBrowsePage from './pages/RecipientBrowsePage'
import RecipientHistoryPage from './pages/RecipientHistoryPage'
import PremiumPage from './pages/PremiumPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminListingsPage from './pages/AdminListingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register/recipient" element={<RecipientRegisterPage />} />
            <Route path="register/donor" element={<DonorRegisterPage />} />

            <Route
              path="profile"
              element={
                <ProtectedRoute allowedRoles={[ROLES.RECIPIENT, ROLES.DONOR]}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="donor/dashboard"
              element={
                <ProtectedRoute allowedRoles={[ROLES.DONOR]}>
                  <DonorDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="donor/listings"
              element={
                <ProtectedRoute allowedRoles={[ROLES.DONOR]}>
                  <DonorListingsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="recipient/browse"
              element={
                <ProtectedRoute allowedRoles={[ROLES.RECIPIENT]}>
                  <RecipientBrowsePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="recipient/history"
              element={
                <ProtectedRoute allowedRoles={[ROLES.RECIPIENT]}>
                  <RecipientHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="premium"
              element={
                <ProtectedRoute allowedRoles={[ROLES.RECIPIENT]}>
                  <PremiumPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="admin/users"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/listings"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <AdminListingsPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
