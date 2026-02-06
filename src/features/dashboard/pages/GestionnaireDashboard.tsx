import { useEffect, useState } from 'react';
import DashboardService, { type DashboardStats } from '../DashboardService';
import { DashboardStatsGrid } from '../components/DashboardStatsGrid';
import { StatusPieChart } from '../components/StatusPieChart';
import { StatsBarChart } from '../components/StatsBarChart';
import { DeliveryTrendChart } from '../components/DeliveryTrendChart';
import { Button } from '../../../components/ui/Button';
import { RefreshCw, Filter } from 'lucide-react';
import { type Zone } from '../../zones/types';
import { type Livreur } from '../../livreurs/types';
import ZoneService from '../../zones/ZoneService';
import LivreurService from '../../livreurs/LivreurService';

export const GestionnaireDashboard = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalColis: 0,
        colisLivres: 0,
        colisEnCours: 0,
        colisRetournes: 0
    });
    const [loading, setLoading] = useState(true);
    const [zones, setZones] = useState<Zone[]>([]);
    const [livreurs, setLivreurs] = useState<Livreur[]>([]);
    const [selectedZone, setSelectedZone] = useState<string>('');
    const [selectedLivreur, setSelectedLivreur] = useState<string>('');
    const [showFilters, setShowFilters] = useState(false);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await DashboardService.getStatistiques(
                selectedLivreur || undefined,
                selectedZone || undefined
            );
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilterData = async () => {
        try {
            const [zonesData, livreursData] = await Promise.all([
                ZoneService.getAll(),
                LivreurService.getAll()
            ]);
            setZones(zonesData);
            setLivreurs(livreursData);
        } catch (error) {
            console.error("Failed to fetch filter data", error);
        }
    };

    useEffect(() => {
        fetchFilterData();
        fetchStats();
    }, []);

    useEffect(() => {
        fetchStats();
    }, [selectedZone, selectedLivreur]);

    const clearFilters = () => {
        setSelectedZone('');
        setSelectedLivreur('');
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                        Vue d'ensemble
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Bienvenue sur le tableau de bord de gestion logistique.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => setShowFilters(!showFilters)} variant="secondary" className="gap-2">
                        <Filter size={18} />
                        Filtres
                    </Button>
                    <Button onClick={fetchStats} variant="secondary" className="gap-2">
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        Actualiser
                    </Button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="glass-card p-6 animate-fade-in">
                    <h3 className="font-semibold text-slate-900 mb-4">Filtrer les statistiques</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">Zone</label>
                            <select
                                className="input-field"
                                value={selectedZone}
                                onChange={(e) => setSelectedZone(e.target.value)}
                            >
                                <option value="">Toutes les zones</option>
                                {zones.map(z => (
                                    <option key={z.id} value={z.id}>{z.nom} ({z.codePostal})</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">Livreur</label>
                            <select
                                className="input-field"
                                value={selectedLivreur}
                                onChange={(e) => setSelectedLivreur(e.target.value)}
                            >
                                <option value="">Tous les livreurs</option>
                                {livreurs.map(l => (
                                    <option key={l.id} value={l.id}>{l.prenom} {l.nom}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <Button onClick={clearFilters} variant="secondary" className="w-full">
                                Réinitialiser
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <DashboardStatsGrid stats={stats} isLoading={loading} />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatsBarChart stats={stats} />
                <StatusPieChart stats={stats} />
            </div>

            {/* Trend Chart */}
            <DeliveryTrendChart stats={stats} />
        </div>
    );
};
