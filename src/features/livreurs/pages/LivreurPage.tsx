import { useEffect, useState } from 'react';
import { type Livreur } from '../types';
import LivreurService from '../LivreurService';
import { type Zone } from '../../zones/types';
import ZoneService from '../../zones/ZoneService';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { RefreshCw, Search, Trash2, Edit2, Plus, Check, X as XIcon, Truck, MapPin, BarChart2 } from 'lucide-react';

export const LivreurPage = () => {
    const [livreurs, setLivreurs] = useState<Livreur[]>([]);
    const [zones, setZones] = useState<Zone[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLivreur, setEditingLivreur] = useState<Partial<Livreur> | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [livreursData, zonesData] = await Promise.all([
                LivreurService.getAll(),
                ZoneService.getAll()
            ]);
            setLivreurs(livreursData);
            setZones(zonesData);
        } catch (error) {
            console.error("Erreur chargement", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Supprimer ce livreur ?')) {
            try {
                await LivreurService.delete(id);
                setLivreurs(prev => prev.filter(l => l.id !== id));
            } catch (error) {
                console.error("Erreur suppression", error);
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingLivreur) return;

        try {
            if (editingLivreur.id) {
                await LivreurService.update(editingLivreur.id, editingLivreur);
            } else {
                await LivreurService.create({ ...editingLivreur, disponible: true });
            }
            setIsModalOpen(false);
            setEditingLivreur(null);
            fetchData();
        } catch (error) {
            console.error("Erreur sauvegarde", error);
        }
    };

    const openModal = (livreur?: Livreur) => {
        setEditingLivreur(livreur || { nom: '', prenom: '', email: '', telephone: '', vehicule: '', zoneId: '' });
        setIsModalOpen(true);
    };

    const filtered = livreurs.filter(l =>
        l.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.prenom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getZoneName = (zoneId?: string) => {
        if (!zoneId) return 'Aucune zone';
        return zones.find(z => z.id === zoneId)?.nom || 'Zone inconnue';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                        Gestion des Livreurs
                    </h1>
                    <p className="text-slate-500 mt-1">Gérez votre flotte, assignez véhicules et zones.</p>
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
                        <Plus size={18} /> Nouveau
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
                            <th className="p-4 font-semibold text-slate-500 uppercase text-xs">Livreur</th>
                            <th className="p-4 font-semibold text-slate-500 uppercase text-xs">Info Véhicule & Zone</th>
                            <th className="p-4 font-semibold text-slate-500 uppercase text-xs">Contact</th>
                            <th className="p-4 font-semibold text-slate-500 uppercase text-xs">Statut</th>
                            <th className="p-4 font-semibold text-slate-500 uppercase text-xs text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map(l => (
                            <tr key={l.id} className="hover:bg-slate-50/80">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                                            {l.prenom.substring(0, 1)}{l.nom.substring(0, 1)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">{l.prenom} {l.nom}</div>
                                            <div className="text-xs text-slate-400">ID: {l.id.substring(0, 6)}...</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-600 space-y-1">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Truck size={14} className="text-slate-400" />
                                        <span>{l.vehicule || 'Non renseigné'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin size={14} className="text-slate-400" />
                                        <span className={l.zoneId ? 'text-primary-600 font-medium' : 'text-slate-400'}>
                                            {getZoneName(l.zoneId)}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-600 space-y-1">
                                    <div className="text-sm">{l.email}</div>
                                    <div className="text-xs text-slate-400">{l.telephone}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${l.disponible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {l.disponible ? <Check size={12} /> : <XIcon size={12} />}
                                        {l.disponible ? 'Disponible' : 'Indisponible'}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button title="Statistiques" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <BarChart2 size={18} />
                                    </button>
                                    <button onClick={() => openModal(l)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(l.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && editingLivreur && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="glass-card w-full max-w-md p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">{editingLivreur.id ? 'Modifier' : 'Ajouter'} un livreur</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500">Prénom</label>
                                    <Input
                                        required
                                        value={editingLivreur.prenom}
                                        onChange={e => setEditingLivreur({ ...editingLivreur, prenom: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500">Nom</label>
                                    <Input
                                        required
                                        value={editingLivreur.nom}
                                        onChange={e => setEditingLivreur({ ...editingLivreur, nom: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Email</label>
                                <Input
                                    required
                                    type="email"
                                    value={editingLivreur.email}
                                    onChange={e => setEditingLivreur({ ...editingLivreur, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Téléphone</label>
                                <Input
                                    required
                                    value={editingLivreur.telephone}
                                    onChange={e => setEditingLivreur({ ...editingLivreur, telephone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Véhicule</label>
                                <Input
                                    value={editingLivreur.vehicule || ''}
                                    onChange={e => setEditingLivreur({ ...editingLivreur, vehicule: e.target.value })}
                                    placeholder="Ex: Scooter, Camionnette..."
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Zone de livraison</label>
                                <select
                                    className="input-field"
                                    value={editingLivreur.zoneId || ''}
                                    onChange={e => setEditingLivreur({ ...editingLivreur, zoneId: e.target.value })}
                                >
                                    <option value="">Aucune zone assignée</option>
                                    {zones.map(z => (
                                        <option key={z.id} value={z.id}>
                                            {z.nom} ({z.ville})
                                        </option>
                                    ))}
                                </select>
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
