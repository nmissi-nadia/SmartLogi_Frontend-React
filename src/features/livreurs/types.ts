export interface Livreur {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    vehicule?: string;
    disponible: boolean;
    zoneId?: string;
    userId?: string;
}
