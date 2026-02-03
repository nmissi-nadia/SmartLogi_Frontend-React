import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';

export const RoleBasedRedirect = () => {
    const { user } = useAppSelector(state => state.auth);

    console.log('RoleBasedRedirect - User:', user);
    console.log('RoleBasedRedirect - Roles:', user?.roles);

    if (!user || !user.roles || user.roles.length === 0) {
        console.log('RoleBasedRedirect - No user or roles, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    // Check roles in priority order
    if (user.roles.includes('ROLE_GESTIONNAIRE')) {
        console.log('RoleBasedRedirect - GESTIONNAIRE detected, redirecting to /dashboard');
        return <Navigate to="/dashboard" replace />;
    }

    if (user.roles.includes('ROLE_CLIENT')) {
        console.log('RoleBasedRedirect - CLIENT detected, redirecting to /client/dashboard');
        return <Navigate to="/client/dashboard" replace />;
    }

    if (user.roles.includes('ROLE_LIVREUR')) {
        console.log('RoleBasedRedirect - LIVREUR detected, redirecting to /livreur/dashboard');
        return <Navigate to="/livreur/dashboard" replace />;
    }

    // Default fallback
    console.log('RoleBasedRedirect - No matching role, using fallback to /dashboard');
    return <Navigate to="/dashboard" replace />;
};
