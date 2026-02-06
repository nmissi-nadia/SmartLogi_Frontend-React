import api from '../../services/api';
import type { TrackingInfo } from './types';

interface DestinataireDTO {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
}

const TrackingService = {
    // Rechercher un destinataire par nom et email
    searchDestinataire: async (nom: string, email: string): Promise<DestinataireDTO> => {
        const response = await api.get<DestinataireDTO>('/public/destinataires/search', {
            params: { nom, email }
        });
        return response.data;
    },

    // Récupérer tous les colis d'un destinataire
    getColisByDestinataire: async (destinataireId: string): Promise<TrackingInfo[]> => {
        const response = await api.get<TrackingInfo[]>(`/public/destinataires/${destinataireId}/colis`);
        return response.data;
    },

    // Recherche combinée: trouve le destinataire puis ses colis
    searchByNameAndEmail: async (nom: string, email: string): Promise<TrackingInfo[]> => {
        try {
            // Étape 1: Rechercher le destinataire
            const destinataire = await TrackingService.searchDestinataire(nom, email);

            // Étape 2: Récupérer ses colis
            const colis = await TrackingService.getColisByDestinataire(destinataire.id);
            return colis;
        } catch (error: any) {
            if (error.response?.status === 404) {
                // Destinataire non trouvé
                return [];
            }
            throw error;
        }
    },

    // Rechercher un colis par ID (pour la recherche directe)
    trackByColisId: async (colisId: string): Promise<TrackingInfo> => {
        const response = await api.get<TrackingInfo>(`/public/tracking/colis/${colisId}`);
        return response.data;
    },

    // Confirmer la réception d'un colis
    confirmReception: async (destinataireId: string, colisId: string): Promise<void> => {
        await api.post(`/public/destinataires/${destinataireId}/colis/${colisId}/confirmation`);
    }
};

export default TrackingService;
export type { DestinataireDTO };
