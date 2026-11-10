
'use client'

import { useEffect, useRef } from "react"

export const CustomCarrossel = () => {
    const carouselRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
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
    }, [])

    return (
        <section className="carrossel-principal">
        <div ref={carouselRef} id="carrosselHero" className="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carrosselHero" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carrosselHero" data-bs-slide-to="1" aria-label="Slide 2"></button>
            </div>
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <div className="slide slide-1">
                        <div className="conteudo-slide text-center text-white">
                            <h2 className="display-5 fw-bold">+Vagas para a Castração Animal em Votorantim</h2>
                            <p className="lead mb-1">3.600 oportunidades por ano</p>
                            <p className="mb-0">Ajude a controlar a população de animais e promover saúde</p>
                            <a href="#" className="btn-slide-cta">Saiba mais</a>
                        </div>
                    </div>
                </div>
                <div className="carousel-item">
                    <div className="slide slide-2">
                        <div className="conteudo-slide text-center text-white">
                            <h2 className="display-5 fw-bold">Guarda Responsável de Animais Domésticos</h2>
                            <p className="lead mb-1">Orientações para tutores em Votorantim</p>
                            <p className="mb-0">Cuide bem do seu pet e contribua com o bem-estar animal</p>
                            <a href="#" className="btn-slide-cta">Ver orientações</a>
                        </div>
                    </div>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carrosselHero" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Anterior</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carrosselHero" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Próximo</span>
            </button>
        </div>
    </section>
    )
}