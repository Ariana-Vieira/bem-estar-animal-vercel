'use client'
import { useState, useEffect } from "react"

export const CustomFiltroDaltonismo = () => {
    const [filtro, setFiltro] = useState("padrao")
    const [aberto, setAberto] = useState(false)

    useEffect(() => {
        // Remove todas as classes de filtro
        document.body.classList.remove('filtro-protanopia', 'filtro-deuteranopia', 'filtro-tritanopia')

        // Aplica o filtro selecionado ao body
        if (filtro !== "padrao") {
            document.body.classList.add(`filtro-${filtro}`)
        }
    }, [filtro])

    const togglePainel = () => {
        setAberto(!aberto)
    }

    return (
        <>
            {/* SVG Filters - invisível, apenas para referência */}
            <svg className="daltonismo-svg-filters" aria-hidden="true">
                <defs>
                    {/* Protanopia (deficiência de vermelho) */}
                    <filter id="protanopia-filter">
                        <feColorMatrix type="matrix" values="
                            0.567, 0.433, 0,     0, 0
                            0.558, 0.442, 0,     0, 0
                            0,     0.242, 0.758, 0, 0
                            0,     0,     0,     1, 0" />
                    </filter>

                    {/* Deuteranopia (deficiência de verde) */}
                    <filter id="deuteranopia-filter">
                        <feColorMatrix type="matrix" values="
                            0.625, 0.375, 0,   0, 0
                            0.7,   0.3,   0,   0, 0
                            0,     0.3,   0.7, 0, 0
                            0,     0,     0,   1, 0" />
                    </filter>

                    {/* Tritanopia (deficiência de azul) */}
                    <filter id="tritanopia-filter">
                        <feColorMatrix type="matrix" values="
                            0.95, 0.05,  0,     0, 0
                            0,    0.433, 0.567, 0, 0
                            0,    0.475, 0.525, 0, 0
                            0,    0,     0,     1, 0" />
                    </filter>
                </defs>
            </svg>

            <div className="filtro-wrapper">
                <button
                    className="filtro-icone"
                    onClick={togglePainel}
                    aria-label="Abrir filtro de daltonismo"
                    aria-expanded={aberto}
                >
                    <span className="material-symbols-rounded">visibility</span>
                    <div className="filtro-banner-hover">
                        <span className="filtro-banner-texto">DALTONISMO</span>
                    </div>
                </button>

                <div className={`filtro-acessibilidade ${aberto ? "aberto" : ""}`}>
                    <div className="filtro-conteudo">
                        <span className="filtro-texto">FILTRO DE DALTONISMO</span>
                        <select
                            className="filtro-select"
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        >
                            <option value="padrao">Cores Padrão</option>
                            <option value="protanopia">Protanopia</option>
                            <option value="deuteranopia">Deuteranopia</option>
                            <option value="tritanopia">Tritanopia</option>
                        </select>
                    </div>
                </div>
            </div>
        </>
    )
}
