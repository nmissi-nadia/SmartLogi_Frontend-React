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
    dateChangement: string;
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

// DTOs for creating colis
export interface DestinataireDTO {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
}

export interface ProduitDTO {
    id?: string;
    nom: string;
    categorie: string;
    prix?: number;
}

export interface ColisProduitDTO {
    produit: ProduitDTO;
    quantite: number;
}

export interface ZoneDTO {
    id?: string;
    nom: string;
    ville: string;
    codePostal: string;
    description?: string;
}

export interface ColisRequestDTO {
    description: string;
    poids: number;
    priorite: string;
    villeDestination: string;
    destinataire: DestinataireDTO;
    zone?: ZoneDTO;
    produits?: ColisProduitDTO[];
}
