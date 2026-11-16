
const express = require('express');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// RF02 - Listar todas as manutenções
app.get('/manutencoes', async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM manutencoes ORDER BY id'
        );

        res.json(resultado.rows);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ erro: 'Erro ao consultar manutenções.' });
    }
});

// RF03 - Consultar uma manutenção pelo ID
app.get('/manutencoes/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            'SELECT * FROM manutencoes WHERE id = $1',
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Manutenção não encontrada.'
            });
        }

        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ erro: 'Erro ao consultar manutenção.' });
    }
});

// RF01 - Cadastrar uma manutenção
app.post('/manutencoes', async (req, res) => {
    try {
        const {
            titulo,
            local_manutencao,
            descricao,
            status,
            data_prevista
        } = req.body;

        if (!titulo || !local_manutencao) {
            return res.status(400).json({
                erro: 'Título e local são obrigatórios.'
            });
        }

        const resultado = await pool.query(
            `INSERT INTO manutencoes
            (titulo, local_manutencao, descricao, status, data_prevista)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                titulo,
                local_manutencao,
                descricao || null,
                status || 'Pendente',
                data_prevista || null
            ]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ erro: 'Erro ao cadastrar manutenção.' });
    }
});

// RF04 - Editar uma manutenção
app.put('/manutencoes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            titulo,
            local_manutencao,
            descricao,
            status,
            data_prevista
        } = req.body;

        if (!titulo || !local_manutencao) {
            return res.status(400).json({
                erro: 'Título e local são obrigatórios.'
            });
        }

        const resultado = await pool.query(
            `UPDATE manutencoes
             SET titulo = $1,
                 local_manutencao = $2,
                 descricao = $3,
                 status = $4,
                 data_prevista = $5
             WHERE id = $6
             RETURNING *`,
            [
                titulo,
                local_manutencao,
                descricao || null,
                status || 'Pendente',
                data_prevista || null,
                id
            ]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Manutenção não encontrada.'
            });
        }

        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ erro: 'Erro ao editar manutenção.' });
    }
});

// RF05 - Excluir uma manutenção
app.delete('/manutencoes/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            'DELETE FROM manutencoes WHERE id = $1 RETURNING *',
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Manutenção não encontrada.'
            });
        }

        res.json({
            mensagem: 'Manutenção excluída com sucesso.'
        });
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ erro: 'Erro ao excluir manutenção.' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando em http://localhost:${PORT}`);
});
