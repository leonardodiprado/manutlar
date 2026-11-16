
-- ManutLar
-- Script de criação da tabela de manutenções
-- Execute este script dentro do banco manutlar.

CREATE TABLE IF NOT EXISTS manutencoes (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    local_manutencao VARCHAR(100) NOT NULL,
    descricao TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Pendente',
    data_prevista DATE
);
