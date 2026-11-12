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
import { PataFundo } from "@/componentes/PataFundo/PataFundo";

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
    const [pedirVertical, setPedirVertical] = useState(false)
    const [logsQuiz, setLogsQuiz] = useState<string[]>([])
    const [confetes, setConfetes] = useState<Array<{ left: string; color: string; delay: string; duration: string }>>([])
    const trilhaRef = useRef<SVGPathElement | null>(null)
    const secaoJogoRef = useRef<HTMLElement | null>(null)
    const canvasRef = useRef<HTMLDivElement | null>(null)
    const balaoRef = useRef<HTMLDivElement | null>(null)
    const [larguras, setLarguras] = useState({ canvas: 0, balao: 0, balaoAlt: 0 })

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
            titulo: "Você mora em:",
            opcoes: [
                { texto: "Casa", valor: "casa" },
                { texto: "Apartamento", valor: "apartamento" },
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

    // Porte não faz sentido para gato: quem escolheu gato responde sobre a idade no lugar
    const perguntaIdadeGato = {
        titulo: "Qual idade você prefere:",
        opcoes: [
            { texto: "Filhotes (até 6 meses)", valor: "filhote" },
            { texto: "Adultos (6 meses a 7 anos)", valor: "adulto" },
            { texto: "Idosos (acima de 7 anos)", valor: "idoso" },
        ],
    }
    // Exercício também não serve para gato: pergunta se a residência é telada
    const perguntaTeladaGato = {
        titulo: "Sua residência é telada?",
        opcoes: [
            { texto: "Sim, é telada", valor: "sim" },
            { texto: "Não é telada", valor: "nao" },
        ],
    }
    const ehGato = animalJogador === "cat"
    const perguntaAtual =
        ehGato && indicePergunta === 1 ? perguntaIdadeGato
        : ehGato && indicePergunta === 3 ? perguntaTeladaGato
        : perguntas[indicePergunta]

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
            left: `calc(${(atual.x / 1000) * 100}% + 30px)`,
            top: `${topoBalao}%`,
        })
    }, [casaAtual, pontosTrilha])

    useEffect(() => {
        adicionarLog("Questionário carregado. Responda para encontrar seu companheiro ideal.")
    }, [])

    // Mede a largura do jogo e do balão (mudam com a tela) para o balão não sair pelas laterais
    useEffect(() => {
        const medir = () => setLarguras({
            canvas: canvasRef.current?.offsetWidth ?? 0,
            balao: balaoRef.current?.offsetWidth ?? 0,
            balaoAlt: balaoRef.current?.offsetHeight ?? 0,
        })
        const observador = new ResizeObserver(medir)
        if (canvasRef.current) observador.observe(canvasRef.current)
        if (balaoRef.current) observador.observe(balaoRef.current)
        return () => observador.disconnect()
    }, [])

    // Com o card "volte para a vertical" aberto, assim que o celular fica em pé vai para os resultados
    useEffect(() => {
        if (!pedirVertical) return
        const emPe = window.matchMedia('(orientation: portrait)')
        const aoGirar = () => { if (emPe.matches) router.push('/meetinpet#recomendacoes') }
        emPe.addEventListener('change', aoGirar)
        return () => emPe.removeEventListener('change', aoGirar)
    }, [pedirVertical, router])

    // Celular: ao girar para a horizontal com o jogo na tela, rola até ele
    useEffect(() => {
        const secao = secaoJogoRef.current
        if (!secao) return

        let jogoNaTela = false
        const observador = new IntersectionObserver(([entrada]) => { jogoNaTela = entrada.isIntersecting })
        observador.observe(secao)

        const celularDeitado = window.matchMedia('(orientation: landscape) and (max-height: 500px)')
        const aoGirar = () => {
            if (celularDeitado.matches && jogoNaTela) secao.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        celularDeitado.addEventListener('change', aoGirar)

        return () => {
            observador.disconnect()
            celularDeitado.removeEventListener('change', aoGirar)
        }
    }, [])

    const moverPorPassos = async (passos: number) => {
        const alvo = Math.min(totalCasas - 1, casaAtual + passos)

        for (let i = casaAtual + 1; i <= alvo; i += 1) {
            await sleep(230)
            setCasaAtual(i)
        }

        return alvo
    }

    // Vai para os animais recomendados; com o celular deitado, antes pede para voltar à vertical
    const verResultados = () => {
        const celularDeitado = window.matchMedia('(orientation: landscape) and (max-height: 500px)').matches
        if (celularDeitado) setPedirVertical(true)
        else router.push('/meetinpet#recomendacoes')
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
            // Para gato, a 2ª resposta é a idade (não o porte) e a 4ª é se a casa é telada (não o exercício)
            if (novasRespostas[0] === "cat") {
                resultado.idade = resultado.porte
                resultado.porte = ""
                resultado.telada = resultado.exercicio
                resultado.exercicio = ""
            }
            localStorage.setItem("quizRespostas", JSON.stringify(resultado))

            setFimQuiz(true)
            setMostrarModal(true)
            gerarConfetes()
            adicionarLog("Parabéns! Você concluiu o caminho e está pronto para adotar.")
        }

        setRespostaSelecionada("")
        setMovendo(false)
    }

    // Centro do balão preso dentro do jogo, sem sair pelas laterais
    let estiloBalao: React.CSSProperties = { left: posicaoBalao.left, top: posicaoBalao.top }
    let petNoBalao = 45 // posição do bichinho dentro do balão, em % da largura do balão
    if (larguras.canvas > 0 && larguras.balao > 0) {
        const xPet = (posicaoCachorro.x / 1000) * larguras.canvas
        const meia = larguras.balao / 2
        const centro = Math.min(Math.max(xPet + 30, meia), larguras.canvas - meia)
        estiloBalao = { left: `${centro}px`, top: posicaoBalao.top }
        petNoBalao = ((xPet - (centro - meia)) / larguras.balao) * 100
    }

    // Contorno do balão de gibi (oval + cauda numa linha só), num quadro de 100x100.
    // A cauda sai da parte de baixo do oval e a ponta se inclina na direção do bichinho.
    const limitar = (valor: number, min: number, max: number) => Math.min(Math.max(valor, min), max)
    const baseCauda = limitar(petNoBalao, 28, 72)
    const pontaCauda = limitar(petNoBalao, 6, 94)
    const alturaNoOval = (x: number) => 50 + 50 * Math.sqrt(1 - ((x - 50) / 50) ** 2)

    // A cauda acompanha o tamanho do jogo: o balão tem tamanho fixo, mas o espaço entre ele e o bichinho
    // encolhe junto com o jogo em telas menores. Por isso o comprimento e a base da cauda são medidos em
    // pixels (proporcionais ao jogo) e só depois convertidos para o quadro 100x100 do desenho.
    let meiaBase = 8   // metade da largura da base da cauda, em % da largura do balão
    let ponta = 116    // altura da ponta da cauda, em % da altura do balão (100 = borda de baixo)
    if (larguras.canvas > 0 && larguras.balao > 0 && larguras.balaoAlt > 0) {
        const escala = larguras.canvas / 1000
        meiaBase = (limitar(18 * escala, 8, 22) / larguras.balao) * 100
        ponta = 100 + ((30 * escala) / larguras.balaoAlt) * 100
    }
    const x1 = baseCauda - meiaBase
    const x2 = baseCauda + meiaBase
    const caminhoBalao = `M ${x1} ${alturaNoOval(x1)} A 50 50 0 1 1 ${x2} ${alturaNoOval(x2)} L ${pontaCauda} ${ponta} Z`

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
                <PataFundo />
                <CustomSection className={style.cabecalhoTitulo}>
                    <h1>DESCUBRA SEU PET IDEAL</h1>
                </CustomSection>

                <section className={style.ctaAdotar}>
                    <div>
                        <h3>COMO FUNCIONA A ADOÇÃO?</h3>
                        <p>
                            Entenda a adoção responsável, o passeio, a Festa do Pijama e o lar temporário antes de começar.
                        </p>
                    </div>
                    <CustomButton label="SAIBA MAIS" className={style.ctaAdotarButton} onClick={() => router.push('/adocao-responsavel')}></CustomButton>
                </section>

                <section className={style.ctaAdotar}>
                    <div>
                        <h3>PARA ADOTAR</h3>
                        <p>
                            Responda a algumas perguntas rápidas com Sol e Lua e descubra qual aumigo combina com você.
                            Prefere ver todos os animais do canil? É só clicar ao lado.
                        </p>
                    </div>
                    <CustomButton label="CONHECER TODOS" className={style.ctaAdotarButton} onClick={() => { localStorage.removeItem("quizRespostas"); router.push('/meetinpet'); }}></CustomButton>
                </section>

                <section className={style.trilhaSection} ref={secaoJogoRef}>
                    {/* Só aparece no celular em pé (ver filtro.module.css) */}
                    <div className={style.avisoGirar}>
                        <span className="material-symbols-rounded">screen_rotation</span>
                        <strong>Gire o celular para jogar</strong>
                        <p>A trilha de Sol e Lua fica melhor na horizontal. Vire o aparelho e o jogo se ajusta à sua tela.</p>
                    </div>

                    <div className={style.trilhaCanvas} ref={canvasRef}>
                        {!fimQuiz && (
                            <div className={style.quizBaloon} ref={balaoRef} style={estiloBalao}>
                                <svg className={style.balaoFundo} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                                    <path d={caminhoBalao} vectorEffect="non-scaling-stroke" />
                                </svg>
                                <h4>{perguntaAtual.titulo}</h4>
                                <div className={style.quizOptions}>
                                    {perguntaAtual.opcoes.map((opcao) => (
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

                            {/* Pegada desenhada (não é emoji): o emoji muda de cor conforme o aparelho */}
                            <defs>
                                <g id="pata-trilha">
                                    <ellipse cx="0" cy="4.5" rx="6.5" ry="5.5" />
                                    <ellipse cx="-8.5" cy="-2" rx="2.7" ry="3.6" transform="rotate(-25 -8.5 -2)" />
                                    <ellipse cx="-3.2" cy="-8" rx="2.7" ry="3.8" transform="rotate(-8 -3.2 -8)" />
                                    <ellipse cx="3.2" cy="-8" rx="2.7" ry="3.8" transform="rotate(8 3.2 -8)" />
                                    <ellipse cx="8.5" cy="-2" rx="2.7" ry="3.6" transform="rotate(25 8.5 -2)" />
                                </g>
                            </defs>

                            {/* Os dedos apontam para onde o bichinho vai; os passos alternam para os lados */}
                            {pontosTrilha.map((ponto, idx) => (
                                <g
                                    key={`empty-${idx}`}
                                    transform={`translate(${ponto.x},${ponto.y}) rotate(${ponto.ang + 90}) translate(${idx % 2 ? 6 : -6},0)`}
                                    className={style.pawEmpty}
                                    opacity={idx <= casaAtual ? 0 : 0.35}
                                >
                                    <use href="#pata-trilha" />
                                </g>
                            ))}

                            {pontosTrilha.map((ponto, idx) => (
                                idx <= casaAtual ? (
                                    <g
                                        key={`filled-${idx}`}
                                        transform={`translate(${ponto.x},${ponto.y}) rotate(${ponto.ang + 90}) translate(${idx % 2 ? 6 : -6},0)`}
                                        className={style.pawFilled}
                                    >
                                        <use href="#pata-trilha" />
                                    </g>
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
                    {pedirVertical ? (
                        <>
                            <span className={`material-symbols-rounded ${style.modalIconeGirar}`}>screen_rotation</span>
                            Volte o celular para a posição vertical
                            <p className={style.modalAviso}>Assim você vê com calma os animais que combinam com você.</p>
                            <button
                                type="button"
                                className={style.modalBotaoSecundario}
                                onClick={() => router.push("/meetinpet#recomendacoes")}
                            >
                                Ver assim mesmo
                            </button>
                        </>
                    ) : (
                        <>
                            <span className={style.modalEmoji}>🎉</span>
                            Parabéns!
                            < br />
                            Você está preparado para adotar um amigo!
                            <button
                                type="button"
                                className={style.cardBotao}
                                style={{ marginTop: "1rem" }}
                                onClick={verResultados}
                            >
                                VER MEUS RESULTADOS
                            </button>
                        </>
                    )}
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