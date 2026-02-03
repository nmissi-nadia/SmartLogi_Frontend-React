import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ColisService from '../../colis/ColisService';
import { StatutColis } from '../../colis/types';
import { Button } from '../../../components/ui/Button';
import { Package, TrendingUp, Clock, CheckCircle, Plus, RefreshCw } from 'lucide-react';

interface ClientStats {
    total: number;
    cree: number;
    enCours: number;
    livre: number;
}

export const ClientDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<ClientStats>({ total: 0, cree: 0, enCours: 0, livre: 0 });
    const [recentColis, setRecentColis] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await ColisService.getClientColis(0, 5);
            const colis = response.content;

            // Calculate stats
            const statsData: ClientStats = {
                total: response.totalElements,
                cree: colis.filter(c => c.statut === StatutColis.CREE).length,
                enCours: colis.filter(c => c.statut === StatutColis.EN_TRANSIT || c.statut === StatutColis.COLLECTE).length,
                livre: colis.filter(c => c.statut === StatutColis.LIVRE).length
            };

            setStats(statsData);
            setRecentColis(colis);
        } catch (error) {
            console.error('Erreur chargement dashboard', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const statCards = [
        { label: 'Total Colis', value: stats.total, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Créés', value: stats.cree, icon: Clock, color: 'text-slate-600', bg: 'bg-slate-100' },
        { label: 'En Cours', value: stats.enCours, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
        { label: 'Livrés', value: stats.livre, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                        Tableau de Bord
                    </h1>
                    <p className="text-slate-500 mt-1">Bienvenue sur votre espace client</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={fetchData} variant="secondary" className="gap-2">
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </Button>
                    <Button onClick={() => navigate('/client/colis/create')} className="gap-2">
                        <Plus size={18} />
                        Nouveau Colis
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <div key={index} className="glass-card p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${card.bg}`}>
                                <card.icon className={`${card.color}`} size={24} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-slate-500 font-medium">{card.label}</p>
                            <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Colis */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Colis Récents</h2>
                    <Button variant="secondary" onClick={() => navigate('/client/colis')}>
                        Voir tout
                    </Button>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-slate-400">Chargement...</div>
                ) : recentColis.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="mx-auto text-slate-300 mb-4" size={48} />
                        <p className="text-slate-400 mb-4">Aucun colis pour le moment</p>
                        <Button onClick={() => navigate('/client/colis/create')} className="gap-2">
                            <Plus size={18} />
                            Créer votre premier colis
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentColis.map((colis) => (
                            <div key={colis.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">#{colis.id.substring(0, 8)}</p>
                                        <p className="text-sm text-slate-500">{colis.villeDestination}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                                        ${colis.statut === StatutColis.LIVRE ? 'bg-green-100 text-green-700' :
                                            colis.statut === StatutColis.EN_TRANSIT ? 'bg-orange-100 text-orange-700' :
                                                'bg-slate-100 text-slate-600'}`}>
                                        {colis.statut}
                                    </span>
                                    <Button
                                        variant="secondary"
                                        onClick={() => navigate('/client/colis')}
                                    >
                                        Suivre
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/client/colis/create')}>
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-xl bg-primary-100">
                            <Plus className="text-primary-600" size={28} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Nouvelle Demande</h3>
                            <p className="text-sm text-slate-500">Créer un nouveau colis</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/client/colis')}>
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-xl bg-blue-100">
                            <Package className="text-blue-600" size={28} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Mes Colis</h3>
                            <p className="text-sm text-slate-500">Voir tous mes envois</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
