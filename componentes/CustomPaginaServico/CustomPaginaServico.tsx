import { CustomAcessibilidade } from '@/componentes/CustomAcessibilidade/CustomAcessibilidade'
import { CustomHeader } from '@/componentes/CustomHeader/CustomHeader'
import { CustomNavBar } from '@/componentes/CustomNavBar/CustomNavBar'
import { CustomFooter } from '@/componentes/CustomFooter/CustomFooter'
import { PataFundo } from '@/componentes/PataFundo/PataFundo'
import style from './CustomPaginaServico.module.css'

// Estrutura base das páginas de serviço (Assistência Veterinária etc.).
// Layout copiado da página /projeto: contêiner com degradê, título centralizado,
// cartão de introdução e cartões de seção. O conteúdo real deve ser preenchido
// depois, com informações confirmadas pelo departamento.

export type SecaoServico = {
    titulo: string
    // Orientação para quem for preencher (aparece em cinza claro na página)
    dica?: string
    // Conteúdo real da seção. Sem "conteudo", a seção mostra "Conteúdo a ser preenchido".
    conteudo?: React.ReactNode
    // Ocupa a largura toda (as demais ficam em 2 colunas)
    larga?: boolean
    // Âncora para links como /pagina#id
    id?: string
}

type CustomPaginaServicoProps = {
    // Mantido por compatibilidade (a categoria aparece no título da aba/menu)
    categoria?: string
    titulo: string
    resumo: string
    secoes: SecaoServico[]
    // Aviso no cartão de introdução. Padrão: "em construção". Use false para ocultar.
    aviso?: string | false
    // Efeito de patinhas aparecendo no fundo do cartão
    patinhas?: boolean
}

// Grade de seções (cartões). Exportada para ser usada também em páginas próprias, como /sobrenos.
export const SecoesServico = ({ secoes }: { secoes: SecaoServico[] }) => (
    <div className={style.sectionGrid}>
        {secoes.map(secao => (
            <article
                key={secao.titulo}
                id={secao.id}
                className={`${style.cardInfo}${secao.larga ? ' ' + style.larga : ''}`}
            >
                <h2 className={style.sectionHeading}>{secao.titulo}</h2>
                {secao.conteudo ? (
                    <div className={style.conteudoReal}>{secao.conteudo}</div>
                ) : (
                    <>
                        <p className={style.pendente}>Conteúdo a ser preenchido.</p>
                        {secao.dica && <p className={style.dica}>{secao.dica}</p>}
                    </>
                )}
            </article>
        ))}
    </div>
)

const AVISO_PADRAO =
    'Esta página está em construção. As informações pendentes serão publicadas após confirmação do Departamento de Proteção e Bem-Estar Animal.'

export const CustomPaginaServico = ({ titulo, resumo, secoes, aviso = AVISO_PADRAO, patinhas = false }: CustomPaginaServicoProps) => {
    return (
        <>
            <CustomAcessibilidade />
            <CustomHeader />
            <CustomNavBar />

            <main className={style.pagina}>
                <section className={style.conteudo}>
                    {patinhas && <PataFundo />}
                    <div className={style.topoTexto}>
                        <h1 className={style.titulo}>{titulo}</h1>
                    </div>

                    <div className={style.introCard}>
                        <p>{resumo}</p>
                        {aviso && <p className={style.aviso}>{aviso}</p>}
                    </div>

                    <SecoesServico secoes={secoes} />
                </section>
            </main>

            <CustomFooter />
        </>
    )
}
