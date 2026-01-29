import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { loginStart, loginSuccess, loginFailure } from './authSlice';
import AuthService from './AuthService';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { User, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error } = useAppSelector(state => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginStart());
        try {
            const response = await AuthService.login({ username, password });
            dispatch(loginSuccess(response));
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            dispatch(loginFailure(err.response?.data?.message || 'Identifiants incorrects'));
        }
    };

    return (
        <div className="w-full max-w-sm glass-card">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-100 to-primary-500 bg-clip-text text-transparent">Connexion</h1>
                    <p className="text-slate-400 mt-2 text-sm">Accédez à votre espace SmartLogi</p>
                </div>

                {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}

                <div className="space-y-4">
                    <Input
                        icon={User}
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        label="Utilisateur"
                    />
                    <Input
                        icon={Lock}
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        label="Mot de passe"
                    />
                </div>

                <Button type="submit" isLoading={loading} className="w-full mt-2">
                    Se connecter <ArrowRight className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
};
