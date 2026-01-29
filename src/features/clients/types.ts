export interface ClientExpediteur {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    ville: string;
    codePostal?: string;
    entreprise?: string;
    utilisateurId?: string; // If linked to a User
}
