import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrackingService from '../TrackingService';
import type { TrackingInfo } from '../types';
import { Package, MapPin, Clock, CheckCircle2, XCircle, Search, ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { StatusBadge } from '../../../components/ui/Badge';
import showToast from '../../../utils/toast';

export const PublicTrackingPage = () => {
    const navigate = useNavigate();
    const [searchMethod, setSearchMethod] = useState<'id' | 'name'>('id');
    const [colisId, setColisId] = useState('');
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [trackingResults, setTrackingResults] = useState<TrackingInfo[]>([]);
    const [destinataireId, setDestinataireId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearchById = async () => {
        if (!colisId.trim()) {
            setError('Veuillez entrer un numéro de colis');
            return;
        }

        setLoading(true);
        setError('');
        setDestinataireId(null); // Reset destinataire ID for ID search
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
            // Étape 1: Rechercher le destinataire
            const destinataire = await TrackingService.searchDestinataire(nom, email);
            setDestinataireId(destinataire.id);

            // Étape 2: Récupérer ses colis
            const results = await TrackingService.getColisByDestinataire(destinataire.id);
            setTrackingResults(results);
            if (results.length === 0) {
                setError('Aucun colis trouvé pour ce destinataire');
            }
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError('Destinataire non trouvé. Vérifiez votre nom et email.');
            } else {
                setError(err.response?.data?.message || 'Erreur de recherche');
            }
            setTrackingResults([]);
            setDestinataireId(null);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmReception = async (colisId: string, colisDestinataireId?: string) => {
        // Utiliser le destinataireId du colis ou celui stocké dans l'état
        const destId = colisDestinataireId || destinataireId;

        if (!destId) {
            showToast.error('Impossible de confirmer la réception. Veuillez rechercher à nouveau par nom et email.');
            return;
        }

        try {
            await TrackingService.confirmReception(destId, colisId);
            showToast.success('Réception confirmée avec succès !');
            // Refresh tracking info
            if (searchMethod === 'id') {
                handleSearchById();
            } else {
                handleSearchByName();
            }
        } catch (err) {
            showToast.error('Erreur lors de la confirmation');
        }
    };

    const getStatusIcon = (statut: string) => {
        switch (statut) {
            case 'LIVRE':
                return <CheckCircle2 className="text-success-600" size={24} />;
            case 'EN_TRANSIT':
                return <Clock className="text-warning-600" size={24} />;
            case 'RETOURNE':
                return <XCircle className="text-danger-600" size={24} />;
            default:
                return <Package className="text-slate-600" size={24} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <button
                        onClick={() => navigate('/login')}
                        className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Retour à la connexion
                    </button>

                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-accent-600/30">
                            <Package className="text-white" size={28} />
                        </div>
                        <h1 className="text-4xl font-bold gradient-text-primary">
                            SmartLogi
                        </h1>
                    </div>
                    <p className="text-xl text-slate-600 font-medium">Suivez votre colis en temps réel</p>
                    <p className="text-sm text-slate-500 mt-2">Aucun compte requis - Suivi public pour les destinataires</p>
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
                            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${searchMethod === 'id'
                                ? 'bg-accent-600 text-white shadow-lg shadow-accent-600/30'
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
                            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${searchMethod === 'name'
                                ? 'bg-accent-600 text-white shadow-lg shadow-accent-600/30'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            Recherche par Nom
                        </button>
                    </div>

                    {/* Search Form */}
                    {searchMethod === 'id' ? (
                        <div className="space-y-4">
                            <Input
                                label="Numéro de Colis"
                                value={colisId}
                                onChange={(e) => setColisId(e.target.value)}
                                placeholder="Entrez le numéro de colis"
                                onKeyPress={(e) => e.key === 'Enter' && handleSearchById()}
                            />
                            <Button
                                variant="accent"
                                onClick={handleSearchById}
                                isLoading={loading}
                                className="w-full"
                            >
                                <Search size={20} />
                                Rechercher
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Input
                                label="Nom du Destinataire"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                placeholder="Votre nom"
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="votre.email@example.com"
                                onKeyPress={(e) => e.key === 'Enter' && handleSearchByName()}
                            />
                            <Button
                                variant="accent"
                                onClick={handleSearchByName}
                                isLoading={loading}
                                className="w-full"
                            >
                                <Search size={20} />
                                Rechercher
                            </Button>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-4 bg-danger-50 border border-danger-200 rounded-xl text-danger-700 text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {/* Tracking Results */}
                {trackingResults.length > 0 && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {trackingResults.map((colis) => (
                            <div key={colis.id} className="glass-card overflow-hidden animate-fade-in">
                                {/* Colis Header */}
                                <div className="p-6 bg-gradient-to-r from-accent-50 to-accent-100 border-b border-accent-200">
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
                                        <StatusBadge status={colis.statut as any} />
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
                                                        <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-accent-600' : 'bg-slate-300'
                                                            }`} />
                                                        {index < colis.historique!.length - 1 && (
                                                            <div className="w-0.5 h-12 bg-slate-200" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 pb-4">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <StatusBadge status={event.statut as any} />
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
                                    <div className="p-6 bg-success-50 border-t border-success-100">
                                        <Button
                                            variant="success"
                                            onClick={() => handleConfirmReception(colis.id, colis.destinataireId)}
                                            className="w-full"
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
