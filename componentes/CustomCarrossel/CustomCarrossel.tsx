
'use client'

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { urlFoto } from "@/app/Admin/utils/urlFoto"

// Um slide do carrossel. Os banners cadastrados no Admin (tabela BANNER) já
// chegam da API neste formato.
type Slide = {
    id: number | string
    titulo: string
    subtitulo?: string | null
    descricao?: string | null
    textoBotao?: string | null
    linkBotao?: string | null
    urlImagem?: string | null
    classeFundo?: string // fundo padrão (CSS) dos slides de antes, que não têm imagem própria
}

// Os slides de antes continuam aparecendo se não houver nenhum banner ativo
// ou se o servidor não responder: a home nunca fica sem carrossel.
const slidesPadrao: Slide[] = [
    {
        id: "padrao-1",
        titulo: "+Vagas para a Castração Animal em Votorantim",
        subtitulo: "3.600 oportunidades por ano",
        descricao: "Ajude a controlar a população de animais e promover saúde",
        textoBotao: "Saiba mais",
        linkBotao: "#",
        classeFundo: "slide-1",
    },
    {
        id: "padrao-2",
        titulo: "Guarda Responsável de Animais Domésticos",
        subtitulo: "Orientações para tutores em Votorantim",
        descricao: "Cuide bem do seu pet e contribua com o bem-estar animal",
        textoBotao: "Ver orientações",
        linkBotao: "#",
        classeFundo: "slide-2",
    },
]

// O link do botão vira um <a href>: só página do site (/...), âncora (#...) ou http(s).
// (o servidor também confere, aqui é uma segunda proteção contra "javascript:...")
const LINK_VALIDO = /^(\/(?!\/)|#|https?:\/\/)/i

// Link do slide: usado no botão e também no slide inteiro (quando o banner tem link
// mas não tem botão, clicar na imagem leva ao link).
function LinkSlide({ link, className, style, children }: {
    link: string
    className: string
    style?: React.CSSProperties
    children: React.ReactNode
}) {
    if (/^\/(?!\/)/.test(link)) {
        return <Link href={link} className={className} style={style}>{children}</Link>
    }

    // externo abre em outra aba; âncora (#) fica na própria página
    const externo = /^https?:\/\//i.test(link)
    return (
        <a
            href={link}
            className={className}
            style={style}
            {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
            {children}
        </a>
    )
}

export const CustomCarrossel = () => {
    const carouselRef = useRef<HTMLDivElement | null>(null)
    // null = ainda buscando os banners no servidor
    const [banners, setBanners] = useState<Slide[] | null>(null)

    useEffect(() => {
        const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3010"
        const controle = new AbortController()
        let cancelado = false // desmontou: não mexe mais no estado

        // Se o servidor demorar (o banco na nuvem pode "acordar" devagar), depois de
        // 4 segundos mostra os slides de sempre em vez de deixar a home esperando.
        const limite = window.setTimeout(() => controle.abort(), 4000)

        fetch(`${api}/banners/ativos`, { signal: controle.signal })
            .then((resposta) => (resposta.ok ? resposta.json() : []))
            .then((dados) => { if (!cancelado) setBanners(Array.isArray(dados) ? dados : []) })
            .catch(() => { if (!cancelado) setBanners([]) })
            .finally(() => window.clearTimeout(limite))

        return () => {
            cancelado = true
            window.clearTimeout(limite)
            controle.abort()
        }
    }, [])

    const pronto = banners !== null
    const slides = banners && banners.length > 0 ? banners : slidesPadrao
    const varios = slides.length > 1

    useEffect(() => {
        // Com um slide só (ou antes de carregar) não há o que girar
        if (!pronto || !varios) {
            return
        }

        let cancelado = false
        let instance: { cycle: () => void; pause: () => void; dispose: () => void } | null = null

        const initCarousel = async () => {
            const { Carousel } = await import("bootstrap")

            // Se o componente já foi desmontado enquanto o Bootstrap carregava, não cria nada
            // (isso também evita instâncias "soltas" quando o React monta o efeito duas vezes em dev).
            if (cancelado || !carouselRef.current) {
                return
            }

            const nova = Carousel.getOrCreateInstance(carouselRef.current, {
                interval: 5000,
                wrap: true,
                touch: true,
                pause: "hover",
            })

            nova.cycle()
            instance = nova
        }

        initCarousel()

        return () => {
            cancelado = true

            if (instance) {
                const atual = instance
                // Para a rotação agora, mas só descarta depois que a transição de slide em andamento
                // terminar. Descartar no meio dela fazia o Bootstrap ler um elemento já apagado
                // ("Illegal invocation" em Carousel._getItems).
                atual.pause()
                window.setTimeout(() => {
                    try {
                        atual.dispose()
                    } catch {
                        // elemento já removido: nada a fazer
                    }
                }, 1000)
            }
        }
    }, [pronto, varios])

    // Enquanto busca os banners: só o fundo, na mesma altura (sem pular o layout
    // e sem mostrar por um instante um texto que pode ser trocado em seguida)
    if (!pronto) {
        return (
            <section className="carrossel-principal" aria-busy="true">
                <div className="slide slide-carregando" />
            </section>
        )
    }

    return (
        <section className="carrossel-principal">
        <div ref={carouselRef} id="carrosselHero" className="carousel slide" data-bs-ride={varios ? "carousel" : undefined} data-bs-interval="5000">
            {varios && (
                <div className="carousel-indicators">
                    {slides.map((slide, i) => (
                        <button
                            key={slide.id}
                            type="button"
                            data-bs-target="#carrosselHero"
                            data-bs-slide-to={i}
                            className={i === 0 ? "active" : undefined}
                            aria-current={i === 0 ? "true" : undefined}
                            aria-label={`Slide ${i + 1}`}
                        ></button>
                    ))}
                </div>
            )}
            <div className="carousel-inner">
                {slides.map((slide, i) => {
                    const classes = `slide ${slide.classeFundo ?? (slide.urlImagem ? "" : "slide-sem-imagem")}`
                    const estilo = slide.urlImagem ? { backgroundImage: `url("${urlFoto(slide.urlImagem).replace(/"/g, "%22")}")` } : undefined
                    const linkOk = !!slide.linkBotao && LINK_VALIDO.test(slide.linkBotao)
                    // Com texto no botão: o botão leva ao link. Sem botão, mas com link: o slide inteiro é o link.
                    const slideInteiroClicavel = linkOk && !slide.textoBotao

                    const conteudo = (
                        <div className="conteudo-slide text-center text-white">
                            <h2 className="display-5 fw-bold">{slide.titulo}</h2>
                            {slide.subtitulo && <p className="lead mb-1">{slide.subtitulo}</p>}
                            {slide.descricao && <p className="mb-0">{slide.descricao}</p>}
                            {slide.textoBotao && linkOk && (
                                <LinkSlide link={slide.linkBotao!} className="btn-slide-cta">{slide.textoBotao}</LinkSlide>
                            )}
                        </div>
                    )

                    return (
                        <div key={slide.id} className={`carousel-item${i === 0 ? " active" : ""}`}>
                            {slideInteiroClicavel ? (
                                <LinkSlide link={slide.linkBotao!} className={classes} style={estilo}>{conteudo}</LinkSlide>
                            ) : (
                                <div className={classes} style={estilo}>{conteudo}</div>
                            )}
                        </div>
                    )
                })}
            </div>
            {varios && (
                <>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carrosselHero" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Anterior</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carrosselHero" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Próximo</span>
                    </button>
                </>
            )}
        </div>
    </section>
    )
}
