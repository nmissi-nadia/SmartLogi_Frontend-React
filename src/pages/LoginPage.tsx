import { LoginForm } from '../features/auth/LoginForm';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';

export const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 px-4 py-8">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-500/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-600/30 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-accent-600/10 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-6xl">
                {/* Logo with Float Animation */}
                <div className="mb-6 md:mb-8 flex items-center gap-3 animate-cascade-1 animate-float">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-2xl shadow-accent-600/50">
                        <span className="text-white font-bold text-xl md:text-2xl">S</span>
                    </div>
                    <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">SmartLogi</span>
                </div>

                {/* Login Form with Cascade Animation */}
                <div className="animate-cascade-2 w-full flex justify-center">
                    <LoginForm />
                </div>

                {/* Public Tracking Section */}
                <div className="mt-6 w-full max-w-md animate-cascade-3">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-400/30"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-transparent text-slate-300">ou</span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/track')}
                        className="mt-4 w-full flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white/30"
                        aria-label="Suivre mon colis sans compte"
                    >
                        <Package size={20} />
                        <span className="text-sm md:text-base">Suivre mon colis (sans compte)</span>
                    </button>

                    <p className="mt-3 text-center text-xs text-slate-400">
                        Destinataires : suivez vos colis sans creer de compte
                    </p>
                </div>

                {/* Footer */}
                <p className="mt-6 md:mt-8 text-slate-300 text-xs md:text-sm animate-cascade-4">
                    &copy; 2026 SmartLogi Delivery System
                </p>
            </div>
        </div>
    );
};
