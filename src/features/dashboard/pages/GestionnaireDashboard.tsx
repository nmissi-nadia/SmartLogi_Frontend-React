import { useEffect, useState } from 'react';
import DashboardService, { type DashboardStats } from '../DashboardService';
import { DashboardStatsGrid } from '../components/DashboardStatsGrid';
import { Button } from '../../../components/ui/Button';
import { RefreshCw } from 'lucide-react';

export const GestionnaireDashboard = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalColis: 0,
        colisLivres: 0,
        colisEnCours: 0,
        colisRetournes: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await DashboardService.getStats();
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-100 to-primary-500 bg-clip-text text-transparent">
                        Vue d'ensemble
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Bienvenue sur le tableau de bord de gestion logistique.
                    </p>
                </div>
                <Button onClick={fetchStats} variant="secondary" className="gap-2">
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    Actualiser
                </Button>
            </div>

            {/* Stats Grid */}
            <DashboardStatsGrid stats={stats} />

            {/* Recent Activity / Quick Actions Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 h-64 flex items-center justify-center border-dashed border-2 border-slate-700/50">
                    <span className="text-slate-500">Graphique d'activité (À venir)</span>
                </div>
                <div className="glass-card p-6 h-64 flex items-center justify-center border-dashed border-2 border-slate-700/50">
                    <span className="text-slate-500">Derniers Colis (À venir)</span>
                </div>
            </div>
        </div>
    );
};
