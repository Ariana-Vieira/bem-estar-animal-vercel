'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { categoriasMenu, itemEntrar, type MenuCategoria } from './menuItens'

type CustomNavBarProps = {
    // Props antigas do menu lateral, mantidas só por compatibilidade (ignoradas).
    isMenuOpen?: boolean
    onOpenMenu?: () => void
    // Permite reutilizar o mesmo layout em outras áreas (ex.: Admin).
    categorias?: MenuCategoria[]
    homeHref?: string
    // Item final (ex.: Login). Passe null para não mostrar.
    itemFinal?: { rotulo: string; href: string } | null
}

export const CustomNavBar = ({
    categorias = categoriasMenu,
    homeHref = '/',
    itemFinal = itemEntrar,
}: CustomNavBarProps) => {
    const [aberto, setAberto] = useState<number | null>(null)
    const barraRef = useRef<HTMLDivElement>(null)
    const pathname = usePathname()
    // Âncora atual (#secao): permite marcar o subitem da seção em que a pessoa está
    const [hashAtual, setHashAtual] = useState('')

    // Fecha ao trocar de página
    useEffect(() => { setAberto(null) }, [pathname])

    // Mantém a âncora atual em dia (ao abrir a página e quando ela muda)
    useEffect(() => {
        const ler = () => setHashAtual(window.location.hash)
        ler()
        window.addEventListener('hashchange', ler)
        return () => window.removeEventListener('hashchange', ler)
    }, [pathname])

    // Fecha ao clicar fora ou apertar Esc
    useEffect(() => {
        const aoClicar = (e: MouseEvent) => {
            if (barraRef.current && !barraRef.current.contains(e.target as Node)) setAberto(null)
        }
        const aoTecla = (e: KeyboardEvent) => { if (e.key === 'Escape') setAberto(null) }
        document.addEventListener('mousedown', aoClicar)
        document.addEventListener('keydown', aoTecla)
        return () => {
            document.removeEventListener('mousedown', aoClicar)
            document.removeEventListener('keydown', aoTecla)
        }
    }, [])

    // Item "ativo" = o da página em que a pessoa está
    // Ignora a âncora (#...) ao comparar: /pagina#secao conta como /pagina
    const semAncora = (href: string) => href.split('#')[0]
    const ehAtivo = (href?: string) => {
        if (!href || href.startsWith('#')) return false
        const caminho = semAncora(href)
        if (caminho === '/') return pathname === '/'
        return pathname === caminho || pathname.startsWith(caminho + '/')
    }
    const ancoraDe = (href: string) => (href.includes('#') ? '#' + href.split('#')[1] : '')
    // Índice do subitem ativo: o que tem a âncora atual; senão, o primeiro da mesma página
    const indiceSubAtivo = (cat: MenuCategoria) => {
        const candidatos = (cat.itens ?? [])
            .map((item, i) => ({ item, i }))
            .filter(({ item }) => ehAtivo(item.href))
        if (candidatos.length === 0) return -1
        const comAncora = candidatos.find(({ item }) => ancoraDe(item.href) && ancoraDe(item.href) === hashAtual)
        return (comAncora ?? candidatos[0]).i
    }
    const categoriaAtiva = (cat: MenuCategoria) =>
        ehAtivo(cat.href) || !!cat.itens?.some(item => ehAtivo(item.href))

    return (
        <nav className="navegacao">
        <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-between py-2 gap-3">
                <div className="d-flex align-items-center gap-0 nav-esquerda">
                    <Link href={homeHref} className="btn btn-menu" aria-label="Ir para a página inicial">
                        <span className="material-symbols-rounded">pets</span>
                        <span>Início</span>
                    </Link>

                    {/* NAVEGAÇÃO PRINCIPAL */}
                    <div className="barra-nav" ref={barraRef}>
                        {categorias.map((cat, i) => {
                            const estaAberto = aberto === i
                            const idMenu = `submenu-${i}`
                            const temSubmenu = !!cat.itens && cat.itens.length > 0

                            // Sem submenu: link simples, igual aos demais itens da barra
                            if (!temSubmenu) {
                                return (
                                    <Link
                                        key={cat.rotulo}
                                        href={cat.href ?? '#'}
                                        className={`link-nav${categoriaAtiva(cat) ? ' ativo' : ''}`}
                                        aria-current={categoriaAtiva(cat) ? 'page' : undefined}
                                    >
                                        {cat.rotulo}
                                    </Link>
                                )
                            }

                            return (
                                <div
                                    key={cat.rotulo}
                                    className={`nav-item-dropdown${estaAberto ? ' aberto' : ''}`}
                                    onMouseEnter={() => setAberto(i)}
                                    onMouseLeave={() => setAberto(null)}
                                >
                                    <div className={`nav-item-titulo${categoriaAtiva(cat) ? ' ativo' : ''}`}>
                                        {cat.href ? (
                                            <Link href={cat.href} className="link-nav" aria-current={ehAtivo(cat.href) ? 'page' : undefined}>{cat.rotulo}</Link>
                                        ) : (
                                            <button
                                                type="button"
                                                className="link-nav link-nav-botao"
                                                aria-haspopup="true"
                                                aria-expanded={estaAberto}
                                                aria-controls={idMenu}
                                                onClick={() => setAberto(estaAberto ? null : i)}
                                            >
                                                {cat.rotulo}
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="nav-seta"
                                            aria-label={`Abrir opções de ${cat.rotulo}`}
                                            aria-haspopup="true"
                                            aria-expanded={estaAberto}
                                            aria-controls={idMenu}
                                            onClick={() => setAberto(estaAberto ? null : i)}
                                        >
                                            <span className="material-symbols-rounded">expand_more</span>
                                        </button>
                                    </div>

                                    <ul className="dropdown-nav" id={idMenu}>
                                        {cat.itens!.map((item, idx) => {
                                            const subAtivo = indiceSubAtivo(cat) === idx
                                            return (
                                                <li key={item.rotulo}>
                                                    <Link
                                                        href={item.href}
                                                        className={`dropdown-link${subAtivo ? ' ativo' : ''}`}
                                                        onClick={() => setHashAtual(ancoraDe(item.href))}
                                                        aria-current={subAtivo ? 'page' : undefined}
                                                    >
                                                        {item.rotulo}
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            )
                        })}

                        {itemFinal && (
                            <Link
                                href={itemFinal.href}
                                className={`link-nav link-nav-entrar${ehAtivo(itemFinal.href) ? ' ativo' : ''}`}
                                aria-current={ehAtivo(itemFinal.href) ? 'page' : undefined}
                            >
                                <span className="material-symbols-rounded">lock</span>
                                {itemFinal.rotulo}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </nav>
    )
}
