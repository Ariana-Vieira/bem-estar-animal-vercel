import style from "./CustomChamadaProjeto.module.css"

export const CustomChamadaProjeto = () => {
    return (
        <section className={style.hero}>
            <div className={style.glowLeft} />
            <div className={style.glowRight} />
            <div className={style.glowCenter} />

            <div className={style.heroContent}>
                <div className={style.textGroup}>
                    <div className={style.badgeWrapper}>
                        <div className={style.badgeDecorLeft}>
                            <span /><span /><span />
                        </div>
                        <span className={style.badge}>
                            <span className={style.badgeIconCircle}>
                                <span className="material-symbols-rounded">rocket_launch</span>
                            </span>
                            EM DESENVOLVIMENTO
                        </span>
                        <div className={style.badgeDecorRight}>
                            <span /><span /><span />
                        </div>
                    </div>

                    <h1 className={style.title}>Projeto Bem-Estar Animal</h1>
                    <div className={style.titleLine}>
                        <span className={style.titleLineMain} />
                        <span className={style.titleLineSecondary} />
                    </div>

                    <p className={style.subtitle}>
                        <strong>Uma parceria entre a Fatec Votorantim e a Prefeitura de Votorantim para modernizar a gestão do bem-estar animal do município.</strong>
                    </p>

                    <div className={style.infoBox}>
                        <div className={style.infoIconCol}>
                            <span className={style.infoCircle}>
                                <svg className={style.heartOverlay} viewBox="0 0 24 24" fill="none">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ffffff" />
                                </svg>
                                <span className="material-symbols-rounded">pets</span>
                            </span>
                            <div className={style.infoDivider} />
                        </div>
                        <p>O projeto está em desenvolvimento e será disponibilizado gradualmente para a população.</p>
                    </div>

                    <a href="/projeto" className={style.ctaButton}>
                        Conheça o Projeto
                        <svg className={style.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </a>
                </div>

                <div className={style.imageWrapper}>
                    <div className={style.imageGlow} />
                    <img src="/caoGato.jpeg" alt="Cachorro e gato juntos" />
                    <div className={style.imageDots}>
                        <span /><span /><span /><span /><span /><span />
                    </div>
                </div>
            </div>
        </section>
    )
}
