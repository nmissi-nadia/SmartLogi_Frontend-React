import api from '../../services/api';
import type { Colis, ColisRequestDTO } from './types';

const ColisService = {
    getAll: async (): Promise<Colis[]> => {
        // Using gestionnaire endpoint for comprehensive list
        const response = await api.get<Colis[]>('/gestionnaires/colis');
        return response.data;
    },

    assignLivreur: async (colisId: string, livreurId: string): Promise<void> => {
        await api.post(`/gestionnaires/colis/${colisId}/assigner`, null, {
            params: { livreurId }
        });
    },

    searchColis: async (statut?: string, ville?: string, priorite?: string): Promise<Colis[]> => {
        const params: Record<string, string> = {};
        if (statut) params.statut = statut;
        if (ville) params.ville = ville;
        if (priorite) params.priorite = priorite;

        const response = await api.get<Colis[]>('/gestionnaires/colis/recherche', { params });
        return response.data;
    },

    updateStatus: async (colisId: string, statut: string, commentaire?: string): Promise<Colis> => {
        const response = await api.put<Colis>(`/gestionnaires/colis/${colisId}/traiter`, {
            statut,
            commentaire
        });
        return response.data;
    },

    // Client-specific methods
    createColisRequest: async (request: ColisRequestDTO): Promise<Colis> => {
        const response = await api.post<Colis>('/clients/colis', request);
        return response.data;
    },

    getClientColis: async (page: number = 0, size: number = 10, statut?: string): Promise<{ content: Colis[], totalPages: number, totalElements: number }> => {
        const params: Record<string, string | number> = { page, size };
        if (statut) params.status = statut;

        const response = await api.get<{ content: Colis[], totalPages: number, totalElements: number }>('/clients/colis', { params });
        return response.data;
    },

    trackColis: async (colisId: string): Promise<Colis> => {
        const response = await api.get<Colis>(`/clients/track/${colisId}`);
        return response.data;
    }
};

export default ColisService;
