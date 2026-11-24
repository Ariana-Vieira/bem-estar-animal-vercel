// =============================================================================
// DOCUMENTAÇÃO DA API (Swagger / OpenAPI 3)
// Este arquivo só DESCREVE as rotas do servidor (index_ProjIn.js); não muda o
// comportamento da API. A página /docs lê esta descrição e mostra as rotas com
// um botão "Try it out" para testar.
// Para documentar uma rota nova: acrescente um bloco em "paths" abaixo.
// =============================================================================

// ---- pedacinhos reutilizados (para não repetir) ----
const idNaUrl = (nome) => ({
    name: "id", in: "path", required: true, schema: { type: "integer" }, description: `ID ${nome}`
});

const ok = (descricao) => ({ description: descricao });
const naoEncontrado = { description: "Registro não encontrado" };
const erroServidor = { description: "Erro interno no servidor" };

const corpoJson = (propriedades, obrigatorios = []) => ({
    required: true,
    content: { "application/json": { schema: { type: "object", required: obrigatorios, properties: propriedades } } }
});

// Rotas com imagem usam multipart/form-data (formulário com arquivo)
const corpoFormulario = (propriedades, obrigatorios = []) => ({
    required: true,
    content: { "multipart/form-data": { schema: { type: "object", required: obrigatorios, properties: propriedades } } }
});

const texto = { type: "string" };
const numero = { type: "integer" };
const data = { type: "string", format: "date", example: "2026-01-31" };
const arquivo = { type: "string", format: "binary" };

// Campos do animal (o formulário envia as fotos junto)
const camposAnimal = {
    nome: texto, rg: texto, tipo: { ...texto, example: "cachorro" }, porte: { ...texto, example: "grande" },
    raca: texto, idade: texto, faixaIdade: texto, sexo: texto, status: texto,
    fotoPrincipal: { ...texto, description: "Nome da foto que será a principal" },
    fotos: { type: "array", items: arquivo, description: "Até 3 fotos" }
};

// Campos da vacina / lote
const camposVacina = {
    nome: texto, descricao: texto, especie: texto, tipo: texto, fabricante: texto, lote: texto,
    dataFabricacao: data, dataValidade: data, quantidadeRecebida: numero, dataEntrada: data,
    responsavel: texto, fornecedor: texto, notaFiscal: texto,
    valorUnitario: { type: "number" }, valorTotal: { type: "number" },
    temperatura: texto, localArmazenamento: texto
};

const camposBanner = {
    titulo: texto, subtitulo: texto, descricao: texto, textoBotao: texto,
    linkBotao: { ...texto, example: "/meetinpet" }, ordem: numero,
    ativo: { type: "boolean" }, dataInicio: data, dataFim: data,
    imagem: { ...arquivo, description: "Imagem JPG, PNG, WEBP ou GIF (até 4 MB)" }
};

const camposNoticia = {
    titulo: texto, resumo: texto, conteudo: texto, dataPublicacao: data,
    ativo: { type: "boolean" },
    imagem: { ...arquivo, description: "Imagem JPG, PNG, WEBP ou GIF (até 4 MB)" }
};

const camposUsuario = {
    nome: texto, email: { ...texto, format: "email" }, senha: texto, telefone: texto,
    cpf_cnpj: texto, tipo_pessoa: { ...texto, example: "F" }, data_nasc: data
};

const ativoNoCorpo = corpoJson({ ativo: { type: "boolean" } }, ["ativo"]);

