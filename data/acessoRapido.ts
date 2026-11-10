// Dados do "Acesso Rápido" da home.

// Nome com que as páginas visitadas ficam guardadas no navegador (localStorage)
export const CHAVE_VISITAS = 'paginasVisitadas'

// Quantas páginas visitadas guardamos no máximo
export const MAX_VISITAS = 8

export type CartaoAtalho = {
    titulo: string
    descricao: string
    link: string
    icone: string // nome do ícone do Material Symbols
    girar?: boolean // true = gira o ícone 90 graus (o osso do Banco de Ração)
}

// Os 4 cartões que aparecem na PRIMEIRA vez que a pessoa entra no site.
// Foram escolhidos por serem os serviços mais procurados pelo público e por já terem página.
// Conforme ela visita outras páginas, esses cartões vão sendo substituídos pelas páginas visitadas.
export const cartoesIniciais: CartaoAtalho[] = [
    {
        titulo: 'Adote',
        descricao: 'Veja como adotar seu novo amigo',
        link: '/adocao-responsavel',
        icone: 'family_home',
    },
    {
        titulo: 'Pets Perdidos',
        descricao: 'Registre ou procure um animal',
        link: '/adote',
        icone: 'search',
    },
    {
        titulo: 'Castração',
        descricao: 'Solicite a castração gratuita',
        link: '/assistencia-veterinaria/castracao-gratuita',
        icone: 'medical_services',
    },
    {
        titulo: 'Banco de Ração',
        descricao: 'Solicite ou doe ração',
        link: '/racao',
        icone: 'humerus',
        girar: true,
    },
]
