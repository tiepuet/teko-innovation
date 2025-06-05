import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Lazy-loaded components
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const EventListPage = lazy(() => import('../pages/events/EventListPage'));
const EventDetailPage = lazy(() => import('../pages/events/EventDetailPage'));
const ProjectDetailPage = lazy(() => import('../pages/projects/ProjectDetailPage'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));

// Loading component
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Spin size="large" />
  </div>
);

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/\" replace />} />
        <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/\" replace />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/events\" replace />} />
            <Route path="/events" element={<EventListPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            
            {/* Admin routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/\" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;