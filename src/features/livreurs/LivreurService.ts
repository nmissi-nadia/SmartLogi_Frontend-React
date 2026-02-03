import api from '../../services/api';
import { type Livreur } from './types';

const LivreurService = {
    getAll: async (): Promise<Livreur[]> => {
        const response = await api.get<Livreur[]>('/livreurs');
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
