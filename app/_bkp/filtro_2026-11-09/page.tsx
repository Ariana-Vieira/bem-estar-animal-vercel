'use client'

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CustomHeader } from "@/componentes/CustomHeader/CustomHeader";
import { CustomAcessibilidade } from "@/componentes/CustomAcessibilidade/CustomAcessibilidade";
import { CustomNavBar } from "@/componentes/CustomNavBar/CustomNavBar";
import { CustomFooter } from "@/componentes/CustomFooter/CustomFooter";
import style from "./filtro.module.css"
import { CustomSection } from "@/componentes/CustomSection/CustomSection";
import { CustomButton } from "@/componentes/CustomButton/CustomButton";

export default function FiltroPage() {
    const router = useRouter()
    const [menuAberto, setMenuAberto] = useState(false)
    const [indicePergunta, setIndicePergunta] = useState(0)
    const [respostaSelecionada, setRespostaSelecionada] = useState("")
    const [respostas, setRespostas] = useState<Record<number, string>>({})
    const [casaAtual, setCasaAtual] = useState(0)
    const [animalJogador, setAnimalJogador] = useState("dog")
    const [posicaoCachorro, setPosicaoCachorro] = useState({ x: 100, y: 200 })
    const [posicaoBalao, setPosicaoBalao] = useState({ left: "10%", top: "11%" })
    const [pontosTrilha, setPontosTrilha] = useState<Array<{ x: number; y: number; ang: number }>>([])
    const [movendo, setMovendo] = useState(false)
    const [fimQuiz, setFimQuiz] = useState(false)
    const [mostrarModal, setMostrarModal] = useState(false)
    const [logsQuiz, setLogsQuiz] = useState<string[]>([])
    const [confetes, setConfetes] = useState<Array<{ left: string; color: string; delay: string; duration: string }>>([])
    const trilhaRef = useRef<SVGPathElement | null>(null)

    const perguntas = [
        {
            titulo: "Você prefere:",
            opcoes: [
                { texto: "Cachorro", valor: "dog" },
                { texto: "Gato", valor: "cat" },
            ],
        },
        {
            titulo: "Qual porte você prefere:",
            opcoes: [
                { texto: "Pequeno porte", valor: "pequeno" },
                { texto: "Médio porte", valor: "medio" },
                { texto: "Grande porte", valor: "grande" },
            ],
        },
        {
            titulo: "Qual ambiente você prefere:",
            opcoes: [
                { texto: "Apartamento", valor: "apartamento" },
                { texto: "Casa com quintal", valor: "casa" },
            ],
        },
        {
            titulo: "Quanto tempo você tem para exercícios:",
            opcoes: [
                { texto: "Pouco tempo", valor: "pouco" },
                { texto: "Tempo moderado", valor: "moderado" },
                { texto: "Muito tempo", valor: "muito" },
            ],
        },
        {
            titulo: "Qual sua experiência com pets:",
            opcoes: [
                { texto: "Iniciante", valor: "iniciante" },
                { texto: "Intermediário", valor: "intermediario" },
                { texto: "Experiente", valor: "experiente" },
            ],
        },
        {
            titulo: "Você prefere um pet:",
            opcoes: [
                { texto: "Mais calmo e tranquilo", valor: "calmo" },
                { texto: "Mais ativo e brincalhão", valor: "ativo" },
            ],
        },
    ]

    const totalCasas = 20

    const sleep = (tempo: number) => new Promise((resolve) => setTimeout(resolve, tempo))

    const adicionarLog = (mensagem: string) => {
        const horario = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        setLogsQuiz((atual) => [`[${horario}] ${mensagem}`, ...atual].slice(0, 10))
    }

    const gerarConfetes = () => {
        const itens = Array.from({ length: 100 }, () => ({
            left: `${Math.random() * 100}%`,
            color: `hsl(${Math.random() * 360}, 100%, 70%)`,
            delay: `${Math.random() * 3}s`,
            duration: `${3 + Math.random() * 2}s`,
        }))

        setConfetes(itens)
    }

    useEffect(() => {
        const trilha = trilhaRef.current

        if (!trilha) {
            return
        }

        const comprimento = trilha.getTotalLength()
        const passo = comprimento / (totalCasas - 1)
        const pontos: Array<{ x: number; y: number; ang: number }> = []

        for (let i = 0; i < totalCasas; i += 1) {
            const tamanho = i * passo
            const pt = trilha.getPointAtLength(tamanho)
            const prox = trilha.getPointAtLength(Math.min(tamanho + 1, comprimento))
            const ang = (Math.atan2(prox.y - pt.y, prox.x - pt.x) * 180) / Math.PI

            pontos.push({ x: pt.x, y: pt.y, ang })
        }

        setPontosTrilha(pontos)
    }, [])

    useEffect(() => {
        if (pontosTrilha.length === 0) {
            return
        }

        const atual = pontosTrilha[Math.min(casaAtual, pontosTrilha.length - 1)]

        setPosicaoCachorro({ x: atual.x, y: atual.y })

        const topoBalao = Math.max(2, ((atual.y - 108) / 600) * 100)
        setPosicaoBalao({
            left: `calc(${(atual.x / 1000) * 100}% - 20px)`,
            top: `${topoBalao}%`,
        })
    }, [casaAtual, pontosTrilha])

    useEffect(() => {
        adicionarLog("Questionário carregado. Responda para encontrar seu companheiro ideal.")
    }, [])

    const moverPorPassos = async (passos: number) => {
        const alvo = Math.min(totalCasas - 1, casaAtual + passos)

        for (let i = casaAtual + 1; i <= alvo; i += 1) {
            await sleep(230)
            setCasaAtual(i)
        }

        return alvo
    }

    const responderPergunta = async () => {
        if (!respostaSelecionada || movendo || fimQuiz) {
            return
        }

        setMovendo(true)

        const novasRespostas = { ...respostas, [indicePergunta]: respostaSelecionada }
        setRespostas(novasRespostas)

        if (indicePergunta === 0) {
            setAnimalJogador(respostaSelecionada === "cat" ? "cat" : "dog")
            adicionarLog(respostaSelecionada === "cat" ? "Você escolheu gato. O jogador agora é um gatinho." : "Você escolheu cachorro.")
        }

        adicionarLog("Resposta confirmada. Avançando 3 casas.")
        const novaCasa = await moverPorPassos(3)

        if (indicePergunta < perguntas.length - 1 && novaCasa < totalCasas - 1) {
            setIndicePergunta((valorAtual) => valorAtual + 1)
        } else {
            const chaves = ["especie", "porte", "ambiente", "exercicio", "experiencia", "personalidade"]
            const resultado: Record<string, string> = {}
            chaves.forEach((chave, i) => {
                resultado[chave] = novasRespostas[i] ?? ""
            })
            localStorage.setItem("quizRespostas", JSON.stringify(resultado))

            setFimQuiz(true)
            setMostrarModal(true)
            gerarConfetes()
            adicionarLog("Parabéns! Você concluiu o caminho e está pronto para adotar.")
        }

        setRespostaSelecionada("")
        setMovendo(false)
    }

    return (
        <>
            {/* <!-- Icones Acessibilidade --> */}
            <CustomAcessibilidade />

            {/* <!-- Cabeçalho Principal - Header --> */}
            <CustomHeader />

            {/* <!-- Navegação --> */}
            <CustomNavBar isMenuOpen={menuAberto} onOpenMenu={() => setMenuAberto(true)} />


{/* Componentizar section e article */}
            <main className={style.paginaFiltro}>
                <CustomSection className={style.cabecalhoTitulo}>
                    <h1>SOBRE NOSSO CANIL</h1>
                </CustomSection>

                <CustomSection className={style.historiaSection}>
                    <h2>NOSSA HISTÓRIA</h2>
                    <div className={style.historiaTexto} >
                        O Departamento de Proteção e Bem-Estar Animal (DPBEA) é o setor responsável por promover ações que garantem a proteção, cuidado e qualidade de vida dos animais do município de Votorantim. Dentro do projeto, o DPBEA ganha uma plataforma moderna e totalmente integrada ao sistema administrativo, permitindo mais transparência e eficiência na divulgação de cães e gatos disponíveis para adoção.
                        Por meio dessa ferramenta, o departamento pode gerenciar em um só lugar todas as informações dos animais: fotos, vídeos, histórico, perfil social, vacinação, adestramento e status de adoção. Isso facilita o acompanhamento do processo, aumenta a visibilidade dos animais e aproxima o DPBEA da comunidade, fortalecendo a adoção responsável.
                    </div>
                </CustomSection>

                <section className={style.cardsAtividades}>
                    <article className={style.cardAtividade}>
                        <h3>PASSEIO DIVERTIDO</h3>
                        <div className={style.cardConteudo}>
                            <img src="/bg_passeio.png" alt="Passeio com cachorro" />
                            <p>
                                Se você tem tempo sobrando? Que tal levar um AUmigo do Canil para passear?
                                Basta você escolher um AUmigo, fazer seu cadastro e aguardar um humano te mandar
                                mensagem para a diversão começar.
                            </p>
                        </div>
                        <CustomButton label="PASSEAR" className={style.cardBotao} onClick={() => router.push('/adocao-responsavel#passeio')}></CustomButton>
                    </article>

                    <article className={style.cardAtividade}>
                        <h3>FESTA DO PIJAMA</h3>
                        <div className={style.cardConteudo}>
                            <img src="/bg_festaPijama.png" alt="Cachorro com pijama" />
                            <p>
                                Eu e meus AUmigos amamos uma festa. Que tal comprar uns petiscos e assistir um filme
                                de chorar abraçada comigo, ou um filme de terror e eu te protejo? Escolha um AUmigo,
                                se cadastre e um humano irá entrar em contato.
                            </p>
                        </div>
                        <CustomButton label="FESTA DO PIJAMA" className={style.cardBotao} onClick={() => router.push('/adocao-responsavel#festa-do-pijama')}></CustomButton>
                    </article>
                </section>

                <section className={style.ctaAdotar}>
                    <div>
                        <h3>PARA ADOTAR</h3>
                        <p>
                            Para que você encontre seu melhor amigo de primeira, fizemos um joguinho para você preencher.
                            Caso queira conhecer todos os animais do canil, só clicar ao lado.
                        </p>
                    </div>
                    <CustomButton label="CONHECER TODOS" className={style.ctaAdotarButton} onClick={() => { localStorage.removeItem("quizRespostas"); router.push('/meetinpet'); }}></CustomButton>
                </section>

                <section className={style.trilhaSection}>
                    <div className={style.trilhaCanvas}>
                        {!fimQuiz && (
                            <div className={style.quizBaloon} style={{ left: posicaoBalao.left, top: posicaoBalao.top }}>
                                <h4>{perguntas[indicePergunta].titulo}</h4>
                                <div className={style.quizOptions}>
                                    {perguntas[indicePergunta].opcoes.map((opcao) => (
                                        <label key={opcao.valor}>
                                            <input
                                                type="radio"
                                                name="prefere"
                                                value={opcao.valor}
                                                checked={respostaSelecionada === opcao.valor}
                                                onChange={(e) => setRespostaSelecionada(e.target.value)}
                                            />
                                            {opcao.texto}
                                        </label>
                                    ))}
                                    <button type="button" onClick={responderPergunta} disabled={!respostaSelecionada || movendo}>Responder</button>
                                </div>
                                <p>Pergunta {Math.min(indicePergunta + 1, perguntas.length)} de {perguntas.length}</p>
                            </div>
                        )}

                        <svg className={style.gameBoard} viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                            <path
                                ref={trilhaRef}
                                className={style.trilhaPath}
                                d="M 100 200 C 300 200, 300 350, 500 350 C 700 350, 700 500, 900 500"
                            />

                            {pontosTrilha.map((ponto, idx) => (
                                <text
                                    key={`empty-${idx}`}
                                    x={ponto.x}
                                    y={ponto.y}
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    transform={`rotate(${ponto.ang + 90},${ponto.x},${ponto.y})`}
                                    className={style.pawEmpty}
                                    opacity={idx <= casaAtual ? 0 : 0.35}
                                >
                                    🐾
                                </text>
                            ))}

                            {pontosTrilha.map((ponto, idx) => (
                                idx <= casaAtual ? (
                                    <text
                                        key={`filled-${idx}`}
                                        x={ponto.x}
                                        y={ponto.y}
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                        transform={`rotate(${ponto.ang + 90},${ponto.x},${ponto.y})`}
                                        className={style.pawFilled}
                                    >
                                        🐾
                                    </text>
                                ) : null
                            ))}

                            <image
                                href={`/${animalJogador}.png`}
                                width={84}
                                height={84}
                                className={style.petTrilha}
                                style={{
                                    transform: `translate(${posicaoCachorro.x - 42}px, ${posicaoCachorro.y - 84}px)`,
                                    transition: "transform 0.45s ease",
                                }}
                            />
                        </svg>

                        <img src="/SolLua.png" alt="mascotes Sol e Lua" className={style.mascoteImagem} />

                        <article className={style.cartaoHistoriaTopo}>
                            <p>Olá, Muito prazer! Nós somos os mascotes do Departamento de Proteção e Bem-Estar Animal, somos Sol e Lua. Responda as perguntas para sabermos se está apto a nos levar pra casa.</p>
                        </article>

                        

                        <img src="/bg_casinhaPet.png" alt="Casinha de cachorro" className={style.casinhaFim} />
                    </div>

                    <div className={style.bottomActions}>
                        <div className={style.logPanel}>
                            {logsQuiz.map((item, index) => (
                                <div key={index} className={style.logItem}>{item}</div>
                            ))}
                        </div>

                        <CustomButton 
                            label="Conhecer os animais" 
                            className={style.gameConhecerBtn} 
                            onClick={() => { if (!fimQuiz) localStorage.removeItem("quizRespostas"); router.push('/meetinpet'); }}
                        ></CustomButton>
                    </div>
                </section>
            </main>

            <div className={`${style.congratulationsModal} ${mostrarModal ? style.showModal : ""}`}>
                <div className={style.modalContent}>
                    <span className={style.modalEmoji}>🎉</span>
                    Parabéns!
                    < br />
                    Você está preparado para adotar um amigo!
                    <button
                        type="button"
                        className={style.cardBotao}
                        style={{ marginTop: "1rem" }}
                        onClick={() => router.push("/meetinpet")}
                    >
                        VER MEUS RESULTADOS
                    </button>
                </div>
                <div className={style.confettiContainer}>
                    {confetes.map((item, index) => (
                        <span
                            key={`confetti-${index}`}
                            className={style.confetti}
                            style={{
                                left: item.left,
                                backgroundColor: item.color,
                                animationDelay: item.delay,
                                animationDuration: item.duration,
                            }}
                        ></span>
                    ))}
                </div>
            </div>

            {/* <!-- Rodapé --> */}
            <CustomFooter />
        </>
    )
}