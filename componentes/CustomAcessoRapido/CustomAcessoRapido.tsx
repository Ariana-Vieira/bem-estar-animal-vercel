'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { paginas } from '@/data/paginas'
import { cartoesIniciais, CHAVE_VISITAS, type CartaoAtalho } from '@/data/acessoRapido'

export const CustomAcessoRapido = () => {
    // Links das páginas que a pessoa já visitou (mais recente primeiro)
    const [visitados, setVisitados] = useState<string[]>([])
    // false = só 4 cartões; true = todos (depois de clicar em "Mais serviços")
    const [mostrarTodos, setMostrarTodos] = useState(false)

    // Lê as visitas guardadas no navegador. É feito dentro do useEffect porque o localStorage
    // só existe no navegador, não no servidor.
    useEffect(() => {
        try {
            setVisitados(JSON.parse(localStorage.getItem(CHAVE_VISITAS) ?? '[]'))
        } catch {
            // se der erro, continua só com os cartões iniciais
        }
    }, [])

    // 1) Cartões das páginas visitadas, na ordem das visitas.
    //    Se a página for um dos cartões iniciais, usamos esse cartão (ele já tem o texto pronto).
    const cartoesVisitados = visitados
        .map((link): CartaoAtalho | undefined => {
            const inicial = cartoesIniciais.find(c => c.link === link)
            if (inicial) return inicial

            const pagina = paginas.find(p => p.link === link)
            if (!pagina) return undefined

            // Usa o título curto (se a página tiver um), para o cartão não ficar com texto grande demais
            return { titulo: pagina.tituloCartao ?? pagina.titulo, descricao: pagina.descricao, link: pagina.link, icone: pagina.icone }
        })
        .filter((cartao): cartao is CartaoAtalho => cartao !== undefined)

    // 2) Cartões iniciais que a pessoa ainda não visitou: continuam aparecendo depois dos visitados
    const iniciaisRestantes = cartoesIniciais.filter(c => !visitados.includes(c.link))

    // Lista final: primeiro o que ela visitou, depois o que sobrou dos iniciais
    const todos = [...cartoesVisitados, ...iniciaisRestantes]

    // Mostra só os 4 primeiros, ou todos depois de clicar no botão
    const visiveis = mostrarTodos ? todos : todos.slice(0, 4)

    return (
        <section className="acesso-rapido py-5">
        <div className="container">
            <h3 className="titulo-secao text-center mb-5">ACESSO RÁPIDO</h3>
            <div className="d-flex flex-wrap justify-content-center acesso-lista mb-4">
                {visiveis.map(cartao => (
                    <Link key={cartao.link} href={cartao.link} className="card-acesso">
                        <div className="icone-acesso">
                            <span className={`material-symbols-rounded${cartao.girar ? ' icone-rotacionado' : ''}`}>
                                {cartao.icone}
                            </span>
                        </div>
                        <div>
                            <h4 className="text-center">{cartao.titulo}</h4>
                            <p className="card-acesso-descricao">{cartao.descricao}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* O botão só aparece se houver mais de 4 cartões */}
            {todos.length > 4 && (
                <div className="text-center">
                    <button className="btn btn-laranja btn-lg" onClick={() => setMostrarTodos(!mostrarTodos)}>
                        {mostrarTodos ? 'MOSTRAR MENOS' : 'MAIS SERVIÇOS'}
                    </button>
                </div>
            )}
        </div>
    </section>
    )
}
