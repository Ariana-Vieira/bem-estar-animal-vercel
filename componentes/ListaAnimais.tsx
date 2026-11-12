import { useState, useMemo, useEffect } from "react"
import { CustomAnimalCard } from "./CustomAnimalCard/CustomAnimalCard"
import { CustomSelect } from "./CustomSelect/CustomSelect"
import { CustomButton } from "@/componentes/CustomButton/CustomButton";
import style from "./CustomAnimalCard/CustomAnimalCard.module.css"
import styleBtn from "@/componentes/CustomButton/CustomButton.module.css"
import listaInicial from "@/data/animais.json"
import { CustomTitle } from "./CustomTitle/CustomTitle";
import { CustomAlert } from "./CustomAlert/CustomAlert";


type Animal = {
    nome: string
    imagem: string
    especie: string
    sexo: string
    porte: string
    idade: string
    peso: string
    raca: string
    vacinacao: boolean
    ambiente: string
    exercicio: string
    experiencia: string
    personalidade: string
}

type QuizRespostas = {
    especie: string
    porte: string
    idade?: string
    ambiente: string
    exercicio: string
    experiencia: string
    personalidade: string
}

const nivelExperiencia: Record<string, number> = {
    iniciante: 1,
    intermediario: 2,
    experiente: 3,
}


// Faixas de idade cadastradas nos animais, agrupadas como o quiz do gato pergunta
const faixasDeIdade: Record<string, string[]> = {
    filhote: ["menor que 03 meses", "3 meses a 05 meses"],
    adulto: ["06 meses a 07 anos"],
    idoso: ["acima de 07 anos"],
}

function calcularScore(animal: Animal, quiz: QuizRespostas): number {
    let score = 0
    // Gato: o quiz pergunta a idade; cachorro: pergunta o porte
    if (quiz.idade) {
        if (faixasDeIdade[quiz.idade]?.includes(animal.idade)) score += 1
    } else if (animal.porte === quiz.porte) {
        score += 1
    }
    if (animal.ambiente === "ambos" || animal.ambiente === quiz.ambiente) score += 1
    // Gato não responde sobre exercício; sem esse teste um animal sem exercício cadastrado ganharia ponto à toa
    if (quiz.exercicio && animal.exercicio === quiz.exercicio) score += 1
    if (animal.personalidade === quiz.personalidade) score += 1
    const nivelAnimal = nivelExperiencia[animal.experiencia] ?? 1
    const nivelUsuario = nivelExperiencia[quiz.experiencia] ?? 1
    if (nivelAnimal <= nivelUsuario) score += 1
    return score
}

