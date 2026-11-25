import {db} from '../database/database.js';
import {CreateGameInput, Game} from '../models/game.model.js';

interface GameRow {
    id: number;
    title: string;
    editor: string;
    release_year: number;
    genre: string;
    rating: number;
}

function mapRowToGame(row: GameRow): Game {
    return new Game(
        row.id,
        row.title,
        row.editor,
        row.release_year,
        row.genre,
        row.rating
    );
}

const findAllStmt = db.prepare<[], GameRow>('SELECT * FROM games ORDER BY id ASC');
const findByIdStmt = db.prepare<[number], GameRow>('SELECT * FROM games WHERE id = ?');
const insertStmt = db.prepare<CreateGameInput>(
    'INSERT INTO games (title, editor, release_year, genre, rating) VALUES (@title, @editor, @releaseYear, @genre, @rating)'
);
const updateStmt = db.prepare<CreateGameInput & {id: number}>(
    'UPDATE games SET title = @title, editor = @editor, release_year = @releaseYear, genre = @genre, rating = @rating WHERE id = @id'
);
const deleteStmt = db.prepare<[number]>('DELETE FROM games WHERE id = ?');

/**
 * Gère les requêtes SQL liées à la table `games`.
 */
export const gameRepository = {
    findAll(): Game[] {
        const rows = findAllStmt.all();
        return rows.map(mapRowToGame);
    },

    findById(id: number): Game | undefined {
        const row = findByIdStmt.get(id);
        return row ? mapRowToGame(row) : undefined;
    },

    create(input: CreateGameInput): Game {
        const info = insertStmt.run(input);
        const created = findByIdStmt.get(Number(info.lastInsertRowid));
        if (!created) {
            throw new Error('Impossible de récupérer le jeu créé');
        }
        return mapRowToGame(created);
    },

    update(id: number, input: CreateGameInput): Game | undefined {
        const info = updateStmt.run({...input, id});
        if (info.changes === 0) {
            return undefined;
        }
        const updated = findByIdStmt.get(id);
        return updated ? mapRowToGame(updated) : undefined;
    },

    delete(id: number): boolean {
        const info = deleteStmt.run(id);
        return info.changes > 0;
    },
};
