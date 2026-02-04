import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LivreurService from '../../livreurs/LivreurService';
import type { Colis } from '../../colis/types';
import { Package, MapPin, Filter, Search } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export const LivreurColisPage = () => {
    const navigate = useNavigate();
    const [colis, setColis] = useState<Colis[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        fetchColis();
    }, [selectedStatus]);

    const fetchColis = async () => {
        setLoading(true);
        try {
            const response = await LivreurService.getMyAssignedColis(0, 50, selectedStatus);
            setColis(response.content);
        } catch (error) {
            console.error('Erreur chargement colis', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsDelivered = async (colisId: string) => {
        setUpdating(colisId);
        try {
            await LivreurService.updateColisStatus(colisId, 'LIVRE');
            await fetchColis();
            alert('Colis marqué comme livré !');
        } catch (error) {
            console.error('Erreur mise à jour', error);
            alert('Erreur lors de la mise à jour');
        } finally {
            setUpdating(null);
        }
    };

    const getStatusBadge = (statut: string) => {
        const badges: Record<string, { bg: string; text: string; label: string }> = {
            CREE: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Créé' },
            COLLECTE: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Collecté' },
            EN_STOCK: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'En Stock' },
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

    const filteredColis = colis.filter(c =>
        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.villeDestination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                        Mes Livraisons
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {filteredColis.length} colis assignés
                    </p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="glass-card p-4 space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Rechercher par description, ville ou ID..."
                        className="pl-10"
                    />
                </div>

                {/* Status Filters */}
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">Statut:</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
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
                            onClick={() => setSelectedStatus('CREE')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedStatus === 'CREE'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            Créés
                        </button>
                        <button
                            onClick={() => setSelectedStatus('EN_TRANSIT')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedStatus === 'EN_TRANSIT'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            En Transit
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

            {/* Colis Grid */}
            {filteredColis.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <Package className="mx-auto text-slate-300 mb-4" size={64} />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">Aucun colis trouvé</h3>
                    <p className="text-slate-500">
                        {searchTerm ? 'Essayez de modifier votre recherche' : 'Vous n\'avez pas de colis assignés pour le moment'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredColis.map((c) => (
                        <div key={c.id} className="glass-card overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Card Header */}
                            <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-200">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Package className="text-primary-600" size={20} />
                                        <h3 className="font-semibold text-slate-900">
                                            #{c.id.substring(0, 8)}
                                        </h3>
                                    </div>
                                    <div className="flex gap-2">
                                        {getStatusBadge(c.statut)}
                                        {getPriorityBadge(c.priorite)}
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">{c.description}</p>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="text-slate-400" size={16} />
                                    <span className="text-slate-600">Destination:</span>
                                    <span className="font-medium text-slate-900">{c.villeDestination}</span>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-slate-600">
                                    <div>
                                        <span className="text-slate-500">Poids:</span> <span className="font-medium">{c.poids} kg</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Destinataire:</span> <span className="font-medium">ID {c.destinataireId}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-3 border-t border-slate-100">
                                    {c.statut === 'EN_TRANSIT' && (
                                        <Button
                                            variant="primary"
                                            onClick={() => handleMarkAsDelivered(c.id)}
                                            disabled={updating === c.id}
                                            className="flex-1"
                                        >
                                            {updating === c.id ? 'Mise à jour...' : 'Marquer Livré'}
                                        </Button>
                                    )}
                                    <Button
                                        variant="secondary"
                                        onClick={() => navigate(`/colis/${c.id}`)}
                                        className={c.statut === 'EN_TRANSIT' ? '' : 'flex-1'}
                                    >
                                        Détails
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
