import Link from 'next/link'
import style from './CustomPaginaServico.module.css'

// Blocos de conteúdo reutilizáveis dentro das seções de CustomPaginaServico.

export const Texto = ({ children }: { children: React.ReactNode }) => (
    <p className={style.texto}>{children}</p>
)

// Botão laranja (padrão do projeto). Use dentro de <Acoes> para agrupar vários.
export const LinkBotao = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} className={style.linkAcao}>{children}</Link>
)

// Linha centralizada para um ou mais botões
export const Acoes = ({ children }: { children: React.ReactNode }) => (
    <div className={style.acoes}>{children}</div>
)

// Atalho: um único botão centralizado
export const LinkAcao = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Acoes>
        <LinkBotao href={href}>{children}</LinkBotao>
    </Acoes>
)

// Imagem ao lado de um título e texto
export const Destaque = ({
    src,
    alt,
    titulo,
    inteira = false,
    children,
}: {
    src: string
    alt: string
    titulo?: string
    // true = mostra a imagem inteira, sem cortar (ideal para mascotes/ilustrações)
    inteira?: boolean
    children: React.ReactNode
}) => (
    <div className={`${style.destaque}${inteira ? ' ' + style.inteira : ''}`}>
        <img src={src} alt={alt} />
        <div>
            {titulo && <h3>{titulo}</h3>}
            {children}
        </div>
    </div>
)

// Lista de blocos com subtítulo e texto
export const Itens = ({ itens }: { itens: { titulo: string; texto: React.ReactNode }[] }) => (
    <div className={style.itens}>
        {itens.map(item => (
            <div key={item.titulo} className={style.item}>
                <h3>{item.titulo}</h3>
                <p>{item.texto}</p>
            </div>
        ))}
    </div>
)

// Perguntas e respostas (abre e fecha sem JavaScript)
export const Faq = ({ itens }: { itens: { pergunta: string; resposta: React.ReactNode }[] }) => (
    <div className={style.faq}>
        {itens.map(item => (
            <details key={item.pergunta}>
                <summary>{item.pergunta}</summary>
                <p className={style.resposta}>{item.resposta}</p>
            </details>
        ))}
    </div>
)

// Cartões clicáveis (ícone, título, descrição) que levam a outras páginas
export const CartoesLink = ({
    itens,
}: {
    itens: { icone: string; titulo: string; texto: string; href: string }[]
}) => (
    <div className={style.cartoesLink}>
        {itens.map(item => (
            <Link key={item.titulo} href={item.href} className={style.cartaoLink}>
                <div className={style.cartaoIcone}>
                    <span className="material-symbols-rounded" aria-hidden="true">{item.icone}</span>
                </div>
                <h3>{item.titulo}</h3>
                <p>{item.texto}</p>
                <span className={style.cartaoSeta}>
                    Saiba mais
                    <span className="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
                </span>
            </Link>
        ))}
    </div>
)

// Lista de contato com ícones (endereço, e-mail, telefone)
export const ListaContato = ({ itens }: { itens: { icone: string; texto: string }[] }) => (
    <ul className={style.contatos}>
        {itens.map(item => (
            <li key={item.texto}>
                <div className={style.contatoIcone}>
                    <span className="material-symbols-rounded" aria-hidden="true">{item.icone}</span>
                </div>
                {item.texto}
            </li>
        ))}
    </ul>
)

// Mapa do Google Maps incorporado, com o endereço e botão para abrir no Maps
export const MapaEndereco = ({
    endereco,
    titulo = 'Mapa do endereço',
    mostrarEndereco = true,
}: {
    endereco: string
    titulo?: string
    // false = não repete o endereço escrito abaixo do mapa (útil se ele já aparece ao lado)
    mostrarEndereco?: boolean
}) => {
    const consulta = encodeURIComponent(endereco)
    return (
        <>
            <iframe
                className={style.mapa}
                title={titulo}
                src={`https://www.google.com/maps?q=${consulta}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
            />
            {mostrarEndereco && (
                <p className={style.enderecoMapa}>
                    <span className="material-symbols-rounded" aria-hidden="true">location_on</span>
                    {endereco}
                </p>
            )}
            <Acoes>
                <a
                    className={style.linkAcao}
                    href={`https://www.google.com/maps/search/?api=1&query=${consulta}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Abrir no Google Maps
                </a>
            </Acoes>
        </>
    )
}

// Contatos + mapa lado a lado (contatos à esquerda, mapa à direita)
export const LocalContato = ({
    endereco,
    contatos,
    titulo = 'Mapa do endereço',
}: {
    endereco: string
    contatos: { icone: string; texto: string }[]
    titulo?: string
}) => {
    const consulta = encodeURIComponent(endereco)
    return (
        <div className={style.localGrade}>
            <div className={style.localContatos}>
                <ListaContato itens={contatos} />
                <Acoes>
                    <a
                        className={style.linkAcao}
                        href={`https://www.google.com/maps/search/?api=1&query=${consulta}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Abrir no Google Maps
                    </a>
                </Acoes>
            </div>
            <iframe
                className={style.mapa}
                title={titulo}
                src={`https://www.google.com/maps?q=${consulta}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
            />
        </div>
    )
}
