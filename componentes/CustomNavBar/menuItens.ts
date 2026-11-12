// Fonte única do menu horizontal. Para incluir/alterar uma opção, edite aqui.
// - "href" na categoria: o título é um link; sem "href" o título só abre o dropdown.
// - Itens com href "#" ainda não têm página.

export type MenuSubItem = {
    rotulo: string
    href: string
}

export type MenuCategoria = {
    rotulo: string
    href?: string
    itens?: MenuSubItem[] // sem itens = link simples, sem dropdown
}

export const categoriasMenu: MenuCategoria[] = [
    {
        rotulo: 'Quem Somos',
        href: '/sobrenos',
        itens: [
            { rotulo: 'Sobre o Projeto', href: '/projeto' },
            { rotulo: 'Sobre o DPBEA', href: '/sobrenos' },
            { rotulo: 'Estrutura e Equipe', href: '/quem-somos/estrutura-e-equipe' },
            { rotulo: 'Nossos Mascotes Sol e Lua', href: '/quem-somos/mascotes-sol-e-lua' },
            { rotulo: 'Notícias e Eventos', href: '/quem-somos/noticias-e-eventos' },
            { rotulo: 'Seja Voluntário', href: '/quem-somos/seja-voluntario' },
            { rotulo: 'Perguntas Frequentes', href: '/quem-somos/perguntas-frequentes' },
        ],
    },
    {
        rotulo: 'Adoção Responsável',
        href: '/adocao-responsavel',
        itens: [
            { rotulo: 'Como Adotar', href: '/adocao-responsavel#adocao' },
            { rotulo: 'Quiz: encontre seu pet ideal', href: '/filtro' },
            { rotulo: 'Animais para Adoção', href: '/meetinpet' },
            { rotulo: 'Lar Temporário', href: '/adocao-responsavel#lar-temporario' },
            { rotulo: 'Festa do Pijama', href: '/adocao-responsavel#festa-do-pijama' },
            { rotulo: 'Passeio Divertido', href: '/adocao-responsavel#passeio' },
        ],
    },
    {
        rotulo: 'Pets Perdidos e Encontrados',
        href: '/adote',
        itens: [
            { rotulo: 'Perdi Meu Pet', href: '/adote' },
            { rotulo: 'Encontrei um Pet', href: '/registro-pet-encontrado' },
            { rotulo: 'Mapa Interativo da Região', href: '/mapa' },
            { rotulo: 'Gerenciamento de Pets', href: '#' },
        ],
    },
    {
        rotulo: 'Banco de Ração',
        href: '/racao',
        itens: [
            { rotulo: 'Sou Doador', href: '/racao' },
            { rotulo: 'Solicitar Doação', href: '/racao' },
            { rotulo: 'Transparência das Doações', href: '#' },
        ],
    },
    {
        rotulo: 'Assistência Veterinária',
        itens: [
            { rotulo: 'Atendimento Clínico', href: '/assistencia-veterinaria/atendimento-clinico' },
            { rotulo: 'Castração Gratuita', href: '/assistencia-veterinaria/castracao-gratuita' },
            { rotulo: 'Mutirões de Castração', href: '/assistencia-veterinaria/mutiroes-de-castracao' },
            { rotulo: 'Vacinação Antirrábica', href: '/assistencia-veterinaria/vacinacao-antirrabica' },
            { rotulo: 'Microchip e Registro do Pet', href: '/assistencia-veterinaria/microchip-e-registro' },
            { rotulo: 'Clínicas Credenciadas', href: '/assistencia-veterinaria/clinicas-credenciadas' },
        ],
    },
]

// Acesso para qualquer pessoa (ex.: solicitar adoção). O painel administrativo
// (/menuAdm) é só para quem tem perfil de administrador, depois do login.
export const itemEntrar = {
    rotulo: 'Login / Cadastro',
    href: '/login',
}

// Menu da área administrativa (/Admin). Mesmo layout/estilo do menu da home;
// itens sem "itens" são links simples, sem dropdown.
export const categoriasAdmin: MenuCategoria[] = [
    {
        rotulo: 'Cadastro',
        itens: [
            { rotulo: 'Cadastro de Animais', href: '/Admin/cadastro-animais' },
            { rotulo: 'Cadastro de Vacinas', href: '/Admin/cadastro-vacinas' },
            { rotulo: 'Cadastro de Banners', href: '/Admin/cadastro-banners' },
        ],
    },
    { rotulo: 'Lista de Animais', href: '/Admin/lista-animais' },
    { rotulo: 'Lista de Vacinas', href: '/Admin/lista-vacinas' },
    { rotulo: 'Lista de Banners', href: '/Admin/lista-banners' },
    { rotulo: 'Saída de Animais', href: '/Admin/saida-animais' },
    { rotulo: 'Adotantes', href: '/Admin/adotantes' },
    { rotulo: 'Adestradores', href: '/Admin/adestradores' },
    {
        rotulo: 'Solicitações',
        itens: [
            { rotulo: 'Solicitações de Eventos', href: '/Admin/solicitacoes-simples' },
            { rotulo: 'Solicitações de Adoção', href: '/Admin/solicitacoes-adocao' },
        ],
    },
]
