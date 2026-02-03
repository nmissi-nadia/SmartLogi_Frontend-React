import api from '../../services/api';

export interface DashboardStats {
    totalColis: number;
    colisLivres: number;
    colisEnCours: number;
    colisRetournes: number;
    [key: string]: number;
}

const DashboardService = {
    getStats: async (): Promise<DashboardStats> => {
        // Use the overview endpoint that returns proper statistics
        const response = await api.get<Record<string, number>>('/colis/statistiques/overview');
        return {
            totalColis: response.data.totalColis || 0,
            colisLivres: response.data.colisLivres || 0,
            colisEnCours: response.data.colisEnCours || 0,
            colisRetournes: response.data.colisRetournes || 0,
            ...response.data
        };
    },

    getStatistiques: async (livreurId?: string, zoneId?: string): Promise<DashboardStats> => {
        // For filtered stats, we'll use the overview endpoint for now
        // The /gestionnaires/statistiques endpoint returns different format (poidsTotal, nombreColis)
        const response = await api.get<Record<string, number>>('/colis/statistiques/overview', {
            params: livreurId || zoneId ? { livreurId, zoneId } : undefined
        });
        return {
            totalColis: response.data.totalColis || 0,
            colisLivres: response.data.colisLivres || 0,
            colisEnCours: response.data.colisEnCours || 0,
            colisRetournes: response.data.colisRetournes || 0,
            ...response.data
        };
    }
};

export default DashboardService;
