
const formulario = document.getElementById('form-manutencao');
const lista = document.getElementById('lista-manutencoes');
const campoId = document.getElementById('manutencao-id');
const botaoSalvar = document.getElementById('botao-salvar');
const botaoCancelar = document.getElementById('botao-cancelar');
const tituloFormulario = document.getElementById('titulo-formulario');

let manutencoes = [];

// Converte a data recebida do banco para AAAA-MM-DD
function formatarDataCampo(data) {
    if (!data) return '';
    return String(data).substring(0, 10);
}

// Converte AAAA-MM-DD para DD/MM/AAAA
function formatarDataTela(data) {
    const valor = formatarDataCampo(data);

    if (!valor) return '-';

    const [ano, mes, dia] = valor.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Limpa a tela de cadastro ou edição
function limparFormulario() {
    formulario.reset();
    campoId.value = '';
    tituloFormulario.textContent = 'Cadastrar manutenção';
    botaoSalvar.textContent = 'Cadastrar manutenção';
    botaoCancelar.hidden = true;
}

// Busca as manutenções no servidor
async function carregarManutencoes() {
    try {
        const resposta = await fetch('/manutencoes');

        if (!resposta.ok) {
            throw new Error('Não foi possível consultar as manutenções.');
        }

        manutencoes = await resposta.json();
        lista.replaceChildren();

        if (manutencoes.length === 0) {
            const linha = lista.insertRow();
            const celula = linha.insertCell();
            celula.colSpan = 5;
            celula.textContent = 'Nenhuma manutenção cadastrada.';
            return;
        }

        manutencoes.forEach(manutencao => {
            const linha = lista.insertRow();

            const valores = [
                manutencao.titulo,
                manutencao.local_manutencao,
                manutencao.status,
                formatarDataTela(manutencao.data_prevista)
            ];

            valores.forEach(valor => {
                linha.insertCell().textContent = valor || '-';
            });

            const acoes = linha.insertCell();

            criarBotao(acoes, 'Visualizar', () => {
                visualizarManutencao(manutencao.id);
            });

            criarBotao(acoes, 'Editar', () => {
                editarManutencao(manutencao.id);
            });

            criarBotao(acoes, 'Excluir', () => {
                excluirManutencao(manutencao.id);
            }, 'excluir');
        });

    } catch (erro) {
        alert(erro.message);
    }
}

// Cria os botões de cada registro da tabela
function criarBotao(container, texto, acao, classe = '') {
    const botao = document.createElement('button');

    botao.type = 'button';
    botao.textContent = texto;
    botao.className = `acao ${classe}`.trim();
    botao.addEventListener('click', acao);

    container.appendChild(botao);
}

// RF03 - Visualizar detalhes de uma manutenção
async function visualizarManutencao(id) {
    try {
        const resposta = await fetch(`/manutencoes/${id}`);

        if (!resposta.ok) {
            throw new Error('Não foi possível consultar a manutenção.');
        }

        const m = await resposta.json();

        alert(
            `Título: ${m.titulo}\n` +
            `Local: ${m.local_manutencao}\n` +
            `Descrição: ${m.descricao || '-'}\n` +
            `Status: ${m.status}\n` +
            `Data prevista: ${formatarDataTela(m.data_prevista)}`
        );

    } catch (erro) {
        alert(erro.message);
    }
}

// RF04 - Preencher formulário para edição
async function editarManutencao(id) {
    try {
        const resposta = await fetch(`/manutencoes/${id}`);

        if (!resposta.ok) {
            throw new Error('Não foi possível carregar a manutenção.');
        }

        const m = await resposta.json();

        campoId.value = m.id;
        document.getElementById('titulo').value = m.titulo;
        document.getElementById('local').value = m.local_manutencao;
        document.getElementById('descricao').value = m.descricao || '';
        document.getElementById('status').value = m.status;
        document.getElementById('data').value =
            formatarDataCampo(m.data_prevista);

        tituloFormulario.textContent = 'Editar manutenção';
        botaoSalvar.textContent = 'Salvar alterações';
        botaoCancelar.hidden = false;

        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (erro) {
        alert(erro.message);
    }
}

// RF01 e RF04 - Cadastrar ou atualizar uma manutenção
formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const id = campoId.value;

    const dados = {
        titulo: document.getElementById('titulo').value.trim(),
        local_manutencao: document.getElementById('local').value.trim(),
        descricao: document.getElementById('descricao').value.trim(),
        status: document.getElementById('status').value,
        data_prevista: document.getElementById('data').value || null
    };

    const endereco = id ? `/manutencoes/${id}` : '/manutencoes';
    const metodo = id ? 'PUT' : 'POST';

    try {
        const resposta = await fetch(endereco, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            throw new Error('Não foi possível salvar a manutenção.');
        }

        alert(id ? 'Manutenção atualizada!' : 'Manutenção cadastrada!');

        limparFormulario();
        await carregarManutencoes();

    } catch (erro) {
        alert(erro.message);
    }
});

// RF05 - Excluir uma manutenção
async function excluirManutencao(id) {
    const confirmar = confirm('Deseja realmente excluir esta manutenção?');

    if (!confirmar) return;

    try {
        const resposta = await fetch(`/manutencoes/${id}`, {
            method: 'DELETE'
        });

        if (!resposta.ok) {
            throw new Error('Não foi possível excluir a manutenção.');
        }

        alert('Manutenção excluída com sucesso!');

        if (campoId.value === String(id)) {
            limparFormulario();
        }

        await carregarManutencoes();

    } catch (erro) {
        alert(erro.message);
    }
}

botaoCancelar.addEventListener('click', limparFormulario);

// Carrega a lista assim que a página é aberta
carregarManutencoes();
