import type { Metadata } from 'next'
import { CustomPaginaServico } from '@/componentes/CustomPaginaServico/CustomPaginaServico'
import { CartoesLink, Texto } from '@/componentes/CustomPaginaServico/CustomConteudoServico'
import { paginas } from '@/data/paginas'
import animais from '@/data/animais.json'

export const metadata: Metadata = { title: 'Busca | Bem-Estar Animal' }

// Deixa o texto em minúsculas e sem acento, para "Castração" achar "castracao" e vice-versa
function normalizar(texto: string) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
}

// Confere se TODAS as palavras digitadas aparecem no texto.
// A palavra digitada precisa ser o começo de uma palavra do texto:
// "ração" acha "ração", mas não acha "castração"; já "castr" acha "castração".
function contemTodas(texto: string, palavras: string[]) {
    const palavrasDoTexto = normalizar(texto).split(/[^a-z0-9]+/)
    return palavras.every(palavra => palavrasDoTexto.some(p => p.startsWith(palavra)))
}

// O texto digitado aparece na URL: /busca?q=castração
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams
    const termo = (q ?? '').trim()

    // Palavras digitadas, sem acento e em minúsculas (todas precisam aparecer, em qualquer ordem)
    const palavras = normalizar(termo).split(' ').filter(p => p !== '')

    const paginasAchadas = termo === '' ? [] : paginas.filter(pagina =>
        contemTodas(`${pagina.titulo} ${pagina.descricao} ${pagina.palavras}`, palavras)
    )

    const animaisAchados = termo === '' ? [] : animais.filter(animal =>
        contemTodas(`${animal.nome} ${animal.raca} ${animal.especie}`, palavras)
    )

    // Monta as seções que serão mostradas na tela
    const secoes = []

    if (paginasAchadas.length > 0) {
        secoes.push({
            titulo: `Páginas (${paginasAchadas.length})`,
            larga: true,
            conteudo: (
                <CartoesLink
                    itens={paginasAchadas.map(pagina => ({
                        icone: 'article',
                        titulo: pagina.titulo,
                        texto: pagina.descricao,
                        href: pagina.link,
                    }))}
                />
            ),
        })
    }

    if (animaisAchados.length > 0) {
        secoes.push({
            titulo: `Animais (${animaisAchados.length})`,
            larga: true,
            conteudo: (
                <CartoesLink
                    itens={animaisAchados.map(animal => ({
                        icone: 'pets',
                        titulo: animal.nome,
                        texto: `${animal.especie} - ${animal.raca}`,
                        href: `/meetinpet/${animal.nome.toLowerCase()}`,
                    }))}
                />
            ),
        })
    }

    if (secoes.length === 0) {
        secoes.push({
            titulo: 'Nenhum resultado',
            larga: true,
            conteudo: (
                <Texto>
                    {termo === ''
                        ? 'Digite uma palavra na barra de busca do topo, por exemplo: adoção, castração, ração ou o nome de um animal.'
                        : 'Não encontramos nada com essa palavra. Tente outra, por exemplo: adoção, castração, vacina ou ração.'}
                </Texto>
            ),
        })
    }

    return (
        <CustomPaginaServico
            titulo="Resultados da busca"
            resumo={termo === '' ? 'Pesquise por páginas e animais do site.' : `Você pesquisou por: "${termo}"`}
            aviso={false}
            secoes={secoes}
        />
    )
}
