import { useEffect, useState } from 'react';
import { type Colis, StatutColis } from '../types';
import ColisService from '../ColisService';
import { type Livreur } from '../../livreurs/types';
import LivreurService from '../../livreurs/LivreurService';
import { Button } from '../../../components/ui/Button';
import { RefreshCw, Search, Truck, MapPin, Package, Eye, X as XIcon, Calendar, Clock, Filter, Edit } from 'lucide-react';
import { Input } from '../../../components/ui/Input';

export const ColisPage = () => {
    const [colisList, setColisList] = useState<Colis[]>([]);
    const [livreurs, setLivreurs] = useState<Livreur[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [assigningId, setAssigningId] = useState<string | null>(null);
    const [selectedColis, setSelectedColis] = useState<Colis | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatut, setFilterStatut] = useState('');
    const [filterVille, setFilterVille] = useState('');
    const [filterPriorite, setFilterPriorite] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [newStatut, setNewStatut] = useState('');
    const [statusComment, setStatusComment] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [colisData, livreursData] = await Promise.all([
                ColisService.getAll(),
                LivreurService.getAll()
            ]);
            setColisList(colisData);
            setLivreurs(livreursData);
        } catch (error) {
            console.error("Erreur chargement données", error);
        } finally {
            setLoading(false);
        }
    };

    const applySearch = async () => {
        setLoading(true);
        try {
            const results = await ColisService.searchColis(
                filterStatut || undefined,
                filterVille || undefined,
                filterPriorite || undefined
            );
            setColisList(results);
        } catch (error) {
            console.error("Erreur recherche", error);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setFilterStatut('');
        setFilterVille('');
        setFilterPriorite('');
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAssign = async (colisId: string, livreurId: string) => {
        if (!livreurId) return;
        setAssigningId(colisId);
        try {
            await ColisService.assignLivreur(colisId, livreurId);
            setColisList(prev => prev.map(c =>
                c.id === colisId ? { ...c, livreurId, statut: StatutColis.COLLECTE } : c
            ));
            await fetchData();
        } catch (error) {
            console.error("Erreur assignation", error);
        } finally {
            setAssigningId(null);
        }
    };

    const handleStatusUpdate = async () => {
        if (!selectedColis || !newStatut) return;
        setUpdatingStatus(true);
        try {
            const updated = await ColisService.updateStatus(
                selectedColis.id,
                newStatut,
                statusComment || undefined
            );
            setColisList(prev => prev.map(c => c.id === updated.id ? updated : c));
            setSelectedColis(updated);
            setNewStatut('');
            setStatusComment('');
        } catch (error) {
            console.error("Erreur mise à jour statut", error);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getStatusColor = (statut: StatutColis) => {
        switch (statut) {
            case StatutColis.CREE: return 'bg-slate-100 text-slate-600 border-slate-200';
            case StatutColis.COLLECTE: return 'bg-blue-100 text-blue-700 border-blue-200';
            case StatutColis.EN_TRANSIT: return 'bg-orange-100 text-orange-700 border-orange-200';
            case StatutColis.LIVRE: return 'bg-green-100 text-green-700 border-green-200';
            case StatutColis.EN_STOCK: return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'Date inconnue';
        return new Date(dateStr).toLocaleString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const filteredColis = colisList.filter(c =>
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.villeDestination.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                        Gestion des Colis
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Consultez et assignez les colis aux livreurs disponibles.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input
                            placeholder="Rechercher (ID, Ville)..."
                            className="pl-10 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => setShowFilters(!showFilters)} variant="secondary" className="gap-2">
                        <Filter size={18} />
                        Filtres
                    </Button>
                    <Button onClick={fetchData} variant="secondary" className="gap-2">
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </Button>
                </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
                <div className="glass-card p-6 animate-fade-in">
                    <h3 className="font-semibold text-slate-900 mb-4">Recherche avancée</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">Statut</label>
                            <select
                                className="input-field"
                                value={filterStatut}
                                onChange={(e) => setFilterStatut(e.target.value)}
                            >
                                <option value="">Tous</option>
                                <option value="CREE">CREE</option>
                                <option value="COLLECTE">COLLECTE</option>
                                <option value="EN_STOCK">EN_STOCK</option>
                                <option value="EN_TRANSIT">EN_TRANSIT</option>
                                <option value="LIVRE">LIVRE</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">Ville</label>
                            <Input
                                value={filterVille}
                                onChange={(e) => setFilterVille(e.target.value)}
                                placeholder="Ville de destination"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">Priorité</label>
                            <select
                                className="input-field"
                                value={filterPriorite}
                                onChange={(e) => setFilterPriorite(e.target.value)}
                            >
                                <option value="">Toutes</option>
                                <option value="BASSE">BASSE</option>
                                <option value="MOYENNE">MOYENNE</option>
                                <option value="HAUTE">HAUTE</option>
                            </select>
                        </div>
                        <div className="flex items-end gap-2">
                            <Button onClick={applySearch} className="flex-1">Rechercher</Button>
                            <Button onClick={clearFilters} variant="secondary">Réinitialiser</Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Référence</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Destination</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priorité</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Livreur</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredColis.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400">
                                        Aucun colis trouvé.
                                    </td>
                                </tr>
                            ) : (
                                filteredColis.map((colis) => (
                                    <tr key={colis.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                                    <Package size={20} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-900">#{colis.id.substring(0, 8)}</span>
                                                    <span className="text-xs text-slate-400">{colis.description}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-slate-400" />
                                                {colis.villeDestination}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium 
                                                ${colis.priorite === 'HAUTE' ? 'bg-red-100 text-red-700' :
                                                    colis.priorite === 'MOYENNE' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {colis.priorite}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(colis.statut)}`}>
                                                {colis.statut}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {colis.livreurId ? (
                                                <div className="flex items-center gap-2 text-slate-700">
                                                    <Truck size={16} className="text-primary-500" />
                                                    <span className="text-sm font-medium">
                                                        {livreurs.find(l => l.id === colis.livreurId)?.nom || 'Livreur assigné'}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic text-sm">Non assigné</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedColis(colis)}
                                                    className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                                                    title="Voir détails"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {colis.statut === StatutColis.CREE || !colis.livreurId ? (
                                                    <select
                                                        className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 max-w-[140px]"
                                                        onChange={(e) => handleAssign(colis.id, e.target.value)}
                                                        defaultValue=""
                                                        disabled={assigningId === colis.id}
                                                    >
                                                        <option value="" disabled>Assigner...</option>
                                                        {livreurs
                                                            .filter(l => l.disponible)
                                                            .map(l => (
                                                                <option key={l.id} value={l.id}>
                                                                    {l.prenom} {l.nom}
                                                                </option>
                                                            ))}
                                                    </select>
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Modal */}
            {selectedColis && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 sm:p-6">
                    <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <Package className="text-primary-600" />
                                    Colis #{selectedColis.id.substring(0, 8)}
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">{selectedColis.description}</p>
                            </div>
                            <button onClick={() => setSelectedColis(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                                <XIcon size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Info Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <div className="text-xs text-slate-500 uppercase font-semibold">Poids</div>
                                    <div className="font-medium text-slate-900">{selectedColis.poids} kg</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <div className="text-xs text-slate-500 uppercase font-semibold">Priorité</div>
                                    <div className={`font-medium ${selectedColis.priorite === 'HAUTE' ? 'text-red-600' : 'text-slate-900'}`}>
                                        {selectedColis.priorite}
                                    </div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg col-span-2">
                                    <div className="text-xs text-slate-500 uppercase font-semibold">Destination</div>
                                    <div className="font-medium text-slate-900 flex items-center gap-1">
                                        <MapPin size={14} /> {selectedColis.villeDestination}
                                    </div>
                                </div>
                            </div>

                            {/* Status Update Section */}
                            <div className="border-t border-slate-100 pt-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Edit size={20} className="text-slate-400" />
                                    Mettre à jour le statut
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-500">Nouveau statut</label>
                                            <select
                                                className="input-field"
                                                value={newStatut}
                                                onChange={(e) => setNewStatut(e.target.value)}
                                            >
                                                <option value="">Sélectionner...</option>
                                                <option value="CREE">CREE</option>
                                                <option value="COLLECTE">COLLECTE</option>
                                                <option value="EN_STOCK">EN_STOCK</option>
                                                <option value="EN_TRANSIT">EN_TRANSIT</option>
                                                <option value="LIVRE">LIVRE</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-slate-500">Commentaire (optionnel)</label>
                                            <Input
                                                value={statusComment}
                                                onChange={(e) => setStatusComment(e.target.value)}
                                                placeholder="Ajouter un commentaire..."
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleStatusUpdate}
                                        disabled={!newStatut || updatingStatus}
                                        className="w-full md:w-auto"
                                    >
                                        {updatingStatus ? 'Mise à jour...' : 'Mettre à jour'}
                                    </Button>
                                </div>
                            </div>

                            {/* History Timeline */}
                            <div className="border-t border-slate-100 pt-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Clock size={20} className="text-slate-400" />
                                    Historique de suivi
                                </h3>

                                <div className="relative pl-4 border-l-2 border-slate-100 space-y-8">
                                    {selectedColis.historique && selectedColis.historique.length > 0 ? (
                                        [...selectedColis.historique].reverse().map((event, idx) => (
                                            <div key={idx} className="relative pl-6">
                                                <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-white border-2 border-primary-500 ring-4 ring-primary-50"></div>
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                                                    <span className="font-bold text-slate-800">{event.statut}</span>
                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {formatDate(event.dateChangement)}
                                                    </span>
                                                </div>
                                                {event.commentaire && (
                                                    <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                                                        {event.commentaire}
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="pl-6 text-slate-400 italic">Aucun historique disponible</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                            <Button variant="secondary" onClick={() => setSelectedColis(null)}>Fermer</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
