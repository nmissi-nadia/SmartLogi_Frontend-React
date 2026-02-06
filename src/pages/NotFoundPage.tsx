import { useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <div className="relative inline-block">
                        <h1 className="text-[180px] font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent leading-none">
                            404
                        </h1>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <Search className="text-primary-300" size={80} />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    Page Introuvable
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                    Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        variant="primary"
                        onClick={() => navigate(-1)}
                        className="gap-2"
                    >
                        <ArrowLeft size={20} />
                        Retour
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/')}
                        className="gap-2"
                    >
                        <Home size={20} />
                        Accueil
                    </Button>
                </div>

                {/* Suggestions */}
                <div className="mt-12 glass-card p-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Pages Populaires</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                            onClick={() => navigate('/track')}
                            className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-sm text-slate-700 font-medium"
                        >
                            Suivi de Colis
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-sm text-slate-700 font-medium"
                        >
                            Connexion
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-sm text-slate-700 font-medium"
                        >
                            Tableau de Bord
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
