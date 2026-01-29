import api from '../../services/api';

export interface DashboardStats {
    totalColis: number;
    colisLivres: number;
    colisEnCours: number;
    colisRetournes: number;
    // Map dynamic keys from backend if needed, or structured like above
    [key: string]: number;
}

const DashboardService = {
    getStats: async (): Promise<DashboardStats> => {
        const response = await api.get<DashboardStats>('/colis/statistiques/overview');
        return response.data;
    }
};

export default DashboardService;
