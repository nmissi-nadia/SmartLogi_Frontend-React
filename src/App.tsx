import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { GestionnaireDashboard } from './features/dashboard/pages/GestionnaireDashboard';
import { ClientDashboard } from './features/dashboard/pages/ClientDashboard';
import { ColisPage } from './features/colis/pages/ColisPage';
import { CreateColisPage } from './features/colis/pages/CreateColisPage';
import { ClientColisPage } from './features/colis/pages/ClientColisPage';
import { LivreurPage } from './features/livreurs/pages/LivreurPage';
import { ClientPage } from './features/clients/pages/ClientPage';
import { ZonePage } from './features/zones/pages/ZonePage';
import { MainLayout } from './layouts/MainLayout';
import { RoleBasedRedirect } from './components/RoleBasedRedirect';
import { useAppSelector } from './hooks/redux';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
