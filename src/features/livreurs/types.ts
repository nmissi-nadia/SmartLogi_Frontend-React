export interface Livreur {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    vehicule?: string;
    zoneId?: string;
    disponible: boolean;
}
