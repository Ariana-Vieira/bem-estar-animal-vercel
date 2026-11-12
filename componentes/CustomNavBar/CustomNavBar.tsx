'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { categoriasMenu, itemEntrar, type MenuCategoria } from './menuItens'
import { ModalLogin } from '@/componentes/ModalLogin/ModalLogin'

type CustomNavBarProps = {
    isMenuOpen?: boolean
    onOpenMenu?: () => void
    categorias?: MenuCategoria[]
    homeHref?: string
    itemFinal?: { rotulo: string; href: string } | null
}

export const CustomNavBar = ({
    categorias = categoriasMenu,
    homeHref = '/',
    itemFinal = itemEntrar,
}: CustomNavBarProps) => {
    const [aberto, setAberto] = useState<number | null>(null)
    const [menuMobilAberto, setMenuMobilAberto] = useState(false)
    const [subMobilAberto, setSubMobilAberto] = useState<number | null>(null)
    const [modalLoginAberto, setModalLoginAberto] = useState(false)
    const barraRef = useRef<HTMLDivElement>(null)
    const pathname = usePathname()
    const [hashAtual, setHashAtual] = useState('')

    const fecharMobil = () => { setMenuMobilAberto(false); setSubMobilAberto(null) }

    // Fecha ao trocar de página
    useEffect(() => {
        setAberto(null)
        setMenuMobilAberto(false)
        setSubMobilAberto(null)
    }, [pathname])

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
        <>
        <nav className={`navegacao${menuMobilAberto ? ' mob-menu-aberto' : ''}`}>
        <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-between py-2 gap-3">
                <div className="d-flex align-items-center gap-0 nav-esquerda">
                    {/* Desktop: link direto para a home */}
                    <Link href={homeHref} className="btn btn-menu mob-btn-home" aria-label="Ir para a página inicial">
                        <span className="material-symbols-rounded">pets</span>
                        <span>Início</span>
                    </Link>
                    {/* Mobile: abre o drawer */}
                    <button
                        type="button"
                        className="btn btn-menu mob-btn-trigger"
                        onClick={() => setMenuMobilAberto(true)}
                        aria-label="Abrir menu de navegação"
                    >
                        <span className="material-symbols-rounded">pets</span>
                        <span>Menu</span>
                        <span className="material-symbols-rounded mob-hamburguer">menu</span>
                    </button>

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
                            <button
                                type="button"
                                className="link-nav link-nav-entrar link-nav-botao"
                                onClick={() => setModalLoginAberto(true)}
                            >
                                <span className="material-symbols-rounded">lock</span>
                                {itemFinal.rotulo}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </nav>

    {/* ── MENU MOBILE DRAWER ── */}
    <div
        className={`mob-overlay${menuMobilAberto ? ' mob-overlay-ativo' : ''}`}
        onClick={fecharMobil}
        aria-hidden="true"
    />
    <aside className={`mob-drawer${menuMobilAberto ? ' mob-drawer-aberto' : ''}`} aria-label="Menu de navegação">
        <div className="mob-drawer-header">
            <div className="mob-drawer-badge">
                <span className="material-symbols-rounded">pets</span>
                <span>MENU</span>
            </div>
            <button className="mob-drawer-close" onClick={fecharMobil} aria-label="Fechar menu">
                <span className="material-symbols-rounded">close</span>
            </button>
        </div>

        <div className="mob-drawer-body">
            <Link href={homeHref} className="mob-item-simples" onClick={fecharMobil}>
                <span className="material-symbols-rounded">home</span>
                <span>Início</span>
            </Link>

            {categorias.map((cat, i) => {
                const temSub = !!cat.itens && cat.itens.length > 0
                const estaAberto = subMobilAberto === i

                if (!temSub) {
                    return (
                        <Link key={cat.rotulo} href={cat.href ?? '#'} className={`mob-item-simples${categoriaAtiva(cat) ? ' mob-item-ativo' : ''}`} onClick={fecharMobil}>
                            <span>{cat.rotulo}</span>
                        </Link>
                    )
                }

                return (
                    <div key={cat.rotulo} className="mob-item-grupo">
                        <button
                            type="button"
                            className={`mob-item-titulo${estaAberto ? ' mob-item-titulo-aberto' : ''}${categoriaAtiva(cat) ? ' mob-item-ativo' : ''}`}
                            onClick={() => setSubMobilAberto(estaAberto ? null : i)}
                        >
                            <span>{cat.rotulo}</span>
                            <span className={`material-symbols-rounded mob-seta${estaAberto ? ' mob-seta-aberta' : ''}`}>
                                expand_more
                            </span>
                        </button>

                        <ul className={`mob-sub-lista${estaAberto ? ' mob-sub-lista-aberta' : ''}`}>
                            {cat.itens!.map(item => (
                                <li key={item.rotulo}>
                                    <Link href={item.href} className="mob-sub-link" onClick={fecharMobil}>
                                        {item.rotulo}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            })}

            {itemFinal && (
                <button
                    type="button"
                    className="mob-item-login"
                    onClick={() => { fecharMobil(); setModalLoginAberto(true) }}
                >
                    <span className="material-symbols-rounded">lock</span>
                    <span>{itemFinal.rotulo}</span>
                </button>
            )}
        </div>
    </aside>

    <ModalLogin aberto={modalLoginAberto} onFechar={() => setModalLoginAberto(false)} />
    </>
    )
}
