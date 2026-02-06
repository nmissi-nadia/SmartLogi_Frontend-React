import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientService from '../ClientService';
import type { ClientExpediteur } from '../types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import showToast from '../../../utils/toast';
import { User, Mail, Phone, MapPin, ArrowLeft, Save } from 'lucide-react';

export const ClientProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<ClientExpediteur | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const data = await ClientService.getMyProfile();
            setProfile(data);
            setFormData({
                nom: data.nom || '',
                prenom: data.prenom || '',
                email: data.email || '',
                telephone: data.telephone || '',
                adresse: data.adresse || ''
            });
        } catch (error) {
            console.error('Erreur chargement profil', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!profile) return;

        setSaving(true);
        try {
            await ClientService.update(profile.id, formData);
            await fetchProfile();
            setEditing(false);
            showToast.success('Profil mis à jour avec succès');
        } catch (error) {
            console.error('Erreur mise à jour profil', error);
            showToast.error('Erreur lors de la mise à jour du profil');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (profile) {
            setFormData({
                nom: profile.nom || '',
                prenom: profile.prenom || '',
                email: profile.email || '',
                telephone: profile.telephone || '',
                adresse: profile.adresse || ''
            });
        }
        setEditing(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Chargement...</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Profil non trouvé</div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/client/dashboard')} className="p-2 hover:bg-slate-100 rounded-lg">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                            Mon Profil
                        </h1>
                        <p className="text-slate-500 mt-1">Gérez vos informations personnelles</p>
                    </div>
                </div>
                {!editing ? (
                    <Button onClick={() => setEditing(true)}>
                        Modifier
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={handleCancel}>
                            Annuler
                        </Button>
                        <Button onClick={handleSave} isLoading={saving} className="gap-2">
                            <Save size={18} />
                            Enregistrer
                        </Button>
                    </div>
                )}
            </div>

            {/* Profile Card */}
            <div className="glass-card p-8">
                <div className="space-y-6">
                    {/* User Icon */}
                    <div className="flex justify-center">
                        <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
                            <User className="text-primary-600" size={48} />
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
                            {editing ? (
                                <Input
                                    value={formData.nom}
                                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                    placeholder="Votre nom"
                                />
                            ) : (
                                <div className="p-3 bg-slate-50 rounded-lg text-slate-900">{profile.nom || '-'}</div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Prénom</label>
                            {editing ? (
                                <Input
                                    value={formData.prenom}
                                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                    placeholder="Votre prénom"
                                />
                            ) : (
                                <div className="p-3 bg-slate-50 rounded-lg text-slate-900">{profile.prenom || '-'}</div>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                <Mail size={16} />
                                Email
                            </label>
                            {editing ? (
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="votre.email@example.com"
                                />
                            ) : (
                                <div className="p-3 bg-slate-50 rounded-lg text-slate-900">{profile.email || '-'}</div>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                <Phone size={16} />
                                Téléphone
                            </label>
                            {editing ? (
                                <Input
                                    value={formData.telephone}
                                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                    placeholder="+212 6XX XXX XXX"
                                />
                            ) : (
                                <div className="p-3 bg-slate-50 rounded-lg text-slate-900">{profile.telephone || '-'}</div>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                <MapPin size={16} />
                                Adresse
                            </label>
                            {editing ? (
                                <Input
                                    value={formData.adresse}
                                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                                    placeholder="Votre adresse complète"
                                />
                            ) : (
                                <div className="p-3 bg-slate-50 rounded-lg text-slate-900">{profile.adresse || '-'}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
