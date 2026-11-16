# ManutLar — Controle de Manutenções Residenciais

## Descrição

O ManutLar é uma aplicação web desenvolvida para auxiliar no registro e acompanhamento de manutenções residenciais.

O sistema permite cadastrar, consultar, visualizar, editar e excluir registros de manutenção, armazenando as informações em um banco de dados PostgreSQL.

Projeto acadêmico desenvolvido para as disciplinas Projeto de Desenvolvimento de Software I e II.

**Autor:** Leonardo Dias Prado

**Instituição:** Centro Universitário Filadélfia — UniFil

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- PostgreSQL

## Funcionalidades

- Cadastrar uma manutenção residencial.
- Listar as manutenções cadastradas.
- Visualizar os detalhes de uma manutenção.
- Editar as informações e o status de uma manutenção.
- Excluir uma manutenção mediante confirmação.

## Como executar o projeto

### 1. Pré-requisitos

É necessário ter Node.js e PostgreSQL instalados.

### 2. Instalação das dependências

Na pasta do projeto, execute:

```bash
npm install
```

### 3. Configuração do banco de dados

Crie um banco PostgreSQL chamado `manutlar`.

Execute o arquivo `banco.sql` no banco criado.

Copie o arquivo `.env.example` para um novo arquivo chamado `.env` e preencha a senha e as demais configurações de conexão.

### 4. Iniciar o servidor

Execute:

```bash
node server.js
```

### 5. Acessar o sistema

Abra o navegador em:

http://localhost:3000

## Estrutura do projeto

- `public/index.html`: estrutura da interface.
- `public/style.css`: aparência da aplicação.
- `public/script.js`: funcionalidades da interface.
- `server.js`: servidor e rotas da API.
- `db.js`: conexão com o PostgreSQL.
- `banco.sql`: estrutura da tabela.
- `.env.example`: exemplo de configuração do banco.

## Considerações

O ManutLar foi desenvolvido como um projeto acadêmico de pequeno porte, com foco na implementação das operações CRUD e na integração entre uma interface web, um servidor e um banco de dados relacional.