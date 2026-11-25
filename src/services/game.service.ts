import {CreateGameInput, Game} from '../models/game.model.js';
import {gameRepository} from '../repositories/game.repository.js';

export class HttpError extends Error {
    status: number;
    details?: string[];

    constructor(status: number, message: string, details?: string[]) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

function parseId(rawId: string): number {
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0 || String(id) !== rawId) {
        throw new HttpError(400, 'Identifiant invalide');
    }
    return id;
}

function validateGameInput(body: any): CreateGameInput {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        throw new HttpError(400, 'Données invalides', ['Le corps de la requête doit être un objet JSON']);
    }

    const details: string[] = [];

    if (typeof body.title !== 'string' || body.title.trim() === '') {
        details.push('Le titre est obligatoire');
    }

    if (typeof body.editor !== 'string' || body.editor.trim() === '') {
        details.push("L'éditeur est obligatoire");
    }

    if (typeof body.genre !== 'string' || body.genre.trim() === '') {
        details.push('Le genre est obligatoire');
    }

    if (!Number.isInteger(body.releaseYear) || body.releaseYear < 1950 || body.releaseYear > 2100) {
        details.push("L'année de sortie doit être un entier entre 1950 et 2100");
    }

    if (typeof body.rating !== 'number' || Number.isNaN(body.rating) || body.rating < 0 || body.rating > 10) {
        details.push('La note doit être comprise entre 0 et 10');
    }

    if (details.length > 0) {
        throw new HttpError(400, 'Données invalides', details);
    }

    return {
        title: body.title.trim(),
        editor: body.editor.trim(),
        releaseYear: body.releaseYear,
        genre: body.genre.trim(),
        rating: body.rating,
    };
}

export const gameService = {
    getAll(): Game[] {
        return gameRepository.findAll();
    },

    getById(rawId: string): Game {
        const id = parseId(rawId);
        const game = gameRepository.findById(id);
        if (!game) {
            throw new HttpError(404, 'Jeu introuvable');
        }
        return game;
    },

    create(body: any): Game {
        const input = validateGameInput(body);
        return gameRepository.create(input);
    },

    update(rawId: string, body: any): Game {
        const id = parseId(rawId);
        const existing = gameRepository.findById(id);
        if (!existing) {
            throw new HttpError(404, 'Jeu introuvable');
        }

        const input = validateGameInput(body);
        const updated = gameRepository.update(id, input);
        if (!updated) {
            throw new HttpError(404, 'Jeu introuvable');
        }
        return updated;
    },

    delete(rawId: string): void {
        const id = parseId(rawId);
        const deleted = gameRepository.delete(id);
        if (!deleted) {
            throw new HttpError(404, 'Jeu introuvable');
        }
    },
};
