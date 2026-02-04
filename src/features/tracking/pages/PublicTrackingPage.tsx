import { useState } from 'react';
import { Search, Package, MapPin, Clock, CheckCircle2, XCircle } from 'lucide-react';
import TrackingService from '../TrackingService';
import type { TrackingInfo } from '../types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export const PublicTrackingPage = () => {
    const [searchMethod, setSearchMethod] = useState<'id' | 'name'>('id');
    const [colisId, setColisId] = useState('');
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [trackingResults, setTrackingResults] = useState<TrackingInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearchById = async () => {
        if (!colisId.trim()) {
            setError('Veuillez entrer un numéro de colis');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const result = await TrackingService.trackByColisId(colisId);
            setTrackingResults([result]);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Colis non trouvé');
            setTrackingResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchByName = async () => {
        if (!nom.trim() || !email.trim()) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const results = await TrackingService.searchByNameAndEmail(nom, email);
            setTrackingResults(results);
            if (results.length === 0) {
                setError('Aucun colis trouvé pour ces informations');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur de recherche');
            setTrackingResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmReception = async (colisId: string) => {
        try {
            await TrackingService.confirmReception(colisId);
            alert('Réception confirmée avec succès !');
            // Refresh tracking info
            if (searchMethod === 'id') {
                handleSearchById();
            } else {
                handleSearchByName();
            }
        } catch (err) {
            alert('Erreur lors de la confirmation');
        }
    };

    const getStatusIcon = (statut: string) => {
        switch (statut) {
            case 'LIVRE':
                return <CheckCircle2 className="text-green-600" size={24} />;
            case 'EN_TRANSIT':
                return <Clock className="text-blue-600" size={24} />;
            case 'RETOURNE':
                return <XCircle className="text-red-600" size={24} />;
            default:
                return <Package className="text-slate-600" size={24} />;
        }
    };

    const getStatusLabel = (statut: string) => {
        const labels: Record<string, string> = {
            CREE: 'Créé',
            COLLECTE: 'Collecté',
            EN_STOCK: 'En Stock',
            EN_TRANSIT: 'En Transit',
            LIVRE: 'Livré',
            RETOURNE: 'Retourné'
        };
        return labels[statut] || statut;
    };

    const getStatusColor = (statut: string) => {
        const colors: Record<string, string> = {
            CREE: 'bg-yellow-100 text-yellow-800',
            COLLECTE: 'bg-blue-100 text-blue-800',
            EN_STOCK: 'bg-purple-100 text-purple-800',
            EN_TRANSIT: 'bg-blue-100 text-blue-800',
            LIVRE: 'bg-green-100 text-green-800',
            RETOURNE: 'bg-red-100 text-red-800'
        };
        return colors[statut] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                            <Package className="text-white" size={24} />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                            SmartLogi
                        </h1>
                    </div>
                    <p className="text-xl text-slate-600">Suivez votre colis en temps réel</p>
                </div>

                {/* Search Card */}
                <div className="max-w-2xl mx-auto glass-card p-8 mb-8">
                    {/* Search Method Toggle */}
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => {
                                setSearchMethod('id');
                                setError('');
                                setTrackingResults([]);
                            }}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${searchMethod === 'id'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            Recherche par N° Colis
                        </button>
                        <button
                            onClick={() => {
                                setSearchMethod('name');
                                setError('');
                                setTrackingResults([]);
                            }}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${searchMethod === 'name'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            Recherche par Nom
                        </button>
                    </div>

                    {/* Search Form */}
                    {searchMethod === 'id' ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Numéro de Colis
                                </label>
                                <Input
                                    value={colisId}
                                    onChange={(e) => setColisId(e.target.value)}
                                    placeholder="Entrez le numéro de colis"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearchById()}
                                />
                            </div>
                            <Button
                                variant="primary"
                                onClick={handleSearchById}
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? 'Recherche...' : (
                                    <>
                                        <Search size={20} />
                                        Rechercher
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Nom du Destinataire
                                </label>
                                <Input
                                    value={nom}
                                    onChange={(e) => setNom(e.target.value)}
                                    placeholder="Votre nom"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="votre.email@example.com"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearchByName()}
                                />
                            </div>
                            <Button
                                variant="primary"
                                onClick={handleSearchByName}
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? 'Recherche...' : (
                                    <>
                                        <Search size={20} />
                                        Rechercher
                                    </>
                                )}
                            </Button>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {/* Tracking Results */}
                {trackingResults.length > 0 && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {trackingResults.map((colis) => (
                            <div key={colis.id} className="glass-card overflow-hidden">
                                {/* Colis Header */}
                                <div className="p-6 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            {getStatusIcon(colis.statut)}
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">
                                                    Colis #{colis.id.substring(0, 8)}
                                                </h3>
                                                <p className="text-sm text-slate-600 mt-1">{colis.description}</p>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(colis.statut)}`}>
                                            {getStatusLabel(colis.statut)}
                                        </span>
                                    </div>
                                </div>

                                {/* Colis Details */}
                                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="text-primary-600" size={20} />
                                        <div>
                                            <p className="text-xs text-slate-500">Destination</p>
                                            <p className="font-medium text-slate-900">{colis.villeDestination}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Package className="text-primary-600" size={20} />
                                        <div>
                                            <p className="text-xs text-slate-500">Poids</p>
                                            <p className="font-medium text-slate-900">{colis.poids} kg</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="text-primary-600" size={20} />
                                        <div>
                                            <p className="text-xs text-slate-500">Priorité</p>
                                            <p className="font-medium text-slate-900">{colis.priorite}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline */}
                                {colis.historique && colis.historique.length > 0 && (
                                    <div className="p-6">
                                        <h4 className="font-semibold text-slate-900 mb-4">Historique de Livraison</h4>
                                        <div className="space-y-4">
                                            {colis.historique.map((event, index) => (
                                                <div key={index} className="flex gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-primary-600' : 'bg-slate-300'
                                                            }`} />
                                                        {index < colis.historique!.length - 1 && (
                                                            <div className="w-0.5 h-12 bg-slate-200" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 pb-4">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(event.statut)}`}>
                                                                {getStatusLabel(event.statut)}
                                                            </span>
                                                            <span className="text-sm text-slate-500">
                                                                {new Date(event.dateChangement).toLocaleString('fr-FR')}
                                                            </span>
                                                        </div>
                                                        {event.commentaire && (
                                                            <p className="text-sm text-slate-600">{event.commentaire}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Confirm Reception Button */}
                                {colis.statut === 'LIVRE' && (
                                    <div className="p-6 bg-green-50 border-t border-green-100">
                                        <Button
                                            variant="primary"
                                            onClick={() => handleConfirmReception(colis.id)}
                                            className="w-full bg-green-600 hover:bg-green-700"
                                        >
                                            <CheckCircle2 size={20} />
                                            Confirmer la Réception
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
