import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { logout } from '../features/auth/authSlice';
import { Button } from '../components/ui/Button';

export const DashboardPage = () => {
    const { user } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();

    return (
        <div className="min-h-screen p-8 bg-slate-950 text-white">
            <div className="glass-card max-w-2xl mx-auto p-8 border border-white/10 rounded-2xl bg-slate-900/40 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-100 to-primary-500 bg-clip-text text-transparent">Dashboard</h1>
                    <Button variant="secondary" onClick={() => dispatch(logout())}>Déconnexion</Button>
                </div>

                <p className="mb-6 text-lg">Bienvenue, <span className="text-primary-400 font-bold">{user?.username}</span></p>

                <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                    <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-3">Vos Rôles</h3>
                    <div className="flex gap-2">
                        {(user?.roles || []).map(role => (
                            <span key={role} className="px-3 py-1 bg-primary-900/40 text-primary-300 border border-primary-500/30 rounded-full text-sm font-medium">
                                {role}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
