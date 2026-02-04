export interface TrackingInfo {
    id: string;
    description: string;
    statut: string;
    priorite: string;
    villeDestination: string;
    poids: number;
    destinataireNom?: string;
    destinatairePrenom?: string;
    historique?: Array<{
        dateChangement: string;
        statut: string;
        commentaire?: string;
    }>;
}
