const Database = require('better-sqlite3');
const db = new Database('db/nyvia.db');

db.prepare("INSERT INTO users (id, email, password_hash, name) VALUES (1, 'teste@nyvia.com', 'hash123', 'Teste')").run();
db.prepare("INSERT INTO workspaces (id, user_id, name, description) VALUES (1, 1, 'Meu Cliente', 'Workspace de teste')").run();

console.log('✅ User e Workspace criados');
db.close();