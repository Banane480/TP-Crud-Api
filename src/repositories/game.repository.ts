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

function toGame(row: GameRow): Game {
    return new Game(
        row.id,
        row.title,
        row.editor,
        row.release_year,
        row.genre,
        row.rating
    );
}

export const gameRepository = {
    findAll(): Game[] {
        const rows = db.prepare('SELECT * FROM games ORDER BY id ASC').all() as GameRow[];
        return rows.map(toGame);
    },

    findById(id: number): Game | undefined {
        const row = db.prepare('SELECT * FROM games WHERE id = ?').get(id) as GameRow | undefined;
        if (!row) {
            return undefined;
        }
        return toGame(row);
    },

    create(input: CreateGameInput): Game {
        const stmt = db.prepare(
            'INSERT INTO games (title, editor, release_year, genre, rating) VALUES (@title, @editor, @releaseYear, @genre, @rating)'
        );
        const result = stmt.run(input);
        const id = Number(result.lastInsertRowid);

        return new Game(id, input.title, input.editor, input.releaseYear, input.genre, input.rating);
    },

    update(id: number, input: CreateGameInput): Game | undefined {
        const stmt = db.prepare(
            'UPDATE games SET title = @title, editor = @editor, release_year = @releaseYear, genre = @genre, rating = @rating WHERE id = @id'
        );
        const result = stmt.run({...input, id});

        if (result.changes === 0) {
            return undefined;
        }

        return new Game(id, input.title, input.editor, input.releaseYear, input.genre, input.rating);
    },

    delete(id: number): boolean {
        const result = db.prepare('DELETE FROM games WHERE id = ?').run(id);
        return result.changes > 0;
    },
};