export const ListaAnimais = ({ onLimparQuiz }: { onLimparQuiz?: () => void }) => {
    interface IAlert {
    show?: boolean;
    message?: string;
    variant?: "warning" | "success";
    }
    const [alert, setAlert] = useState<IAlert>();


    const animais = listaInicial as Animal[]

    
    const [textoBusca, setTextoBusca] = useState('')

    const [filtros, setFiltros] = useState({
        especie: "",
        sexo: "",
        porte: "",
        idade: "",
        peso: ""
    })

    const [quizRespostas, setQuizRespostas] = useState<QuizRespostas | null>(null)
    // Com resultado do quiz, a página começa só com as recomendações; este estado mostra a lista completa
    const [mostrarTodos, setMostrarTodos] = useState(false)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const busca = params.get('busca') ?? ''
        setTextoBusca(busca)
    }, [])

    useEffect(() => {
        const salvo = localStorage.getItem("quizRespostas")
        if (salvo) {
            try {
                setQuizRespostas(JSON.parse(salvo))
            } catch {
                // ignorar JSON inválido
            }
        }
    }, [])

    

    // Só recomendados: há resultado do quiz, ninguém pediu "ver todos" e não há busca ativa
    const modoRecomendado = !!quizRespostas && !mostrarTodos && !textoBusca

    useEffect(() => {
        if (mostrarTodos) {
            document.getElementById("todos-animais")?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }, [mostrarTodos])

    // Chegando do quiz (endereço com #recomendacoes), já abre na parte dos animais recomendados
    useEffect(() => {
        if (modoRecomendado && window.location.hash === "#recomendacoes") {
            document.getElementById("recomendacoes")?.scrollIntoView({ block: "start" })
        }
    }, [modoRecomendado])

    const limparRecomendacoes = () => {
        localStorage.removeItem("quizRespostas")
        setQuizRespostas(null)
        onLimparQuiz?.()
    }

    const animaisRecomendados = useMemo(() => {
        if (!quizRespostas) return []
        const especieMapeada = quizRespostas.especie === "dog" ? "cachorro" : "gato"
        return animais
            .filter((a) => a.especie === especieMapeada)
            .map((a) => ({ animal: a, score: calcularScore(a, quizRespostas) }))
            .filter(({ score }) => score >= 2)
            .sort((a, b) => b.score - a.score)
            .map(({ animal }) => animal)
    }, [quizRespostas, animais])

// PARA o ALERT
    useEffect(() => {
    // Só dispara o alerta se o usuário tiver respostas E a lista de recomendados estiver vazia
        if (quizRespostas && animaisRecomendados.length === 0) {
            setAlert({
                show: true,
                message: "Nenhum animal encontrado para o seu perfil. Confira todos abaixo!",
                variant: "warning",
            });
        } else {
            // Se a lista tiver animais ou o quiz for limpo, esconde o alerta de "nenhum encontrado"
            setAlert(prev => prev?.variant === "warning" ? { ...prev, show: false } : prev);
        }
    }, [quizRespostas, animaisRecomendados]); // Roda sempre que o quiz ou os recomendados mudarem



    const animaisFiltrados = useMemo(() => {
        const termo = textoBusca.toLowerCase()
        return animais.filter((animal) => {
            const matchBusca = !termo ||
                animal.nome.toLowerCase().includes(termo) ||
                animal.raca.toLowerCase().includes(termo)
            return (
                matchBusca &&
                (!filtros.especie || animal.especie === filtros.especie) &&
                (!filtros.sexo || animal.sexo === filtros.sexo) &&
                (!filtros.porte || animal.porte === filtros.porte) &&
                (!filtros.idade || animal.idade === filtros.idade) &&
                (!filtros.peso || animal.peso === filtros.peso)
            )
        })
    }, [filtros, animais, textoBusca])

    return (
        <>
            {/* RECOMENDAÇÕES DO QUIZ (só elas, até clicar em "Ver todos os animais") */}
            {modoRecomendado && (
                <>
                    <div id="recomendacoes" style={{ width: "100%", display: "flex", flexDirection:"column", alignItems: "center", gap: "1rem", marginBottom: "1rem", scrollMarginTop: "12px" }}>
                        <h2 className="titulo-secao text-center">Principais recomendações para você 🐾</h2>

                        <CustomAlert message={alert?.message} show={alert?.show} variant={alert?.variant} />

                        <CustomButton
                            label="Limpar recomendações"
                            onClick={limparRecomendacoes}
                            className={styleBtn.clearBtn}>
                        </CustomButton>
                    </div>

                    {animaisRecomendados.length > 0 && (
                        <section className={style.cards}>
                            {animaisRecomendados.map((animal, index) => (
                                <CustomAnimalCard key={`rec-${index}`} {...animal} />
                            ))}
                        </section>
                    )}

                    <div className={styleBtn.verTodos}>
                        <CustomButton
                            label="Ver todos os animais"
                            className={styleBtn.verTodosBtn}
                            onClick={() => setMostrarTodos(true)} />
                    </div>
                </>
            )}

            {/* LISTA COMPLETA: título e botão para voltar às recomendações */}
            {!modoRecomendado && quizRespostas && (
                <div id="todos-animais" style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginBottom: "1rem", scrollMarginTop: "24px" }}>
                    <CustomTitle title="TODOS OS ANIMAIS" style={{ margin: 0 }} />
                    <CustomButton
                        label="Voltar às recomendações"
                        onClick={() => setMostrarTodos(false)}
                        className={styleBtn.clearBtn}>
                    </CustomButton>
                </div>
            )}

            {!modoRecomendado && (
            <>
            {/* INDICADOR DE BUSCA ATIVA */}
            {textoBusca && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", padding: "0.6rem 1rem", background: "#e8f7f7", borderRadius: "50px", border: "1px solid rgba(52,136,136,0.25)", width: "fit-content" }}>
                    <span className="material-symbols-rounded" style={{ color: "#348888", fontSize: "1.1rem" }}>search</span>
                    <span style={{ color: "#348888", fontWeight: 600, fontSize: "0.9rem" }}>
                        Resultados para: <em>"{textoBusca}"</em>
                    </span>
                    <button
                        type="button"
                        onClick={() => setTextoBusca('')}
                        style={{ background: "none", border: "none", color: "#348888", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
                        aria-label="Limpar busca"
                    >
                        <span className="material-symbols-rounded" style={{ fontSize: "1.1rem" }}>close</span>
                    </button>
                </div>
            )}

            {/* FILTROS MANUAIS */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <CustomSelect
                    id="filtroEspecie"
                    placeholder="Espécie"
                    value={filtros.especie}
                    onChange={(v) => setFiltros(p => ({ ...p, especie: v }))}
                    options={[
                        { label: "Gato", value: "gato" },
                        { label: "Cachorro", value: "cachorro" }
                    ]}
                />

                <CustomSelect
                    id="filtroSexo"
                    placeholder="Sexo"
                    value={filtros.sexo}
                    onChange={(v) => setFiltros(p => ({ ...p, sexo: v }))}
                    options={[
                        { label: "Macho", value: "macho" },
                        { label: "Fêmea", value: "femea" }
                    ]}
                />

                <CustomSelect
                    id="filtroPorte"
                    placeholder="Porte"
                    value={filtros.porte}
                    onChange={(v) => setFiltros(p => ({ ...p, porte: v }))}
                    options={[
                        { label: "Pequeno", value: "pequeno" },
                        { label: "Médio", value: "medio" },
                        { label: "Grande", value: "grande" }
                    ]}
                />

                <CustomSelect
                    id="filtroIdade"
                    placeholder="Idade"
                    value={filtros.idade}
                    onChange={(v) => setFiltros(p => ({ ...p, idade: v }))}
                    options={[
                        { label: "Menor que 03 meses", value: "menor que 03 meses" },
                        { label: "03 meses a 05 meses", value: "3 meses a 05 meses" },
                        { label: "06 meses a 07 anos", value: "06 meses a 07 anos" },
                        { label: "Acima de 07 anos", value: "acima de 07 anos" }
                    ]}
                />

                <CustomSelect
                    id="filtroPeso"
                    placeholder="Peso"
                    value={filtros.peso}
                    onChange={(v) => setFiltros(p => ({ ...p, peso: v }))}
                    options={[
                        { label: "Até 5kg", value: "ate 5kg" },
                        { label: "De 06 a 15kg", value: "de 06 a 15kg" },
                        { label: "Acima de 15kg", value: "acima de 15kg" }
                    ]}
                />
            </div>

            {/* LISTA COMPLETA */}
            <section className={style.cards}>
                {animaisFiltrados.length === 0 ? (
                    
                    <p>Nenhum animal encontrado!</p>
                ) : (
                    animaisFiltrados.map((animal, index) => (
                        <CustomAnimalCard key={index} {...animal} />
                    ))
                )}
                <div className={styleBtn.verTodos}>
                    <CustomButton
                        label="Clique para exibir todos"
                        className={styleBtn.verTodosBtn}
                        onClick={() =>
                            setFiltros({
                                especie: "",
                                sexo: "",
                                porte: "",
                                idade: "",
                                peso: ""
                            })
                        } />
                </div>
            </section>
            </>
            )}
        </>
    )
}
