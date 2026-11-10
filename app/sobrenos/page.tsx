"use client";

import { CustomHeader } from "@/componentes/CustomHeader/CustomHeader";
import { CustomAcessibilidade } from "@/componentes/CustomAcessibilidade/CustomAcessibilidade";
import { CustomNavBar } from "@/componentes/CustomNavBar/CustomNavBar";
import { CustomFooter } from "@/componentes/CustomFooter/CustomFooter";
import { useState } from "react";
import { useRouter } from "next/navigation";
import style from "./page.module.css";
import { CustomSection } from "@/componentes/CustomSection/CustomSection";
import { useEffect, useRef } from "react";
import { CustomSobreCard } from "@/componentes/CustomSobreCard/CustomSobreCard";
import { SecoesServico } from "@/componentes/CustomPaginaServico/CustomPaginaServico";
import { CartoesLink, LocalContato } from "@/componentes/CustomPaginaServico/CustomConteudoServico";

export default function SobreNos() {
    const router = useRouter();
    const [menuAberto, setMenuAberto] = useState(false);

    const pawTrailRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        
        // GERADOR DE PATINHAS (PAW TRAIL)
        const pawTrail = pawTrailRef.current;
        
        const createPaw = () => {
            if (!pawTrail) return;

            const offsetX = Math.random() * pawTrail.clientWidth;
            const offsetY = Math.random() * pawTrail.clientHeight;

            // Patinha 1
            const paw1 = document.createElement("div");
            paw1.classList.add(style.paw);
            paw1.style.left = offsetX + "px";
            paw1.style.top = offsetY + "px";

            // Patinha 2
            const paw2 = document.createElement("div");
            paw2.classList.add(style.paw);
            paw2.style.left = (offsetX + 25) + "px";
            paw2.style.top = (offsetY + 60) + "px";

            // Patinha 3
            const paw3 = document.createElement("div");
            paw3.classList.add(style.paw);
            paw3.style.left = (offsetX - 25) + "px";
            paw3.style.top = (offsetY + 35) + "px";

            pawTrail.appendChild(paw1);
            pawTrail.appendChild(paw2);
            pawTrail.appendChild(paw3);

            setTimeout(() => {
                paw1.remove();
                paw2.remove();
                paw3.remove();
            }, 2500);
        };

        const pawInterval = setInterval(createPaw, 500);

        // LIMPEZA DOS INTERVALS E OBSERVER
        return () => {
            clearInterval(pawInterval);
        };
    }, []);

    const handleRedirect = () => router.push("/meetinpet");

    return (
        <>
            
            {/* Icones Acessibilidade */}
            <CustomAcessibilidade />

            {/* Cabeçalho Principal - Header */}
            <CustomHeader />

            {/* Navegação */}
            <CustomNavBar isMenuOpen={menuAberto} onOpenMenu={() => setMenuAberto(true)} />


            <main className={style.paginaSobre}>

                <CustomSection className={style.sobreContent}>
                    <div ref={pawTrailRef} id={style.pawTrail}></div>
                    
                    <h1 className={style.tituloPagina}>Sobre o DPBEA</h1>

                    <CustomSobreCard
                        imagem="/DBEA.png"
                        alt="foto do abrigo"
                        onClick={handleRedirect}
                        showButton={false}
                        descricao={
                    <>
                        O Departamento de Proteção e Bem-Estar Animal (DPBEA) é o setor responsável por promover ações
                        que garantem a proteção, cuidado e qualidade de vida dos animais do município de
                        Votorantim. Dentro do projeto, o DPBEA ganha uma plataforma moderna e totalmente
                        integrada ao sistema administrativo, permitindo mais transparência e eficiência na
                        divulgação de cães e gatos disponíveis para adoção.
                        <br />
                        Por meio dessa ferramenta, o departamento pode gerenciar em um só lugar todas as
                        informações dos animais: fotos, vídeos, histórico, perfil social, vacinação,
                        adestramento e status de adoção. Isso facilita o acompanhamento do processo, aumenta
                        a visibilidade dos animais e aproxima o DPBEA da comunidade, fortalecendo a adoção
                        responsável.<br />
                    </>
                    }
                />

                    <div className={style.secoesWrap}>
                        <SecoesServico
                            secoes={[
                                {
                                    titulo: 'Nossas áreas de atuação',
                                    larga: true,
                                    conteudo: (
                                        <CartoesLink
                                            itens={[
                                                {
                                                    icone: 'pets',
                                                    titulo: 'Adoção Responsável',
                                                    texto: 'Conheça os cães e gatos disponíveis, passeie com um aumigo ou leve um para uma noite em casa.',
                                                    href: '/adocao-responsavel',
                                                },
                                                {
                                                    icone: 'search',
                                                    titulo: 'Pets Perdidos e Encontrados',
                                                    texto: 'Cadastro, busca e acompanhamento de animais perdidos ou encontrados no município.',
                                                    href: '/adote',
                                                },
                                                {
                                                    icone: 'volunteer_activism',
                                                    titulo: 'Banco de Ração',
                                                    texto: 'Controle de doações, retiradas e estoque de rações e medicamentos.',
                                                    href: '/racao',
                                                },
                                                {
                                                    icone: 'medical_services',
                                                    titulo: 'Assistência Veterinária',
                                                    texto: 'Informações sobre atendimento clínico, castração, vacinação e microchip.',
                                                    href: '/assistencia-veterinaria/atendimento-clinico',
                                                },
                                            ]}
                                        />
                                    ),
                                },
                                { titulo: 'Nossa história', dica: 'Conte como o departamento surgiu e os marcos da sua trajetória.' },
                                { titulo: 'Missão, visão e valores', dica: 'Descreva a missão do departamento, onde quer chegar e os valores que guiam o trabalho.' },
                                {
                                    titulo: 'Onde nos encontrar',
                                    larga: true,
                                    conteudo: (
                                        <LocalContato
                                            endereco="Rua Do Canil, 388 - Vila Canil - Votorantim/SP"
                                            contatos={[
                                                { icone: 'location_on', texto: 'Rua Do Canil, 388 - Vila Canil - Votorantim/SP' },
                                                { icone: 'mail', texto: 'bemestaranimal@votorantim.sp.gov.br' },
                                                { icone: 'phone', texto: '(15) 3243-5612' },
                                            ]}
                                        />
                                    ),
                                },
                            ]}
                        />
                    </div>

                </CustomSection>

            </main>

            {/* Rodapé */}
            <CustomFooter />
        </>
    );
}