// ---- a descrição completa ----
module.exports = {
    openapi: "3.0.3",
    info: {
        title: "API Bem-Estar Animal - Votorantim",
        version: "1.0.0",
        description:
            "API do Projeto Integrador (Fatec Votorantim) para o Meetin'Pet e o portal do Departamento de " +
            "Proteção e Bem-Estar Animal. Gerencia animais, vacinas, banners, notícias e usuários."
    },
    servers: [
        { url: "https://bem-estar-animal-api.vercel.app", description: "Produção (Vercel)" },
        { url: "http://localhost:3010", description: "Local" }
    ],
    tags: [
        { name: "Animais" }, { name: "Vacinas" }, { name: "Banners" },
        { name: "Notícias" }, { name: "Usuários" }
    ],
    paths: {
        // ---------- ANIMAIS ----------
        "/animais": {
            get: { tags: ["Animais"], summary: "Lista os animais", responses: { 200: ok("Lista de animais"), 500: erroServidor } }
        },
        "/qtd": {
            get: { tags: ["Animais"], summary: "Quantidade de animais cadastrados", responses: { 200: ok("{ qtd: número }"), 500: erroServidor } }
        },
        "/INSERT": {
            post: {
                tags: ["Animais"], summary: "Cadastra um animal (com até 3 fotos)",
                requestBody: corpoFormulario(camposAnimal, ["nome"]),
                responses: { 200: ok("Animal cadastrado"), 500: erroServidor }
            }
        },
        "/animais/{id}": {
            get: { tags: ["Animais"], summary: "Busca um animal pelo ID", parameters: [idNaUrl("do animal")], responses: { 200: ok("Dados do animal"), 404: naoEncontrado, 500: erroServidor } },
            put: {
                tags: ["Animais"], summary: "Atualiza um animal", parameters: [idNaUrl("do animal")],
                requestBody: corpoFormulario(camposAnimal),
                responses: { 200: ok("Animal atualizado"), 404: naoEncontrado, 500: erroServidor }
            },
            delete: { tags: ["Animais"], summary: "Remove um animal", parameters: [idNaUrl("do animal")], responses: { 200: ok("Animal removido"), 404: naoEncontrado, 500: erroServidor } }
        },

        // ---------- VACINAS ----------
        "/vacinas": {
            get: { tags: ["Vacinas"], summary: "Lista as vacinas (com dados do lote)", responses: { 200: ok("Lista de vacinas"), 500: erroServidor } }
        },
        "/qtdvacinas": {
            get: { tags: ["Vacinas"], summary: "Quantidade de vacinas cadastradas", responses: { 200: ok("Quantidade"), 500: erroServidor } }
        },
        "/addvacina": {
            post: {
                tags: ["Vacinas"], summary: "Cadastra uma vacina com o seu lote",
                requestBody: corpoJson(camposVacina, ["nome"]),
                responses: { 200: ok("Vacina cadastrada"), 500: erroServidor }
            }
        },
        "/vacinas/{id}": {
            put: {
                tags: ["Vacinas"], summary: "Atualiza uma vacina", parameters: [idNaUrl("da vacina")],
                requestBody: corpoJson(camposVacina),
                responses: { 200: ok("Vacina atualizada"), 404: naoEncontrado, 500: erroServidor }
            },
            delete: { tags: ["Vacinas"], summary: "Remove uma vacina", parameters: [idNaUrl("da vacina")], responses: { 200: ok("Vacina removida"), 404: naoEncontrado, 500: erroServidor } }
        },

        // ---------- BANNERS ----------
        "/banners": {
            get: { tags: ["Banners"], summary: "Lista todos os banners (Admin)", responses: { 200: ok("Lista de banners"), 500: erroServidor } },
            post: {
                tags: ["Banners"], summary: "Cadastra um banner (com imagem)",
                requestBody: corpoFormulario(camposBanner, ["titulo", "imagem"]),
                responses: { 201: ok("Banner cadastrado"), 400: ok("Dados inválidos"), 500: erroServidor }
            }
        },
        "/banners/ativos": {
            get: { tags: ["Banners"], summary: "Banners ativos e dentro do período (usados na home)", responses: { 200: ok("Lista de banners"), 500: erroServidor } }
        },
        "/banners/{id}": {
            get: { tags: ["Banners"], summary: "Busca um banner", parameters: [idNaUrl("do banner")], responses: { 200: ok("Dados do banner"), 404: naoEncontrado, 500: erroServidor } },
            put: {
                tags: ["Banners"], summary: "Atualiza um banner", parameters: [idNaUrl("do banner")],
                requestBody: corpoFormulario(camposBanner, ["titulo"]),
                responses: { 200: ok("Banner atualizado"), 400: ok("Dados inválidos"), 404: naoEncontrado, 500: erroServidor }
            },
            delete: { tags: ["Banners"], summary: "Exclui um banner", parameters: [idNaUrl("do banner")], responses: { 200: ok("Banner excluído"), 404: naoEncontrado, 500: erroServidor } }
        },
        "/banners/{id}/ativo": {
            put: { tags: ["Banners"], summary: "Liga ou desliga um banner", parameters: [idNaUrl("do banner")], requestBody: ativoNoCorpo, responses: { 200: ok("Banner atualizado"), 404: naoEncontrado, 500: erroServidor } }
        },

        // ---------- NOTÍCIAS ----------
        "/noticias": {
            get: { tags: ["Notícias"], summary: "Lista todas as notícias (Admin)", responses: { 200: ok("Lista de notícias"), 500: erroServidor } },
            post: {
                tags: ["Notícias"], summary: "Cadastra uma notícia (com imagem opcional)",
                requestBody: corpoFormulario(camposNoticia, ["titulo", "dataPublicacao"]),
                responses: { 201: ok("Notícia cadastrada"), 400: ok("Dados inválidos"), 500: erroServidor }
            }
        },
        "/noticias/ativas": {
            get: { tags: ["Notícias"], summary: "Notícias ativas e já publicadas (usadas no site)", responses: { 200: ok("Lista de notícias"), 500: erroServidor } }
        },
        "/noticias/{id}": {
            get: { tags: ["Notícias"], summary: "Busca uma notícia", parameters: [idNaUrl("da notícia")], responses: { 200: ok("Dados da notícia"), 404: naoEncontrado, 500: erroServidor } },
            put: {
                tags: ["Notícias"], summary: "Atualiza uma notícia", parameters: [idNaUrl("da notícia")],
                requestBody: corpoFormulario(camposNoticia, ["titulo", "dataPublicacao"]),
                responses: { 200: ok("Notícia atualizada"), 400: ok("Dados inválidos"), 404: naoEncontrado, 500: erroServidor }
            },
            delete: { tags: ["Notícias"], summary: "Exclui uma notícia", parameters: [idNaUrl("da notícia")], responses: { 200: ok("Notícia excluída"), 404: naoEncontrado, 500: erroServidor } }
        },
        "/noticias/{id}/ativo": {
            put: { tags: ["Notícias"], summary: "Liga ou desliga uma notícia", parameters: [idNaUrl("da notícia")], requestBody: ativoNoCorpo, responses: { 200: ok("Notícia atualizada"), 404: naoEncontrado, 500: erroServidor } }
        },

        // ---------- USUÁRIOS ----------
        "/login": {
            post: {
                tags: ["Usuários"], summary: "Login do usuário",
                requestBody: corpoJson({ email: { ...texto, format: "email" }, senha: texto }, ["email", "senha"]),
                responses: { 200: ok("Dados do usuário e suas permissões"), 400: ok("E-mail e senha são obrigatórios"), 401: ok("E-mail ou senha incorretos"), 500: erroServidor }
            }
        },
        "/usuarios": {
            post: {
                tags: ["Usuários"], summary: "Cadastra um usuário (a senha é guardada com hash)",
                requestBody: corpoJson(camposUsuario, ["nome", "email", "senha"]),
                responses: { 201: ok("Usuário cadastrado"), 400: ok("Dados obrigatórios faltando"), 409: ok("E-mail já cadastrado"), 500: erroServidor }
            }
        },
        "/usuarios/{id}": {
            put: {
                tags: ["Usuários"], summary: "Atualiza um usuário", parameters: [idNaUrl("do usuário")],
                requestBody: corpoJson({ ...camposUsuario, status: { ...texto, example: "A" } }),
                responses: { 200: ok("Usuário atualizado"), 404: naoEncontrado, 500: erroServidor }
            },
            delete: { tags: ["Usuários"], summary: "Remove um usuário", parameters: [idNaUrl("do usuário")], responses: { 200: ok("Usuário removido"), 404: naoEncontrado, 500: erroServidor } }
        },
        "/usuarios/{id}/permissoes": {
            get: { tags: ["Usuários"], summary: "Permissões do usuário", parameters: [idNaUrl("do usuário")], responses: { 200: ok("Lista de permissões"), 500: erroServidor } }
        }
    }
};
