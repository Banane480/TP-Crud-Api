import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import {projectRoot} from '../config/paths.js';

const dbPath = path.join(projectRoot, 'src/database/game.db');
const schemaPath = path.join(projectRoot, 'src/database/schema.sql');

export const db = new Database(dbPath);
db.exec(fs.readFileSync(schemaPath, 'utf8'));
