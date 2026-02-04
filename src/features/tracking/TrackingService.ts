import api from '../../services/api';
import type { TrackingInfo } from './types';

const TrackingService = {
    trackByColisId: async (colisId: string): Promise<TrackingInfo> => {
        const response = await api.get<TrackingInfo>(`/public/track/${colisId}`);
        return response.data;
    },

    searchByNameAndEmail: async (nom: string, email: string): Promise<TrackingInfo[]> => {
        const response = await api.post<TrackingInfo[]>('/public/track/search', { nom, email });
        return response.data;
    },

    confirmReception: async (colisId: string): Promise<void> => {
        await api.post(`/public/colis/${colisId}/confirm`);
    }
};

export default TrackingService;
