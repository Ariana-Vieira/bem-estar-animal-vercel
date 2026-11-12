'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface CustomHeaderProps {
    extraLogo?: string;
    textAlt?: string;
    className?: string;
}

export const CustomHeader = ({ extraLogo, textAlt, className }: CustomHeaderProps) => {
    const router = useRouter()
    const [termo, setTermo] = useState('')

    const handleBusca = (e: React.FormEvent) => {
        e.preventDefault()
        const query = termo.trim()
        // A busca agora procura nas páginas do site e nos animais: ver app/busca/page.tsx
        router.push(query ? `/busca?q=${encodeURIComponent(query)}` : '/busca')
    }

    return (
        <header className="cabecalho">
            <div className="cabecalho-acento" role="presentation" aria-hidden="true" />
            <div className="container-fluid">
                <div className="cabecalho-inner">
                    <div className="cabecalho-logo-esq">
                        <Link href="/" className="logo-link" title="Ir para a página inicial">
                            <img src="/logo_Bem-EstarAnimal.png" alt="Departamento de Proteção e Bem-Estar Animal - página inicial" className="logo" />
                        </Link>
                    </div>

                    <div className="cabecalho-busca">
                        <form className="busca-form" onSubmit={handleBusca} role="search">
                            <input
                                type="search"
                                className="busca-input"
                                placeholder="O que você procura?"
                                value={termo}
                                onChange={(e) => setTermo(e.target.value)}
                                aria-label="Buscar no site"
                            />
                            <button type="submit" className="busca-btn" aria-label="Buscar">
                                <span className="material-symbols-rounded">search</span>
                            </button>
                        </form>
                    </div>

                    <div className="cabecalho-logo-dir">
                        {extraLogo && (
                            <div className="cabecalho-logo-extra">
                                <img src={extraLogo} alt={textAlt} className={className} />
                            </div>
                        )}
                        <a href="https://www.votorantim.sp.gov.br/" target="_blank" rel="noopener noreferrer" className="logo-link cabecalho-logo-pref" title="Site da Prefeitura de Votorantim">
                            <img src="/logo_prefeituraVotorantim.png" alt="Prefeitura Municipal de Votorantim - abre o site da prefeitura" className="logo-prefeitura" />
                        </a>
                    </div>
                </div>
            </div>
        </header>
    )
}
