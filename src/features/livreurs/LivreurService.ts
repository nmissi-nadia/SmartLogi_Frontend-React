import api from '../../services/api';
import { type Livreur } from './types';

const LivreurService = {
    getAll: async (): Promise<Livreur[]> => {
        const response = await api.get<Livreur[]>('/livreurs');
        return response.data;
    }
};

export default LivreurService;
