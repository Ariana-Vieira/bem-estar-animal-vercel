# 🐾 Meetin'Pet e Home Page do Departamento de Proteção e Bem-Estar Animal de Votorantim

Soluções web desenvolvidas para apoiar as ações do Departamento de Proteção e Bem-Estar Animal de Votorantim.

Projeto Integrador do 3º semestre de Desenvolvimento de Software Multiplataforma (DSM), Fatec Votorantim.
Disciplina: Desenvolvimento Web III.

## 👥 Integrantes

- Ariana Omura Vieira
- Fernanda Teresa Corrêa da Silva
- Gabriel Cândido Corrêa
- Jonatas Diego Marques

## 🔗 Links

- Aplicação (front-end): https://bem-estar-animal-votorantim.vercel.app
- API pública: https://bem-estar-animal-api.vercel.app
- Documentação da API (Swagger): https://bem-estar-animal-api.vercel.app/docs
- Repositório: https://github.com/Ariana-Vieira/bem-estar-animal-vercel

## 📋 Sobre o Projeto

O Meetin'Pet foi criado para auxiliar o Departamento de Proteção e Bem-Estar Animal de Votorantim na divulgação de animais disponíveis para adoção.

Além da plataforma de adoção, nossa equipe também foi responsável pelo desenvolvimento da Home do site do Departamento de Proteção e Bem-Estar Animal, criando uma identidade visual para os serviços oferecidos pelo departamento.

O objetivo do projeto é facilitar o acesso às informações dos animais, aumentar a visibilidade das campanhas de adoção e aproximar a comunidade das ações de proteção animal realizadas pelo município.

## 🌐 Portal do Departamento de Proteção e Bem-Estar Animal

Desenvolvimento da página inicial (Home) do portal institucional do Departamento de Proteção e Bem-Estar Animal de Votorantim, centralizando informações sobre:

- Adoção de animais
- Banco de ração
- Castração
- Educação e conscientização
- Serviços oferecidos pelo departamento
- Divulgação de notícias e campanhas

## 🐶 Meetin'Pet

Desenvolvimento da plataforma Meetin'Pet, voltada para a divulgação de animais disponíveis para adoção, conectando futuros adotantes aos animais acolhidos pelo município.

A solução busca facilitar o processo de adoção responsável por meio de uma interface moderna, intuitiva e acessível.

## 🎯 Objetivo Geral

Utilizar a tecnologia para ampliar a visibilidade dos serviços do Departamento de Proteção e Bem-Estar Animal e aumentar as oportunidades de adoção responsável dos animais acolhidos em Votorantim.

## 👨‍💻 Escopo da Equipe

Nossa equipe foi responsável pelo desenvolvimento de:

- Home do Portal do Departamento de Proteção e Bem-Estar Animal;
- Interface da plataforma Meetin'Pet;
- Listagem de animais para adoção;
- Sistema de filtros de busca;
- Estrutura visual e experiência do usuário (UI/UX);
- API REST integrada ao banco de dados, com área administrativa.

## 🛠️ Tecnologias Utilizadas

- React
- Next.js
- TypeScript
- HTML5
- CSS3
- Node.js e Express (API REST)
- SQL Server na Azure (banco de dados relacional)
- Vercel (hospedagem do site e da API)
- Figma
- Git/GitHub

## 🏗️ Arquitetura

O projeto é dividido em duas partes, cada uma hospedada na Vercel:

- **Front-end** (Next.js): páginas do portal, do Meetin'Pet e da área administrativa.
- **API REST** (Node.js/Express, pasta `Server`): recebe as requisições do front-end e acessa o banco de dados SQL Server.

Em produção, o front-end usa a API hospedada na Vercel, pelo endereço definido na variável de ambiente `NEXT_PUBLIC_API_URL`. Para rodar localmente, sem essa variável, ele usa `http://localhost:3010`.

## 📡 Rotas principais da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/animais` | Lista os animais |
| GET | `/animais/:id` | Busca um animal |
| POST | `/INSERT` | Cadastra um animal (com fotos) |
| PUT | `/animais/:id` | Atualiza um animal |
| DELETE | `/animais/:id` | Remove um animal |
| GET | `/vacinas` | Lista as vacinas |
| POST | `/addvacina` | Cadastra uma vacina |
| PUT | `/vacinas/:id` | Atualiza uma vacina |
| DELETE | `/vacinas/:id` | Remove uma vacina |
| GET | `/banners` | Lista os banners |
| POST | `/banners` | Cadastra um banner |
| PUT | `/banners/:id` | Atualiza um banner |
| DELETE | `/banners/:id` | Remove um banner |
| POST | `/usuarios` | Cadastra um usuário |
| PUT | `/usuarios/:id` | Atualiza um usuário |
| DELETE | `/usuarios/:id` | Remove um usuário |
| POST | `/login` | Login |

## ▶️ Como rodar localmente

```bash
npm install
npm run server   # API (porta 3010)
npm run dev      # front-end (porta 3000)
```

A API lê a conexão com o banco das variáveis de ambiente (veja `Server/database.js`).
