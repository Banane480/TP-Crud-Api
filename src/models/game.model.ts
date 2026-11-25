/**
 * Représente un jeu vidéo enregistré en base de données.
 */
export class Game {
    id: number;
    title: string;
    editor: string;
    releaseYear: number;
    genre: string;
    rating: number;

    constructor(
        id: number,
        title: string,
        editor: string,
        releaseYear: number,
        genre: string,
        rating: number
    ) {
        this.id = id;
        this.title = title;
        this.editor = editor;
        this.releaseYear = releaseYear;
        this.genre = genre;
        this.rating = rating;
    }
}

/**
 * Données attendues pour créer ou modifier un jeu vidéo (sans l'identifiant généré par SQLite).
 */
export interface CreateGameInput {
    title: string;
    editor: string;
    releaseYear: number;
    genre: string;
    rating: number;
}
