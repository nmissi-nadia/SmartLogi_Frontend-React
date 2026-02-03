import api from '../../services/api';
import { type ClientExpediteur } from './types';

const ClientService = {
    getAll: async (): Promise<ClientExpediteur[]> => {
        const response = await api.get<ClientExpediteur[]>('/clients');
        return response.data;
    },

    getMyProfile: async (): Promise<ClientExpediteur> => {
        const response = await api.get<ClientExpediteur>('/clients/me');
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/clients/${id}`);
    },

    create: async (data: Partial<ClientExpediteur>): Promise<ClientExpediteur> => {
        const response = await api.post<ClientExpediteur>('/clients', data);
        return response.data;
    },

    update: async (id: string, data: Partial<ClientExpediteur>): Promise<ClientExpediteur> => {
        const response = await api.put<ClientExpediteur>(`/clients/${id}`, data);
        return response.data;
    }
};

export default ClientService;
