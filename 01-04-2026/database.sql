-- -- Criar banco de dados
-- CREATE DATABASE crud_carros;

-- -- Conectar ao banco
-- \c crud_carros;

-- Criar tabela carros
CREATE TABLE carros (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    ano INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados de exemplo
INSERT INTO carros (nome, marca, preco, ano) VALUES
('Civic', 'Honda', 120000.00, 2023),
('Corolla', 'Toyota', 125000.00, 2023),
('Onix', 'Chevrolet', 75000.00, 2022),
('Fusion', 'Ford', 110000.00, 2022),
('HB20', 'Hyundai', 68000.00, 2023);