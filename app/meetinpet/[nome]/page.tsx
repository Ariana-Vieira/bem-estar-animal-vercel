'use client';
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { CustomHeader } from "@/componentes/CustomHeader/CustomHeader";
import { CustomAcessibilidade } from "@/componentes/CustomAcessibilidade/CustomAcessibilidade";
import { CustomNavBar } from "@/componentes/CustomNavBar/CustomNavBar";
import { CustomFooter } from "@/componentes/CustomFooter/CustomFooter";
import style from "./page.module.css";
import animais from "@/data/animais.json";
import { CustomButton } from "@/componentes/CustomButton/CustomButton";
import { CustomSection } from "@/componentes/CustomSection/CustomSection";
import { CustomTitle } from "@/componentes/CustomTitle/CustomTitle";

const especieLabel: Record<string, string> = { gato: "Gato", cachorro: "Cão" };
const especieEmoji: Record<string, string> = { gato: "🐈", cachorro: "🐕" };
const sexoLabel: Record<string, string> = { femea: "Fêmea", macho: "Macho" };
const sexoEmoji: Record<string, string> = { femea: "♀", macho: "♂" };
const porteLabel: Record<string, string> = { pequeno: "Pequeno", medio: "Médio", grande: "Grande" };

export default function DetalhesPage({ params }: { params: Promise<{ nome: string }> }) {
    const { nome } = use(params);
    const router = useRouter();
    const [menuAberto, setMenuAberto] = useState(false);
    const [imagemPrincipalIndex, setImagemPrincipalIndex] = useState(0);

    const animal = animais.find(a => a.nome.toLowerCase() === nome.toLowerCase());

    if (!animal) {
        return (
            <>
                <CustomAcessibilidade />
                <CustomHeader />
                <CustomNavBar isMenuOpen={menuAberto} onOpenMenu={() => setMenuAberto(true)} />
                <main style={{ padding: "4rem 2rem", textAlign: "center" }}>
                    <h1>Animal não encontrado</h1>
                    <p>Não encontramos nenhum animal com esse nome.</p>
                    <CustomButton label="Ver todos os animais" className={style.btnConhecer} onClick={() => router.push('/meetinpet')}></CustomButton>
                </main>
                <CustomFooter />
            </>
        );
    }

    const fotosUrls = animal.fotos.length > 0 ? animal.fotos.map(f => f.urlFoto) : [animal.imagem];
    const adestramentoAtual = animal.adestramento[0];

    return (
        <>
            <CustomAcessibilidade />
            <CustomHeader />
            <CustomNavBar isMenuOpen={menuAberto} onOpenMenu={() => setMenuAberto(true)} />
            <CustomSection className={style.titleDetails}>
                <CustomButton label="&lt;&lt; Voltar" onClick={() => router.back()} className={style.backButton}></CustomButton>
                <CustomTitle title="DETALHES"></CustomTitle>
            </CustomSection>

            <main className={style.detailsMain}>
                <section className={style.detailsContainer}>

                    <div className={style.heroSection}>
                        <article className={style.galeria}>
                            <div className={style.imagemPrincipal}>
                                <img src={fotosUrls[imagemPrincipalIndex]} alt={`${animal.nome} - foto principal`} />
                            </div>

                            {fotosUrls.length > 1 && (
                                <div className={style.miniaturas}>
                                    {fotosUrls.slice(0, 4).map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`${animal.nome} - foto ${index + 1}`}
                                            className={`${style.thumb} ${imagemPrincipalIndex === index ? style.ativa : ""}`}
                                            onClick={() => setImagemPrincipalIndex(index)}
                                        />
                                    ))}
                                </div>
                            )}
                        </article>

                        <div className={style.colunaDireita}>
                            <article className={style.info}>
                                <h2>Olá, eu sou {animal.nome}</h2>

                                <div className={style.quickStats}>
                                    <span className={style.statBadge}>{especieEmoji[animal.especie]} {especieLabel[animal.especie]}</span>
                                    <span className={style.statBadge}>{sexoEmoji[animal.sexo]} {sexoLabel[animal.sexo]}</span>
                                    <span className={style.statBadge}>📏 {porteLabel[animal.porte]}</span>
                                    <span className={style.statBadge}>🎂 {animal.idadeDetalhada}</span>
                                </div>

                                <p className={style.description}>{animal.descricao}</p>
                            </article>

                            {/* Os três cards ficam ao lado das miniaturas, na base da coluna */}
                            <section className={style.detailsCards}>
                            <article className={style.cardDetails}>
                                <div className={style.borderDetails}>
                                    <h3>PERFIL SOCIAL</h3>
                                    <p>
                                        <strong>Espécie:</strong> {especieLabel[animal.especie]}<br />
                                        <strong>Sexo:</strong> {sexoLabel[animal.sexo]}<br />
                                        <strong>Porte:</strong> {porteLabel[animal.porte]}<br />
                                        <strong>Idade:</strong> {animal.idadeDetalhada}<br />
                                        <strong>Peso:</strong> {animal.pesoDetalhado}
                                    </p>
                                </div>
                            </article>

                            <article className={style.cardDetailsCentral}>
                                <div className={style.borderDetailsCentral}>
                                    <h3>PRONTUÁRIO</h3>
                                    <p>
                                        {animal.vacinacao ? "✓" : "✗"} Vacinado<br />
                                        {animal.vermifugado ? "✓" : "✗"} Vermifugado<br />
                                        {animal.castrado ? "✓" : "✗"} {animal.sexo === "femea" ? "Castrada" : "Castrado"}<br />
                                        {animal.microchipado ? "✓" : "✗"} Microchipado<br />
                                        {!animal.alergico ? "✓" : "✗"} Não alérgico<br />
                                        ✓ Saudável
                                    </p>
                                </div>
                            </article>

                            <article className={style.cardDetails}>
                                <div className={style.borderDetails}>
                                    <h3>ADESTRAMENTO</h3>
                                    <p>
                                        {adestramentoAtual?.tempoAdestramento ? (
                                            <><strong>Tempo:</strong> {adestramentoAtual.tempoAdestramento}<br /><br /></>
                                        ) : null}
                                        {(adestramentoAtual?.truques ?? []).length > 0 ? (
                                            <>
                                                <strong>Truques:</strong><br />
                                                {(adestramentoAtual?.truques ?? []).map((t, i) => <span key={i}>• {t}<br /></span>)}
                                            </>
                                        ) : (
                                            <span>Ainda aprendendo! 🐾</span>
                                        )}
                                        {adestramentoAtual?.adestrador ? (
                                            <><br /><small style={{ color: "#707070" }}>Profissional: {adestramentoAtual.adestrador.nomeUsuario}</small></>
                                        ) : null}
                                    </p>
                                </div>
                            </article>
                            </section>
                        </div>
                    </div>

                    {/* Passear, adotar ou participar da Festa do Pijama exigem cadastro: os três levam ao login */}
                    <div className={style.cardBotoes}>
                        <button onClick={() => router.push('/login')}>PASSEAR</button>
                        <button onClick={() => router.push('/login')}>ADOTAR</button>
                        <button onClick={() => router.push('/login')}>FESTA DO PIJAMA</button>
                    </div>

                </section>
            </main>

            <CustomFooter />
        </>
    );
}
