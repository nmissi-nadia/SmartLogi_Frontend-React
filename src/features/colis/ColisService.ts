import api from '../../services/api';
import { type Colis } from './types';

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
    }
};

export default ColisService;
