const { Pool } = require('pg');

// Configuração do banco de dados
const pool = new Pool({
    user: 'postgres',     // Seu usuário do PostgreSQL
    host: 'localhost',
    database: 'postgres',
    password: 'postgres', // Sua senha
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};