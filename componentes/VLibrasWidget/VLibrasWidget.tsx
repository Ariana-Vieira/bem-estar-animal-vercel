'use client'
import Script from 'next/script'
import { useEffect } from 'react'

// O VLibras (v7+) desenha o botão dentro de um Shadow DOM de 40x40px, então o
// CSS global não alcança. Como o shadow root é "open", injetamos o estilo nele
// para igualar ao ícone de daltonismo (50x50px, right 10px) com 16px de espaço
// entre os dois (daltonismo fica em top: calc(50% + 8px)).
const ESTILO_ID = 'vlibras-ajuste-tamanho'

function ajustarBotaoVLibras(tentativas = 0) {
    const host = document.getElementById('vlibras-access-wrapper')
    const shadow = host?.shadowRoot

    if (!shadow) {
        if (tentativas < 40) setTimeout(() => ajustarBotaoVLibras(tentativas + 1), 100)
        return
    }
    if (shadow.getElementById(ESTILO_ID)) return

    const style = document.createElement('style')
    style.id = ESTILO_ID
    style.textContent = `
        #vlibras-access {
            width: 50px !important;
            height: 50px !important;
            right: 10px !important;
            top: calc(50vh - 58px) !important;
        }
        #vlibras-access:hover,
        #vlibras-access:has(#vlibras-button:focus-visible) { width: 250px !important; }
        #vlibras-button { width: 50px !important; height: 50px !important; background: transparent !important; }
        #vlibras-button img { width: 100% !important; height: 100% !important; display: block; }
        #vlibras-popup { height: 50px !important; }
    `
    shadow.appendChild(style)
}

export const VLibrasWidget = () => {
    useEffect(() => {
        if (document.querySelector('[vw]')) return

        const container = document.createElement('div')
        container.setAttribute('vw', '')
        container.classList.add('enabled')

        const btn = document.createElement('div')
        btn.setAttribute('vw-access-button', '')
        btn.classList.add('active')

        const wrap = document.createElement('div')
        wrap.setAttribute('vw-plugin-wrapper', '')

        const inner = document.createElement('div')
        inner.className = 'vw-plugin-top-wrapper'

        wrap.appendChild(inner)
        container.appendChild(btn)
        container.appendChild(wrap)
        document.body.appendChild(container)
    }, [])

    return (
        <Script
            src="https://vlibras.gov.br/app/vlibras-plugin.js"
            strategy="afterInteractive"
            onLoad={() => {
                new (window as any).VLibras.Widget('https://vlibras.gov.br/app')
                ajustarBotaoVLibras()
                // Em SPAs o window.onload já disparou antes do script carregar.
                // O VLibras depende desse evento para inicializar o widget,
                // então precisamos dispará-lo manualmente.
                if (typeof window.onload === 'function') {
                    window.onload(new Event('load'))
                }
            }}
        />
    )
}
