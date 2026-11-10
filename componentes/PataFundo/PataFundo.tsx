'use client'

import { useEffect, useRef } from 'react'
import style from './PataFundo.module.css'

// Efeito de patinhas que aparecem e somem no fundo de um cartão/página (o mesmo do /sobrenos).
// Uso: coloque <PataFundo /> dentro de um contêiner com "position: relative";
// ele ocupa o contêiner inteiro e não atrapalha cliques.
export const PataFundo = () => {
    const trilhaRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const trilha = trilhaRef.current
        if (!trilha) return

        const timeouts: number[] = []

        const criarPatas = () => {
            const x = Math.random() * trilha.clientWidth
            const y = Math.random() * trilha.clientHeight

            // três patinhas por "passo"
            const posicoes = [
                [x, y],
                [x + 25, y + 60],
                [x - 25, y + 35],
            ]
            const patas = posicoes.map(([left, top]) => {
                const pata = document.createElement('div')
                pata.className = style.pata
                pata.style.left = `${left}px`
                pata.style.top = `${top}px`
                trilha.appendChild(pata)
                return pata
            })

            timeouts.push(window.setTimeout(() => patas.forEach(p => p.remove()), 2500))
        }

        const intervalo = window.setInterval(criarPatas, 500)

        return () => {
            window.clearInterval(intervalo)
            timeouts.forEach(t => window.clearTimeout(t))
            trilha.innerHTML = ''
        }
    }, [])

    return <div ref={trilhaRef} className={style.trilha} aria-hidden="true" />
}
