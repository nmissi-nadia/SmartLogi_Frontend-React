import api from '../../services/api';
import { type Zone } from './types';

const ZoneService = {
    getAll: async (): Promise<Zone[]> => {
        const response = await api.get<Zone[]>('/zones');
        return response.data;
    },

    getById: async (id: string): Promise<Zone> => {
        const response = await api.get<Zone>(`/zones/${id}`);
        return response.data;
    },

    create: async (data: Omit<Zone, 'id'>): Promise<Zone> => {
        const response = await api.post<Zone>('/zones', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Zone>): Promise<Zone> => {
        const response = await api.put<Zone>(`/zones/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/zones/${id}`);
    }
};

export default ZoneService;
