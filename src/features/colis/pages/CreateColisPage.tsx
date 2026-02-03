import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColisRequestDTO, DestinataireDTO, ZoneDTO, ColisProduitDTO, ProduitDTO } from '../types';
import type { Zone } from '../../zones/types';
import ColisService from '../ColisService';
import ZoneService from '../../zones/ZoneService';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ArrowLeft, ArrowRight, Package, Send } from 'lucide-react';

export const CreateColisPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [availableZones, setAvailableZones] = useState<Zone[]>([]);
    const [useExistingZone, setUseExistingZone] = useState(false);
    const [selectedZoneId, setSelectedZoneId] = useState('');

    // Form state
    const [description, setDescription] = useState('');
    const [poids, setPoids] = useState('');
    const [priorite, setPriorite] = useState('MOYENNE');
    const [villeDestination, setVilleDestination] = useState('');

    const [destinataire, setDestinataire] = useState<DestinataireDTO>({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: ''
    });

    const [zone, setZone] = useState<ZoneDTO>({
        nom: '',
        ville: '',
        codePostal: '',
        description: ''
    });

    const [produits, setProduits] = useState<ColisProduitDTO[]>([]);
    const [currentProduit, setCurrentProduit] = useState<ProduitDTO>({ nom: '', categorie: '' });
    const [currentQuantite, setCurrentQuantite] = useState(1);

    useEffect(() => {
        fetchZones();
    }, []);

    const fetchZones = async () => {
        try {
            const zones = await ZoneService.getAll();
            setAvailableZones(zones);
        } catch (error) {
            console.error('Erreur chargement zones', error);
        }
    };

    const handleZoneSelection = (zoneId: string) => {
        setSelectedZoneId(zoneId);
        const selectedZone = availableZones.find(z => z.id === zoneId);
        if (selectedZone) {
            setZone({
                nom: selectedZone.nom,
                ville: selectedZone.ville,
                codePostal: selectedZone.codePostal,
                description: selectedZone.description || ''
            });
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const request: ColisRequestDTO = {
                description,
                poids: parseFloat(poids),
                priorite,
                villeDestination,
                destinataire,
                zone: zone.nom ? zone : undefined,
                produits: produits.length > 0 ? produits : undefined
            };

            await ColisService.createColisRequest(request);
            navigate('/client/colis');
        } catch (error) {
            console.error('Erreur création colis', error);
            alert('Erreur lors de la création du colis');
        } finally {
            setLoading(false);
        }
    };

    const addProduit = () => {
        if (currentProduit.nom && currentProduit.categorie) {
            setProduits([...produits, { produit: currentProduit, quantite: currentQuantite }]);
            setCurrentProduit({ nom: '', categorie: '' });
            setCurrentQuantite(1);
        }
    };

    const removeProduit = (index: number) => {
        setProduits(produits.filter((_, i) => i !== index));
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return description && poids && villeDestination;
            case 2:
                return destinataire.nom && destinataire.prenom && destinataire.email && destinataire.telephone && destinataire.adresse;
            case 3:
            case 4:
                return true;
            default:
                return false;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/client/colis')} className="p-2 hover:bg-slate-100 rounded-lg">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                        Nouvelle Demande de Livraison
                    </h1>
                    <p className="text-slate-500 mt-1">Étape {currentStep} sur 4</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-2">
                    {['Colis', 'Destinataire', 'Zone', 'Produits'].map((_, index) => (
                        <div key={index} className="flex-1 flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep > index + 1 ? 'bg-green-500 text-white' :
                                currentStep === index + 1 ? 'bg-primary-600 text-white' :
                                    'bg-slate-200 text-slate-400'
                                }`}>
                                {currentStep > index + 1 ? '✓' : index + 1}
                            </div>
                            {index < 3 && (
                                <div className={`flex-1 h-1 mx-2 ${currentStep > index + 1 ? 'bg-green-500' : 'bg-slate-200'}`} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                    {['Colis', 'Destinataire', 'Zone', 'Produits'].map((_, index) => (
                        <span key={index} className="flex-1 text-center">{['Colis', 'Destinataire', 'Zone', 'Produits'][index]}</span>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="glass-card p-8">
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Package className="text-primary-600" />
                            Informations du Colis
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                                <Input
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Ex: Documents importants"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Poids (kg) *</label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={poids}
                                    onChange={(e) => setPoids(e.target.value)}
                                    placeholder="Ex: 2.5"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Priorité *</label>
                                <select
                                    className="input-field"
                                    value={priorite}
                                    onChange={(e) => setPriorite(e.target.value)}
                                >
                                    <option value="BASSE">Basse</option>
                                    <option value="MOYENNE">Moyenne</option>
                                    <option value="HAUTE">Haute</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Ville de Destination *</label>
                                <Input
                                    value={villeDestination}
                                    onChange={(e) => setVilleDestination(e.target.value)}
                                    placeholder="Ex: Casablanca"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900">Informations du Destinataire</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Nom *</label>
                                <Input
                                    value={destinataire.nom}
                                    onChange={(e) => setDestinataire({ ...destinataire, nom: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Prénom *</label>
                                <Input
                                    value={destinataire.prenom}
                                    onChange={(e) => setDestinataire({ ...destinataire, prenom: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                                <Input
                                    type="email"
                                    value={destinataire.email}
                                    onChange={(e) => setDestinataire({ ...destinataire, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone *</label>
                                <Input
                                    value={destinataire.telephone}
                                    onChange={(e) => setDestinataire({ ...destinataire, telephone: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Adresse *</label>
                                <Input
                                    value={destinataire.adresse}
                                    onChange={(e) => setDestinataire({ ...destinataire, adresse: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900">Zone de Livraison (Optionnel)</h2>

                        {/* Zone Selection Toggle */}
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={!useExistingZone}
                                    onChange={() => {
                                        setUseExistingZone(false);
                                        setSelectedZoneId('');
                                        setZone({ nom: '', ville: '', codePostal: '', description: '' });
                                    }}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm font-medium text-slate-700">Créer nouvelle zone</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={useExistingZone}
                                    onChange={() => setUseExistingZone(true)}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm font-medium text-slate-700">Sélectionner zone existante</span>
                            </label>
                        </div>

                        {useExistingZone ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Zone</label>
                                <select
                                    className="input-field"
                                    value={selectedZoneId}
                                    onChange={(e) => handleZoneSelection(e.target.value)}
                                >
                                    <option value="">Sélectionner une zone</option>
                                    {availableZones.map((z) => (
                                        <option key={z.id} value={z.id}>
                                            {z.nom} - {z.ville} ({z.codePostal})
                                        </option>
                                    ))}
                                </select>
                                {selectedZoneId && (
                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <p className="text-sm text-blue-900">
                                            <strong>Zone sélectionnée:</strong> {zone.nom}
                                        </p>
                                        <p className="text-sm text-blue-700 mt-1">{zone.description}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Nom de la Zone</label>
                                    <Input
                                        value={zone.nom}
                                        onChange={(e) => setZone({ ...zone, nom: e.target.value })}
                                        placeholder="Ex: Centre-ville"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Ville</label>
                                    <Input
                                        value={zone.ville}
                                        onChange={(e) => setZone({ ...zone, ville: e.target.value })}
                                        placeholder="Ex: Casablanca"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Code Postal</label>
                                    <Input
                                        value={zone.codePostal}
                                        onChange={(e) => setZone({ ...zone, codePostal: e.target.value })}
                                        placeholder="Ex: 20000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                    <Input
                                        value={zone.description || ''}
                                        onChange={(e) => setZone({ ...zone, description: e.target.value })}
                                        placeholder="Description de la zone"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900">Produits (Optionnel)</h2>

                        {/* Add Product Form */}
                        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                            <h3 className="font-semibold text-slate-700 mb-4">Ajouter un produit</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Input
                                    placeholder="Nom du produit"
                                    value={currentProduit.nom}
                                    onChange={(e) => setCurrentProduit({ ...currentProduit, nom: e.target.value })}
                                />
                                <Input
                                    placeholder="Catégorie"
                                    value={currentProduit.categorie}
                                    onChange={(e) => setCurrentProduit({ ...currentProduit, categorie: e.target.value })}
                                />
                                <Input
                                    type="number"
                                    min="1"
                                    placeholder="Quantité"
                                    value={currentQuantite}
                                    onChange={(e) => setCurrentQuantite(parseInt(e.target.value))}
                                />
                                <Button onClick={addProduit} variant="secondary">Ajouter</Button>
                            </div>
                        </div>

                        {/* Products List */}
                        {produits.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-slate-700">Produits ajoutés ({produits.length})</h3>
                                {produits.map((p, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                                        <div>
                                            <span className="font-medium">{p.produit.nom}</span>
                                            <span className="text-slate-500 ml-2">({p.produit.categorie})</span>
                                            <span className="text-slate-400 ml-2">x{p.quantite}</span>
                                        </div>
                                        <button
                                            onClick={() => removeProduit(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <Button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    variant="secondary"
                    disabled={currentStep === 1}
                    className="gap-2"
                >
                    <ArrowLeft size={18} />
                    Précédent
                </Button>

                {currentStep < 4 ? (
                    <Button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        disabled={!canProceed()}
                        className="gap-2"
                    >
                        Suivant
                        <ArrowRight size={18} />
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !canProceed()}
                        className="gap-2"
                    >
                        <Send size={18} />
                        {loading ? 'Envoi...' : 'Créer la Demande'}
                    </Button>
                )}
            </div>
        </div>
    );
};
