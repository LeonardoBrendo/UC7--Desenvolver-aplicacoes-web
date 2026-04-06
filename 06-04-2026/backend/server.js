const express = require('express');
const cors = require('cors');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ============= ROTAS DO FRONTEND =============

// Rota principal - redireciona para o login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));
});

// Rota para páginas específicas
app.get('/pages/:page', (req, res) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, `../frontend/pages/${page}`);
    res.sendFile(filePath);
});

// Rota para arquivos CSS
app.get('/css/:file', (req, res) => {
    const file = req.params.file;
    res.sendFile(path.join(__dirname, `../frontend/css/${file}`));
});

// Rota para arquivos JS
app.get('/js/:file', (req, res) => {
    const file = req.params.file;
    res.sendFile(path.join(__dirname, `../frontend/js/${file}`));
});

// ============= CRUD ENDPOINTS =============

// 1. GET - Listar todos os carros
app.get('/api/carros', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM carros ORDER BY id DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar carros:', error);
        res.status(500).json({ error: 'Erro interno ao buscar carros' });
    }
});

// 2. GET - Buscar um carro por ID
app.get('/api/carros/:id', async (req, res) => {
    const { id } = req.params;
    
    // Validação do ID
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    
    try {
        const result = await db.query('SELECT * FROM carros WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Carro não encontrado' });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar carro:', error);
        res.status(500).json({ error: 'Erro interno ao buscar carro' });
    }
});

// 3. POST - Criar um novo carro
app.post('/api/carros', async (req, res) => {
    const { nome, marca, preco, ano } = req.body;
    
    // Validações detalhadas
    const errors = [];
    
    if (!nome || nome.trim() === '') {
        errors.push('Nome é obrigatório');
    } else if (nome.length > 100) {
        errors.push('Nome deve ter no máximo 100 caracteres');
    }
    
    if (!marca || marca.trim() === '') {
        errors.push('Marca é obrigatória');
    } else if (marca.length > 100) {
        errors.push('Marca deve ter no máximo 100 caracteres');
    }
    
    if (!preco && preco !== 0) {
        errors.push('Preço é obrigatório');
    } else if (isNaN(preco) || preco <= 0) {
        errors.push('Preço deve ser um número maior que zero');
    }
    
    if (!ano && ano !== 0) {
        errors.push('Ano é obrigatório');
    } else if (isNaN(ano) || ano < 1900 || ano > new Date().getFullYear() + 1) {
        errors.push(`Ano deve estar entre 1900 e ${new Date().getFullYear() + 1}`);
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ error: errors.join(', ') });
    }
    
    try {
        const result = await db.query(
            `INSERT INTO carros (nome, marca, preco, ano) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [nome.trim(), marca.trim(), parseFloat(preco), parseInt(ano)]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar carro:', error);
        res.status(500).json({ error: 'Erro interno ao criar carro' });
    }
});

// 4. PUT - Atualizar um carro completo
app.put('/api/carros/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, marca, preco, ano } = req.body;
    
    // Validação do ID
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    
    // Validações dos dados
    const errors = [];
    
    if (!nome || nome.trim() === '') {
        errors.push('Nome é obrigatório');
    } else if (nome.length > 100) {
        errors.push('Nome deve ter no máximo 100 caracteres');
    }
    
    if (!marca || marca.trim() === '') {
        errors.push('Marca é obrigatória');
    } else if (marca.length > 100) {
        errors.push('Marca deve ter no máximo 100 caracteres');
    }
    
    if (!preco && preco !== 0) {
        errors.push('Preço é obrigatório');
    } else if (isNaN(preco) || preco <= 0) {
        errors.push('Preço deve ser um número maior que zero');
    }
    
    if (!ano && ano !== 0) {
        errors.push('Ano é obrigatório');
    } else if (isNaN(ano) || ano < 1900 || ano > new Date().getFullYear() + 1) {
        errors.push(`Ano deve estar entre 1900 e ${new Date().getFullYear() + 1}`);
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ error: errors.join(', ') });
    }
    
    try {
        const result = await db.query(
            `UPDATE carros 
             SET nome = $1, marca = $2, preco = $3, ano = $4 
             WHERE id = $5 
             RETURNING *`,
            [nome.trim(), marca.trim(), parseFloat(preco), parseInt(ano), id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Carro não encontrado' });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar carro:', error);
        res.status(500).json({ error: 'Erro interno ao atualizar carro' });
    }
});

// 5. DELETE - Deletar um carro
app.delete('/api/carros/:id', async (req, res) => {
    const { id } = req.params;
    
    // Validação do ID
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    
    try {
        const result = await db.query(
            'DELETE FROM carros WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Carro não encontrado' });
        }
        
        res.status(200).json({ 
            message: 'Carro deletado com sucesso',
            carro: result.rows[0]
        });
    } catch (error) {
        console.error('Erro ao deletar carro:', error);
        res.status(500).json({ error: 'Erro interno ao deletar carro' });
    }
});

// ============= ROTA PARA PÁGINA NÃO ENCONTRADA =============
app.use('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../frontend/pages/login.html'));
});

// ============= MIDDLEWARE DE ERRO GLOBAL =============
app.use((err, req, res, next) => {
    console.error('Erro global:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// ============= INICIAR SERVIDOR =============
app.listen(PORT, () => {
    console.log('\n=================================');
    console.log('🚀 SERVIDOR INICIADO COM SUCESSO!');
    console.log('=================================');
    console.log(`📡 Servidor: http://localhost:${PORT}`);
    console.log(`🎨 Frontend: http://localhost:${PORT}`);
    console.log(`🔌 API: http://localhost:${PORT}/api/carros`);
    console.log(`📋 Login: http://localhost:${PORT}/pages/login.html`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/pages/dashboard.html`);
    console.log('=================================\n');
});