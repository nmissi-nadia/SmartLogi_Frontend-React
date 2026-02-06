import { useEffect, useState } from 'react';
import { type Zone } from '../types';
import ZoneService from '../ZoneService';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { RefreshCw, Search, Trash2, Edit2, Plus, Map, MapPin } from 'lucide-react';

export const ZonePage = () => {
    const [zones, setZones] = useState<Zone[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingZone, setEditingZone] = useState<Partial<Zone> | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await ZoneService.getAll();
            setZones(data);
        } catch (error) {
            console.error("Erreur chargement zones", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Supprimer cette zone ?')) {
            try {
                await ZoneService.delete(id);
                setZones(prev => prev.filter(z => z.id !== id));
            } catch (error) {
                console.error("Erreur suppression", error);
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingZone) return;

        try {
            if (editingZone.id) {
                await ZoneService.update(editingZone.id, editingZone);
            } else {
                await ZoneService.create(editingZone as Omit<Zone, 'id'>);
            }
            setIsModalOpen(false);
            setEditingZone(null);
            fetchData();
        } catch (error) {
            console.error("Erreur sauvegarde", error);
        }
    };

    const openModal = (zone?: Zone) => {
        setEditingZone(zone || { nom: '', codePostal: '' });
        setIsModalOpen(true);
    };

    const filtered = zones.filter(z =>
        z.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        z.codePostal.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                        Gestion des Zones
                    </h1>
                    <p className="text-slate-500 mt-1">Définissez les zones de livraison.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Rechercher..."
                            className="pl-10"
                        />
                    </div>
                    <Button onClick={() => openModal()} className="gap-2">
                        <Plus size={18} /> Nouvelle Zone
                    </Button>
                    <Button variant="secondary" onClick={fetchData}>
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </Button>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="p-4 font-semibold text-slate-500 uppercase text-xs">Nom</th>
                            <th className="p-4 font-semibold text-slate-500 uppercase text-xs">Code Postal</th>
                            <th className="p-4 font-semibold text-slate-500 uppercase text-xs text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.length === 0 ? (
                            <tr><td colSpan={3} className="p-8 text-center text-slate-400">Aucune zone définie.</td></tr>
                        ) : (
                            filtered.map(z => (
                                <tr key={z.id} className="hover:bg-slate-50/80">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                                <Map size={20} />
                                            </div>
                                            <div className="font-medium text-slate-900">{z.nom}</div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <MapPin size={14} className="text-slate-400" />
                                            {z.codePostal}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => openModal(z)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(z.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && editingZone && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="glass-card w-full max-w-md p-6 animate-fade-in">
                        <h2 className="text-xl font-bold mb-4">{editingZone.id ? 'Modifier' : 'Ajouter'} une zone</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Nom de la zone</label>
                                <Input
                                    required
                                    value={editingZone.nom}
                                    onChange={e => setEditingZone({ ...editingZone, nom: e.target.value })}
                                    placeholder="Ex: Zone Nord"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Code Postal</label>
                                <Input
                                    required
                                    value={editingZone.codePostal || ''}
                                    onChange={e => setEditingZone({ ...editingZone, codePostal: e.target.value })}
                                    placeholder="Ex: 20000"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                                <Button type="submit">Enregistrer</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
