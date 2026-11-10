// Lista das páginas do site, usada pela barra de busca do topo (página /busca).
// Para uma página nova aparecer na busca, basta acrescentar um item aqui.
//   titulo     -> nome que aparece no resultado
//   descricao  -> frase curta que aparece abaixo do título
//   link       -> endereço da página
//   palavras   -> palavras que a pessoa pode digitar para achar essa página (sinônimos)
//   icone      -> ícone do cartão no Acesso Rápido da home (nomes em fonts.google.com/icons)
//   tituloCartao -> (opcional) título mais curto para o cartão, quando o título normal é muito longo

export type PaginaBusca = {
    titulo: string
    descricao: string
    link: string
    palavras: string
    icone: string // nome do ícone do Material Symbols (usado nos cartões do Acesso Rápido)
    tituloCartao?: string // título mais curto para o cartão (se o título normal for muito longo)
}

export const paginas: PaginaBusca[] = [
    // ----- Quem Somos -----
    {
        titulo: 'Sobre o DPBEA',
        descricao: 'Conheça o Departamento de Proteção e Bem-Estar Animal de Votorantim.',
        link: '/sobrenos',
        icone: 'info',
        palavras: 'quem somos departamento canil abrigo endereço contato telefone mapa localização',
    },
    {
        titulo: 'Sobre o Projeto',
        descricao: 'Projeto Bem-Estar Animal: módulos, objetivos e linha do tempo.',
        link: '/projeto',
        icone: 'lightbulb',
        palavras: 'fatec prefeitura projeto integrador módulos roadmap',
    },
    {
        titulo: 'Estrutura e Equipe',
        descricao: 'Parcerias, orientação técnica e equipe do departamento.',
        link: '/quem-somos/estrutura-e-equipe',
        icone: 'groups',
        palavras: 'equipe veterinária parceria secretaria meio ambiente organograma',
    },
    {
        titulo: 'Nossos Mascotes Sol e Lua',
        tituloCartao: 'Mascotes Sol e Lua',
        descricao: 'Conheça os mascotes do departamento.',
        link: '/quem-somos/mascotes-sol-e-lua',
        icone: 'pets',
        palavras: 'mascote sol lua cachorro gato',
    },
    {
        titulo: 'Notícias e Eventos',
        descricao: 'Histórias de adoção, novidades e ações do departamento.',
        link: '/quem-somos/noticias-e-eventos',
        icone: 'newspaper',
        palavras: 'notícia evento novidade campanha agenda',
    },
    {
        titulo: 'Seja Voluntário',
        descricao: 'Formas de ajudar: passear, lar temporário, festa do pijama e doações.',
        link: '/quem-somos/seja-voluntario',
        icone: 'real_estate_agent',
        palavras: 'voluntário voluntariado ajudar colaborar',
    },
    {
        titulo: 'Perguntas Frequentes',
        descricao: 'Respostas para as dúvidas mais comuns.',
        link: '/quem-somos/perguntas-frequentes',
        icone: 'help',
        palavras: 'dúvida pergunta faq ajuda',
    },

    // ----- Adoção Responsável -----
    {
        titulo: 'Adoção Responsável',
        descricao: 'Como adotar, passear, participar da Festa do Pijama ou ser lar temporário.',
        link: '/adocao-responsavel',
        icone: 'family_home',
        palavras: 'adotar adoção adote como adotar cachorro gato pet',
    },
    {
        titulo: 'Lar Temporário',
        descricao: 'Abrigue um cão ou gato até que ele encontre uma família.',
        link: '/adocao-responsavel#lar-temporario',
        icone: 'home',
        palavras: 'lar temporário transitório abrigar acolher',
    },
    {
        titulo: 'Festa do Pijama',
        descricao: 'Leve um animal para passar uma noite em casa.',
        link: '/adocao-responsavel#festa-do-pijama',
        icone: 'celebration',
        palavras: 'festa pijama noite aumigo convivência',
    },
    {
        titulo: 'Passeio Divertido',
        descricao: 'Passeie com um aumigo do canil.',
        link: '/adocao-responsavel#passeio',
        icone: 'directions_walk',
        palavras: 'passeio passear caminhada aumigo',
    },
    {
        titulo: 'Quiz: encontre seu pet ideal',
        tituloCartao: 'Quiz do Pet Ideal',
        descricao: 'Responda às perguntas com Sol e Lua e descubra qual animal combina com você.',
        link: '/filtro',
        icone: 'family_home',
        palavras: 'quiz jogo perguntas recomendação pet ideal',
    },
    {
        titulo: 'Animais para Adoção',
        descricao: 'Veja todos os cães e gatos disponíveis, com filtros.',
        link: '/meetinpet',
        icone: 'pets',
        palavras: 'animais cães gatos cachorros disponíveis lista adoção filtro',
    },

    // ----- Pets Perdidos e Encontrados -----
    {
        titulo: 'Pets Perdidos e Encontrados',
        tituloCartao: 'Pets Perdidos',
        descricao: 'Cadastre ou procure animais perdidos e encontrados.',
        link: '/adote',
        icone: 'search',
        palavras: 'perdi meu pet perdido achado encontrado procura-se',
    },
    {
        titulo: 'Encontrei um Pet',
        descricao: 'Registre um animal que você encontrou.',
        link: '/registro-pet-encontrado',
        icone: 'add_location_alt',
        palavras: 'encontrei achei animal encontrado registrar',
    },
    {
        titulo: 'Mapa Interativo da Região',
        tituloCartao: 'Mapa Interativo',
        descricao: 'Mapa com os animais perdidos e encontrados.',
        link: '/mapa',
        icone: 'map',
        palavras: 'mapa região localização perdidos encontrados',
    },

    // ----- Banco de Ração -----
    {
        titulo: 'Banco de Ração',
        descricao: 'Doações, retiradas e estoque de rações.',
        link: '/racao',
        icone: 'humerus',
        palavras: 'ração doação doar doador solicitar retirar comida alimento',
    },

    // ----- Assistência Veterinária -----
    {
        titulo: 'Atendimento Clínico',
        descricao: 'Atendimento veterinário na clínica municipal.',
        link: '/assistencia-veterinaria/atendimento-clinico',
        icone: 'medical_services',
        palavras: 'clínica veterinária consulta atendimento saúde',
    },
    {
        titulo: 'Castração Gratuita',
        descricao: 'Como solicitar a castração de cães e gatos.',
        link: '/assistencia-veterinaria/castracao-gratuita',
        icone: 'medical_information',
        palavras: 'castração castrar gratuita cirurgia',
    },
    {
        titulo: 'Mutirões de Castração',
        descricao: 'Datas, inscrições e orientações dos mutirões.',
        link: '/assistencia-veterinaria/mutiroes-de-castracao',
        icone: 'event',
        palavras: 'mutirão castração inscrição vagas',
    },
    {
        titulo: 'Vacinação Antirrábica',
        descricao: 'Onde e quando vacinar contra a raiva.',
        link: '/assistencia-veterinaria/vacinacao-antirrabica',
        icone: 'vaccines',
        palavras: 'vacina vacinação antirrábica raiva campanha',
    },
    {
        titulo: 'Microchip e Registro do Pet',
        tituloCartao: 'Microchip e Registro',
        descricao: 'Identificação e registro de cães e gatos.',
        link: '/assistencia-veterinaria/microchip-e-registro',
        icone: 'memory',
        palavras: 'microchip registro identificação rga',
    },
    {
        titulo: 'Clínicas Credenciadas',
        descricao: 'Clínicas veterinárias parceiras do programa.',
        link: '/assistencia-veterinaria/clinicas-credenciadas',
        icone: 'local_hospital',
        palavras: 'clínicas credenciadas parceiras veterinário',
    },

    // ----- Conta -----
    {
        titulo: 'Login / Cadastro',
        descricao: 'Entre ou cadastre-se para participar.',
        link: '/login',
        icone: 'lock',
        palavras: 'login entrar cadastro cadastrar conta senha acessar',
    },
]
