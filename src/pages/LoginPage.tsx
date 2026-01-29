import { LoginForm } from '../features/auth/LoginForm';

export const LoginPage = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-50">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-100/50 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center w-full px-4">
                <div className="mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30">
                        <span className="text-white font-bold text-xl">S</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900 tracking-tight">SmartLogi</span>
                </div>
                <LoginForm />
                <p className="mt-8 text-slate-400 text-sm">
                    &copy; 2026 SmartLogi Delivery System
                </p>
            </div>
        </div>
    );
};
