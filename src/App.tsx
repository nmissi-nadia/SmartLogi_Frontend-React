import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { GestionnaireDashboard } from './features/dashboard/pages/GestionnaireDashboard';
import { ColisPage } from './features/colis/pages/ColisPage';
import { MainLayout } from './layouts/MainLayout';
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
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<GestionnaireDashboard />} />
          <Route path="colis" element={<ColisPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
