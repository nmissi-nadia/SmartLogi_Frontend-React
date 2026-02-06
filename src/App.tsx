import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { GestionnaireDashboard } from './features/dashboard/pages/GestionnaireDashboard';
import { ClientDashboard } from './features/dashboard/pages/ClientDashboard';
import { LivreurDashboard } from './features/dashboard/pages/LivreurDashboard';
import { ColisPage } from './features/colis/pages/ColisPage';
import { CreateColisPage } from './features/colis/pages/CreateColisPage';
import { ClientColisPage } from './features/colis/pages/ClientColisPage';
import { LivreurColisPage } from './features/colis/pages/LivreurColisPage';
import { LivreurPage } from './features/livreurs/pages/LivreurPage';
import { ClientPage } from './features/clients/pages/ClientPage';
import { ClientProfilePage } from './features/clients/pages/ClientProfilePage';
import { ZonePage } from './features/zones/pages/ZonePage';
import { PublicTrackingPage } from './features/tracking/pages/PublicTrackingPage';
import { MainLayout } from './layouts/MainLayout';
import { RoleBasedRedirect } from './components/RoleBasedRedirect';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAppSelector } from './hooks/redux';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <ErrorBoundary>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/track" element={<PublicTrackingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<RoleBasedRedirect />} />
            <Route path="dashboard" element={<GestionnaireDashboard />} />
            <Route path="colis" element={<ColisPage />} />
            <Route path="livreurs" element={<LivreurPage />} />
            <Route path="clients" element={<ClientPage />} />
            <Route path="zones" element={<ZonePage />} />

            {/* Client Routes */}
            <Route path="client/dashboard" element={<ClientDashboard />} />
            <Route path="client/colis" element={<ClientColisPage />} />
            <Route path="client/colis/create" element={<CreateColisPage />} />
            <Route path="client/profile" element={<ClientProfilePage />} />

            {/* Livreur Routes */}
            <Route path="livreur/dashboard" element={<LivreurDashboard />} />
            <Route path="livreur/colis" element={<LivreurColisPage />} />
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
