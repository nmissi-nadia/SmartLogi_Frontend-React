import api from '../../services/api';
import { type Livreur } from './types';
import type { Colis } from '../colis/types';

const LivreurService = {
    getAll: async (): Promise<Livreur[]> => {
        const response = await api.get<Livreur[]>('/livreurs');
        return response.data;
    },

    // Get assigned colis for current livreur (backend auto-detects from JWT)
    getMyAssignedColis: async (page: number = 0, size: number = 10, statut?: string): Promise<{ content: Colis[], totalPages: number, totalElements: number }> => {
        const params: Record<string, string | number> = { page, size };
        if (statut) params.statut = statut; // Backend uses 'statut' not 'status'

        const response = await api.get<{ content: Colis[], totalPages: number, totalElements: number }>('/livreurs/colis', { params });
        return response.data;
    },

    // Update colis status (for livreur)
    updateColisStatus: async (colisId: string, nouveauStatut: string): Promise<Colis> => {
        const response = await api.put<Colis>(`/livreurs/colis/${colisId}/statut`, null, {
            params: { nouveauStatut }
        });
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/livreurs/${id}`);
    },

    create: async (data: Partial<Livreur>): Promise<Livreur> => {
        const response = await api.post<Livreur>('/livreurs', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Livreur>): Promise<Livreur> => {
        const response = await api.put<Livreur>(`/livreurs/${id}`, data);
        return response.data;
    }
};

export default LivreurService;
