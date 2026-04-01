const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// ============= CRUD Endpoints =============

// 1. GET - Listar todos os carros
app.get('/api/carros', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM carros ORDER BY id');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar carros:', error);
        res.status(500).json({ error: 'Erro ao buscar carros' });
    }
});

// 2. GET - Buscar um carro por ID
app.get('/api/carros/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM carros WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Carro não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar carro:', error);
        res.status(500).json({ error: 'Erro ao buscar carro' });
    }
});

// 3. POST - Criar um novo carro
app.post('/api/carros', async (req, res) => {
    const { nome, marca, preco, ano } = req.body;
    
    // Validação básica
    if (!nome || !marca || !preco || !ano) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    try {
        const result = await db.query(
            'INSERT INTO carros (nome, marca, preco, ano) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, marca, preco, ano]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar carro:', error);
        res.status(500).json({ error: 'Erro ao criar carro' });
    }
});

// 4. PUT - Atualizar um carro
app.put('/api/carros/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, marca, preco, ano } = req.body;
    
    try {
        const result = await db.query(
            'UPDATE carros SET nome = $1, marca = $2, preco = $3, ano = $4 WHERE id = $5 RETURNING *',
            [nome, marca, preco, ano, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Carro não encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar carro:', error);
        res.status(500).json({ error: 'Erro ao atualizar carro' });
    }
});

// 5. DELETE - Deletar um carro
app.delete('/api/carros/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await db.query('DELETE FROM carros WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Carro não encontrado' });
        }
        
        res.json({ message: 'Carro deletado com sucesso', carro: result.rows[0] });
    } catch (error) {
        console.error('Erro ao deletar carro:', error);
        res.status(500).json({ error: 'Erro ao deletar carro' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📋 Frontend: http://localhost:${PORT}`);
    console.log(`🔌 API: http://localhost:${PORT}/api/carros`);
});