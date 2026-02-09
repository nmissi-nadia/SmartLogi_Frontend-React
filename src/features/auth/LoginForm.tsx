import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { loginStart, loginSuccess, loginFailure } from './authSlice';
import AuthService from './AuthService';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ArrowRight, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [shake, setShake] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error } = useAppSelector(state => state.auth);
    const usernameInputRef = useRef<HTMLInputElement>(null);

    // Auto-focus on username field
    useEffect(() => {
        usernameInputRef.current?.focus();
    }, []);

    // Trigger shake animation on error
    useEffect(() => {
        if (error) {
            setShake(true);
            const timer = setTimeout(() => setShake(false), 500);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginStart());
        try {
            const response = await AuthService.login({ username, password });
            dispatch(loginSuccess(response));
            // Redirect to root, RoleBasedRedirect will handle routing
            navigate('/');
        } catch (err: any) {
            console.error(err);
            dispatch(loginFailure(err.response?.data?.message || 'Identifiants incorrects'));
        }
    };

    return (
        <div className={`w-full max-w-md glass-card p-8 ${shake ? 'animate-shake' : ''}`}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-100 to-primary-500 bg-clip-text text-transparent">
                        Connexion
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm">Accedez a votre espace SmartLogi</p>
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-fade-in">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {/* Username Input with Icon */}
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <User size={20} />
                        </div>
                        <Input
                            ref={usernameInputRef}
                            placeholder="Nom d'utilisateur"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            className="pl-11 input-glow"
                            aria-label="Nom d'utilisateur"
                        />
                    </div>

                    {/* Password Input with Icon and Toggle */}
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <Lock size={20} />
                        </div>
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Mot de passe"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="pl-11 pr-11 input-glow"
                            aria-label="Mot de passe"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:text-primary-600"
                            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-right">
                        <button
                            type="button"
                            onClick={() => {/* TODO: Implement forgot password */ }}
                            className="text-sm text-primary-400 hover:text-primary-300 transition-colors focus:outline-none focus:underline"
                        >
                            Mot de passe oublie ?
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    isLoading={loading}
                    className="w-full mt-2 group"
                    aria-label="Se connecter"
                >
                    Se connecter
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </form>
        </div>
    );
};
