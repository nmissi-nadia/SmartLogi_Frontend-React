import { useEffect, useState } from 'react';
import { type ClientExpediteur } from '../types';
import ClientService from '../ClientService';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { RefreshCw, Search, Trash2, Edit2, Plus, Users } from 'lucide-react';

export const ClientPage = () => {
    const [clients, setClients] = useState<ClientExpediteur[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Partial<ClientExpediteur> | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await ClientService.getAll();
            setClients(data);
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
        if (window.confirm('Supprimer ce client ?')) {
            try {
                await ClientService.delete(id);
                setClients(prev => prev.filter(c => c.id !== id));
            } catch (error) {
                console.error("Erreur suppression", error);
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingClient) return;

        try {
            if (editingClient.id) {
                await ClientService.update(editingClient.id, editingClient);
            } else {
                await ClientService.create(editingClient);
            }
            setIsModalOpen(false);
            setEditingClient(null);
            fetchData();
        } catch (error) {
            console.error("Erreur sauvegarde", error);
        }
    };

    const openModal = (client?: ClientExpediteur) => {
        setEditingClient(client || { nom: '', prenom: '', email: '', telephone: '', adresse: '' });
        setIsModalOpen(true);
    };

    const filtered = clients.filter(c =>
        c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.prenom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                        Gestion des Clients
                    </h1>
                    <p className="text-slate-500 mt-1">Gérez vos clients expéditeurs.</p>
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
                            <th className="p-4 font-semibold text-slate-500 uppercase text-xs">Client</th>
                            <th className="p-4 font-semibold text-slate-500 uppercase text-xs">Contact</th>
                            <th className="p-4 font-semibold text-slate-500 uppercase text-xs">Adresse</th>
                            <th className="p-4 font-semibold text-slate-500 uppercase text-xs text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50/80">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">{c.prenom} {c.nom}</div>
                                            <div className="text-xs text-slate-400">ID: {c.id.substring(0, 8)}...</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-600 space-y-1">
                                    <div className="text-sm">{c.email}</div>
                                    <div className="text-xs text-slate-400">{c.telephone}</div>
                                </td>
                                <td className="p-4 text-slate-600">
                                    <div className="text-sm">{c.adresse}</div>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button onClick={() => openModal(c)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal - Could be a shared component */}
            {isModalOpen && editingClient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="glass-card w-full max-w-lg p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">{editingClient.id ? 'Modifier' : 'Ajouter'} un client</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500">Prénom</label>
                                    <Input
                                        required
                                        value={editingClient.prenom}
                                        onChange={e => setEditingClient({ ...editingClient, prenom: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500">Nom</label>
                                    <Input
                                        required
                                        value={editingClient.nom}
                                        onChange={e => setEditingClient({ ...editingClient, nom: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500">Email</label>
                                    <Input
                                        required
                                        type="email"
                                        value={editingClient.email}
                                        onChange={e => setEditingClient({ ...editingClient, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500">Téléphone</label>
                                    <Input
                                        required
                                        value={editingClient.telephone}
                                        onChange={e => setEditingClient({ ...editingClient, telephone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Adresse</label>
                                <Input
                                    required
                                    value={editingClient.adresse}
                                    onChange={e => setEditingClient({ ...editingClient, adresse: e.target.value })}
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
