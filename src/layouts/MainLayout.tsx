import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logout } from '../features/auth/authSlice';
import { LayoutDashboard, Package, Truck, Users, LogOut, Menu, X, Map, Send, User } from 'lucide-react';
import { useState } from 'react';

const SidebarLink = ({ to, icon: Icon, children }: any) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-1
      ${isActive
                ? 'bg-primary-50 text-primary-600 border border-primary-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`
        }
    >
        <Icon size={20} />
        {children}
    </NavLink>
);

export const MainLayout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector(state => state.auth);
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex bg-slate-50 text-slate-900 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200 flex flex-col transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                {/* Logo */}
                <div className="p-6 flex items-center gap-3 border-b border-slate-100">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-600/20">
                        <span className="text-white font-bold">S</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">SmartLogi</span>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Menu</div>

                    {/* Gestionnaire Links */}
                    {user?.roles?.includes('ROLE_GESTIONNAIRE') && (
                        <>
                            <SidebarLink to="/dashboard" icon={LayoutDashboard}>Dashboard</SidebarLink>
                            <SidebarLink to="/colis" icon={Package}>Colis</SidebarLink>
                            <SidebarLink to="/livreurs" icon={Truck}>Livreurs</SidebarLink>
                            <SidebarLink to="/clients" icon={Users}>Clients</SidebarLink>
                            <SidebarLink to="/zones" icon={Map}>Zones</SidebarLink>
                        </>
                    )}

                    {/* Client Links */}
                    {user?.roles?.includes('ROLE_CLIENT_EXPEDITEUR') && (
                        <>
                            <SidebarLink to="/client/dashboard" icon={LayoutDashboard}>Tableau de Bord</SidebarLink>

                            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-2">Mes Colis</div>
                            <SidebarLink to="/client/colis" icon={Package}>Liste des Colis</SidebarLink>
                            <SidebarLink to="/client/colis/create" icon={Send}>Créer un Colis</SidebarLink>

                            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-2">Mon Compte</div>
                            <SidebarLink to="/client/profile" icon={User}>Mon Profil</SidebarLink>
                        </>
                    )}

                    {/* Livreur Links */}
                    {user?.roles?.includes('ROLE_LIVREUR') && (
                        <>
                            <SidebarLink to="/livreur/dashboard" icon={LayoutDashboard}>Tableau de Bord</SidebarLink>
                            <SidebarLink to="/livreur/colis" icon={Package}>Mes Livraisons</SidebarLink>
                        </>
                    )}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={20} />
                        Déconnexion
                    </button>
                    <div className="mt-4 px-2 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                            {user?.username?.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-900">{user?.username}</span>
                            <span className="text-xs text-slate-500 capitalize">
                                {user?.roles?.[0]?.replace('ROLE_', '').toLowerCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-slate-50">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 border-b border-slate-200 bg-white/50 backdrop-blur-md flex items-center justify-between px-4">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600">
                        {isSidebarOpen ? <X /> : <Menu />}
                    </button>
                    <span className="font-bold text-slate-900">SmartLogi</span>
                    <div className="w-8" />
                </header>

                <div className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
                    {/* Background Decor - Subtle Light Gradients */}
                    <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary-50/50 to-transparent pointer-events-none" />

                    <div className="relative z-10 max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};
