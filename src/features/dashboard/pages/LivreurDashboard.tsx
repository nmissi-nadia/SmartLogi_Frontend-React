import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/redux';
import LivreurService from '../../livreurs/LivreurService';
import type { Colis } from '../../colis/types';
import { Package, Clock, CheckCircle, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const LivreurDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAppSelector(state => state.auth);
    const [assignedColis, setAssignedColis] = useState<Colis[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [selectedStatus]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const colisData = await LivreurService.getMyAssignedColis(0, 20, selectedStatus);
            setAssignedColis(colisData.content);
        } catch (error) {
            console.error('Erreur chargement données', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsDelivered = async (colisId: string) => {
        setUpdating(colisId);
        try {
            await LivreurService.updateColisStatus(colisId, 'LIVRE');
            // Refresh data
            await fetchData();
            alert('Colis marqué comme livré !');
        } catch (error) {
            console.error('Erreur mise à jour statut', error);
            alert('Erreur lors de la mise à jour');
        } finally {
            setUpdating(null);
        }
    };

    const getStatistics = () => {
        const total = assignedColis.length;
        const enCours = assignedColis.filter(c => c.statut === 'EN_TRANSIT').length;
        const livres = assignedColis.filter(c => c.statut === 'LIVRE').length;
        const enAttente = assignedColis.filter(c => c.statut === 'CREE').length;

        return { total, enCours, livres, enAttente };
    };

    const stats = getStatistics();

    const getStatusBadge = (statut: string) => {
        const badges: Record<string, { bg: string; text: string; label: string }> = {
            CREE: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Créé' },
            EN_TRANSIT: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'En Transit' },
            LIVRE: { bg: 'bg-green-100', text: 'text-green-800', label: 'Livré' },
            RETOURNE: { bg: 'bg-red-100', text: 'text-red-800', label: 'Retourné' }
        };
        const badge = badges[statut] || { bg: 'bg-gray-100', text: 'text-gray-800', label: statut };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                {badge.label}
            </span>
        );
    };

    const getPriorityBadge = (priorite: string) => {
        const badges: Record<string, { bg: string; text: string }> = {
            HAUTE: { bg: 'bg-red-100', text: 'text-red-800' },
            MOYENNE: { bg: 'bg-orange-100', text: 'text-orange-800' },
            BASSE: { bg: 'bg-green-100', text: 'text-green-800' }
        };
        const badge = badges[priorite] || { bg: 'bg-gray-100', text: 'text-gray-800' };
        return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
                {priorite}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    Tableau de Bord Livreur
                </h1>
                <p className="text-slate-500 mt-1">
                    Bienvenue {user?.username}
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total Assigné</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Package className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">En Cours</p>
                            <p className="text-3xl font-bold text-blue-900 mt-2">{stats.enCours}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Clock className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Livrés</p>
                            <p className="text-3xl font-bold text-green-900 mt-2">{stats.livres}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <CheckCircle className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">En Attente</p>
                            <p className="text-3xl font-bold text-yellow-900 mt-2">{stats.enAttente}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                            <AlertCircle className="text-yellow-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-4">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-700">Filtrer par statut:</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedStatus('')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedStatus === ''
                                ? 'bg-primary-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            Tous
                        </button>
                        <button
                            onClick={() => setSelectedStatus('EN_ATTENTE')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedStatus === 'EN_ATTENTE'
                                ? 'bg-primary-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            En Attente
                        </button>
                        <button
                            onClick={() => setSelectedStatus('EN_COURS')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedStatus === 'EN_COURS'
                                ? 'bg-primary-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            En Cours
                        </button>
                        <button
                            onClick={() => setSelectedStatus('LIVRE')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedStatus === 'LIVRE'
                                ? 'bg-primary-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            Livrés
                        </button>
                    </div>
                </div>
            </div>

            {/* Colis List */}
            <div className="glass-card">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Mes Colis Assignés</h2>
                    <p className="text-sm text-slate-500 mt-1">{assignedColis.length} colis</p>
                </div>

                <div className="divide-y divide-slate-100">
                    {assignedColis.length === 0 ? (
                        <div className="p-12 text-center">
                            <Package className="mx-auto text-slate-300" size={48} />
                            <p className="text-slate-400 mt-4">Aucun colis assigné</p>
                        </div>
                    ) : (
                        assignedColis.map((colis) => (
                            <div key={colis.id} className="p-6 hover:bg-slate-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-slate-900">#{colis.id?.substring(0, 8)}</h3>
                                            {getStatusBadge(colis.statut)}
                                            {getPriorityBadge(colis.priorite)}
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">{colis.description}</p>
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} />
                                                <span>{colis.villeDestination}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Package size={14} />
                                                <span>{colis.poids} kg</span>
                                            </div>
                                            <div>
                                                Destinataire: ID {colis.destinataireId}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {colis.statut === 'EN_TRANSIT' && (
                                            <Button
                                                variant="primary"
                                                onClick={() => handleMarkAsDelivered(colis.id)}
                                                disabled={updating === colis.id}
                                            >
                                                {updating === colis.id ? 'Mise à jour...' : 'Marquer Livré'}
                                            </Button>
                                        )}
                                        <Button
                                            variant="secondary"
                                            onClick={() => navigate(`/colis/${colis.id}`)}
                                        >
                                            Détails
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
