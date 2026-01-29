import { useEffect, useState } from 'react';
import { type Colis, StatutColis } from '../types';
import ColisService from '../ColisService';
import { type Livreur } from '../../livreurs/types';
import LivreurService from '../../livreurs/LivreurService';
import { Button } from '../../../components/ui/Button';
import { RefreshCw, Search, Truck, MapPin, Package } from 'lucide-react';
import { Input } from '../../../components/ui/Input';

export const ColisPage = () => {
    const [colisList, setColisList] = useState<Colis[]>([]);
    const [livreurs, setLivreurs] = useState<Livreur[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [assigningId, setAssigningId] = useState<string | null>(null);

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

    useEffect(() => {
        fetchData();
    }, []);

    const handleAssign = async (colisId: string, livreurId: string) => {
        if (!livreurId) return;
        setAssigningId(colisId);
        try {
            await ColisService.assignLivreur(colisId, livreurId);
            // Update local state primarily, or refetch
            setColisList(prev => prev.map(c =>
                c.id === colisId ? { ...c, livreurId, statut: StatutColis.COLLECTE } : c // Assuming status change or just assignment
            ));
            await fetchData(); // Refresh for safety
        } catch (error) {
            console.error("Erreur assignation", error);
        } finally {
            setAssigningId(null);
        }
    };

    const getStatusColor = (statut: StatutColis) => {
        switch (statut) {
            case StatutColis.CREE: return 'bg-slate-100 text-slate-600 border-slate-200';
            case StatutColis.COLLECTE: return 'bg-blue-100 text-blue-700 border-blue-200';
            case StatutColis.EN_TRANSIT: return 'bg-orange-100 text-orange-700 border-orange-200';
            case StatutColis.LIVRE: return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-slate-100 text-slate-600';
        }
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
                    <Button onClick={fetchData} variant="secondary" className="gap-2">
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </Button>
                </div>
            </div>

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
                                            {colis.statut === StatutColis.CREE || !colis.livreurId ? (
                                                <select
                                                    className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 max-w-[160px]"
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
                                            ) : (
                                                <span className="text-slate-300 text-xs">--</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
