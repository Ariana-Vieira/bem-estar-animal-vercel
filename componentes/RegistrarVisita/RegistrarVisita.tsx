'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { paginas } from '@/data/paginas'
import { CHAVE_VISITAS, MAX_VISITAS } from '@/data/acessoRapido'

// Componente "invisível": não mostra nada na tela.
// A cada página que a pessoa abre, guarda o endereço dela no navegador (localStorage),
// para o Acesso Rápido da home mostrar essas páginas depois.
export const RegistrarVisita = () => {
    // pathname = endereço da página atual, por exemplo "/racao"
    const pathname = usePathname()

    // O useEffect roda toda vez que o endereço (pathname) muda, ou seja, a cada página visitada
    useEffect(() => {
        // Só guardamos as páginas que estão na lista do site (data/paginas.ts)
        const pagina = paginas.find(p => p.link.split('#')[0] === pathname)
        if (!pagina) return

        try {
            // Lê o que já estava guardado (uma lista de links)
            const guardados: string[] = JSON.parse(localStorage.getItem(CHAVE_VISITAS) ?? '[]')

            // Coloca a página no começo (mais recente primeiro), sem repetir, e limita o tamanho
            const novaLista = [pagina.link, ...guardados.filter(link => link !== pagina.link)].slice(0, MAX_VISITAS)

            localStorage.setItem(CHAVE_VISITAS, JSON.stringify(novaLista))
        } catch {
            // Se o navegador bloquear o localStorage, simplesmente não guardamos nada
        }
    }, [pathname])

    return null
}
