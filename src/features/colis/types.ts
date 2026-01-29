export const StatutColis = {
    CREE: 'CREE',
    COLLECTE: 'COLLECTE',
    EN_STOCK: 'EN_STOCK',
    EN_TRANSIT: 'EN_TRANSIT',
    LIVRE: 'LIVRE'
} as const;

export type StatutColis = typeof StatutColis[keyof typeof StatutColis];

export const PrioriteEnum = {
    BASSE: 'BASSE',
    MOYENNE: 'MOYENNE',
    HAUTE: 'HAUTE'
} as const;

export type PrioriteEnum = typeof PrioriteEnum[keyof typeof PrioriteEnum];

export interface HistoriqueLivraison {
    date: string;
    statut: StatutColis;
    commentaire?: string;
}

export interface Colis {
    id: string;
    description: string;
    poids: number;
    priorite: PrioriteEnum;
    villeDestination: string;
    statut: StatutColis;
    livreurId?: string;
    clientExpediteurId: string;
    destinataireId: string;
    zoneId?: string;
    historique?: HistoriqueLivraison[];
    // Helper fields for display if backend provides expanded DTO, otherwise we show IDs
    clientName?: string;
    livreurName?: string;
}
