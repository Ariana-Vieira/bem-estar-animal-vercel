"use client"

import { useEffect, useState } from "react";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { CustomHeader } from "@/componentes/CustomHeader/CustomHeader";
import { CustomAcessibilidade } from "@/componentes/CustomAcessibilidade/CustomAcessibilidade";
import { CustomNavBar } from "@/componentes/CustomNavBar/CustomNavBar";
import { CustomFooter } from "@/componentes/CustomFooter/CustomFooter";
import { CustomSection } from "@/componentes/CustomSection/CustomSection";
import style from "./page.module.css";

export default function Projeto() {
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    Fancybox.bind('[data-fancybox="projeto"]', {
      hideScrollbar: false,
      placeFocusBack: false,
    });

    return () => {
      Fancybox.destroy();
    };
  }, []);

  return (
    <>
      <CustomAcessibilidade />
      <CustomHeader />
      <CustomNavBar isMenuOpen={menuAberto} onOpenMenu={() => setMenuAberto(true)} />

      <main className={style.projetoPage}>
        <CustomSection className={style.projetoContent}>
          <div className={style.topoTexto}>
              <h1 className={style.pageHeading}>Sobre o Projeto Bem-Estar Animal</h1>
          </div>

          <div className={style.introCard}>
            <p>
              O Projeto Bem-Estar é uma iniciativa integrada desenvolvida em parceria entre a Fatec Votorantim e a Secretaria de Meio Ambiente da Prefeitura de Votorantim, por meio do Departamento de Proteção e Bem-Estar Animal. O projeto é desenvolvido pelos alunos do curso de Desenvolvimento de Software Multiplataforma, por meio dos projetos integradores.
            </p>
            <p>
              A proposta tem como objetivo criar um ecossistema digital de apoio à gestão pública do bem-estar animal, substituindo processos manuais por soluções informatizadas, organizadas, seguras e acessíveis.
            </p>
            <p>
              A plataforma Bem-Estar Animal está sendo desenvolvida para gerenciar informações, melhorar o acompanhamento dos animais atendidos pelo município, dar mais transparência às ações públicas, facilitar a comunicação com a população e apoiar a tomada de decisão da equipe responsável.
            </p>
            <p>
              O projeto reúne diferentes módulos voltados ao controle de animais, a adoção responsável, ao banco de ração solidária, ao resgate, mapeamento e localização de animais perdidos ou encontrados.
            </p>
          </div>

          <div className={style.sectionGrid}>
            <article className={style.cardInfo}>
              <h2 className={style.sectionHeading}>Por que este projeto importa</h2>
              <p>
                Com isso, a iniciativa contribui para a modernização da gestão pública municipal, promovendo maior eficiência nos fluxos internos, melhor controle dos dados, apoio às políticas públicas de proteção animal e fortalecimento do vínculo entre Prefeitura, comunidade, voluntários, doadores, adotantes, protetores e demais envolvidos na causa animal.
              </p>
              <div className={style.cardInfoImages}>
                <div className={style.cardInfoImageCard}>
                  <img src="/foto_parceria.jpg" alt="Parceria do projeto" />
                </div>
                <div className={style.cardInfoImageCard}>
                  <img src="/foto_parceria1.jpg" alt="Parceria do projeto" />
                </div>
              </div>
            </article>
            <article className={style.projectStats}>
              <h2 className={style.sectionHeading}>Visão geral</h2>
              <p>Uma plataforma alinhada à identidade do município, com módulos projetados para apoiar a gestão, a transparência e o cuidado com os animais.</p>
              <ul className={style.statsList}>
                <li>Organização de dados e controle de processos</li>
                <li>Apoio à adoção responsável e ao resgate</li>
                <li>Relatórios claros e acessíveis para a população</li>
              </ul>
            </article>
          </div>

          <div className={style.modulosSection}>
            <h2 className={style.modulosSectionTitle}>Módulos em desenvolvimento</h2>
            <p className={style.modulosIntro}>
              Cada módulo abaixo descreve o escopo do trabalho e tem espaço para dois prints de tela. O card de adoção usa imagens mais representativas para o público.
            </p>
            <div className={style.modulosGrid}>
            <article className={style.moduloCard}>
                <div className={style.moduloHeader}>
                  <h3>Adoção Responsável</h3>
                  <p>
                    Módulo voltado à divulgação de cães e gatos disponíveis para adoção. A plataforma apresentará os animais em cards informativos, com foto, características, porte, idade, comportamento, situação vacinal e demais dados relevantes. Também serão previstos filtros para aproximar os adotantes dos animais mais compatíveis com seu perfil.
                  </p>
                </div>
                <div className={style.printsGrid}>
                  <div className={style.printCard}>
                    <a
                      href="/pg_home.jpg"
                      data-fancybox="projeto"
                      data-caption="Home de adoção"
                      className={style.imageButton}
                      title="Clique para ampliar"
                    >
                      <img src="/pg_home.jpg" alt="Tela inicial de adoção" />
                    </a>
                    <span>Home de adoção</span>
                  </div>
                  <div className={style.printCard}>
                    <a
                      href="/pg_adocao.jpg"
                      data-fancybox="projeto"
                      data-caption="Ficha do animal"
                      className={style.imageButton}
                      title="Clique para ampliar"
                    >
                      <img src="/pg_adocao.jpg" alt="Tela de perfil do animal para adoção" />
                    </a>
                    <span>Quiz Interativo</span>
                  </div>
                </div>
              </article>
              <article className={style.moduloCard}>
                <div className={style.moduloHeader}>
                  <h3>Banco de Ração Solidária</h3>
                  <p>
                    Módulo destinado ao controle de doações, beneficiários, retiradas e estoque de rações e medicamentos. A solução busca oferecer mais organização, transparência e agilidade ao Banco de Ração, apoiando a equipe responsável no acompanhamento das entradas e saídas de recursos destinados aos animais e famílias atendidas.
                  </p>
                </div>
                <div className={style.printsGrid}>
                  <div className={style.printCard}>
                    <a
                      href="/pg_cad_donatario_doador.jpeg"
                      data-fancybox="projeto"
                      data-caption="Cadastro Donatário | Doador"
                      className={style.imageButton}
                      title="Clique para ampliar"
                    >
                      <img src="/pg_cad_donatario_doador.jpeg" alt="Tela de cadastro Donatário ou Doador" />
                    </a>
                    <span>Cadastro Donatário | Doador</span>
                  </div>
                  <div className={style.printCard}>
                    <a
                      href="/pg_consulta_estoque.jpeg"
                      data-fancybox="projeto"
                      data-caption="Consulta de Estoque"
                      className={style.imageButton}
                      title="Clique para ampliar"
                    >
                      <img src="/pg_consulta_estoque.jpeg" alt="Tela de consulta de estoque" />
                    </a>
                    <span>Tela de Consulta de Estoque</span>
                  </div>
                </div>
              </article>
              <article className={style.moduloCard}>
                <div className={style.moduloHeader}>
                  <h3>Cadastro de Pessoas</h3>
                  <p>
                    Módulo voltado ao cadastro e gerenciamento de pessoas vinculadas aos serviços do Departamento de Proteção e Bem-Estar Animal, como adotantes, voluntários, doadores e usuários. O sistema permitirá organizar dados, acompanhar solicitações, analisar perfis e apoiar os fluxos internos da Prefeitura.
                  </p>
                </div>
                <div className={style.printsGrid}>
                  <div className={style.printCard}>
                    <a
                      href="/pg_cadastro.jpeg"
                      data-fancybox="projeto"
                      data-caption="Cadastro de pessoas"
                      className={style.imageButton}
                      title="Clique para ampliar"
                    >
                      <img src="/pg_cadastro.jpeg" alt="Tela de Cadastro" />
                    </a>
                    <span>Cadastro de pessoas</span>
                  </div>
                  <div className={style.printCard}>
                    <a
                      href="/pg_perfil.jpeg"
                      data-fancybox="projeto"
                      data-caption="Perfil de usuário"
                      className={style.imageButton}
                      title="Clique para ampliar"
                    >
                      <img src="/pg_perfil.jpeg" alt="Tela de perfil de usuário" />
                    </a>
                    <span>Perfil de usuário</span>
                  </div>
                </div>
              </article>
              <article className={style.moduloCard}>
                <div className={style.moduloHeader}>
                  <h3>Cadastro e Controle de Animais</h3>
                  <p>
                    Módulo destinado ao registro e acompanhamento dos animais acolhidos ou monitorados pelo Departamento de Proteção e Bem-Estar Animal. A ferramenta permitirá cadastrar informações dos animais, histórico de saúde, vacinação, triagem, medicamentos, adoções, transferências e demais registros importantes para a gestão.
                  </p>
                </div>
                <div className={style.printsGrid}>
                  <div className={style.printCard}>
                    <a
                      href="/pg_cadastro_animal.jpeg"
                      data-fancybox="projeto"
                      data-caption="Cadastro de animais"
                      className={style.imageButton}
                      title="Clique para ampliar"
                    >
                      <img src="/pg_cadastro_animal.jpeg" alt="Tela de cadastro de animais" />
                    </a>
                    <span>Cadastro de animais</span>
                  </div>
                  <div className={style.printCard}>
                    <a
                      href="/pg_acompanhamento_animal.jpg"
                      data-fancybox="projeto"
                      data-caption="Acompanhamento do animal"
                      className={style.imageButton}
                      title="Clique para ampliar"
                    >
                      <img src="/pg_acompanhamento_animal.jpg" alt="Tela de acompanhamento de animais" />
                    </a>
                    <span>Acompanhamento do animal</span>
                  </div>
                </div>
              </article>
              <article className={style.moduloCard}>
                <div className={style.moduloHeader}>
                  <h3>Resgate, Mapeamento e Perdidos e Achados</h3>
                  <p>
                    Módulo destinado ao cadastro, busca e acompanhamento de animais perdidos ou encontrados no município de Votorantim. A solução contará com interface pública para consulta da população e painel administrativo para a equipe da Prefeitura, além de recursos de inteligência de dados, como mapas e painéis estatísticos, para apoiar políticas públicas de proteção animal.
                  </p>
                </div>
                <div className={style.printsGrid}>
                  <div className={style.printCard}>
                    <a
                      href="/pg_perdi_meu_pet.jpeg"
                      data-fancybox="projeto"
                      data-caption="Cadastro de resgates ou perda"
                      className={style.imageButton}
                      title="Clique para ampliar"
                    >
                      <img src="/pg_perdi_meu_pet.jpeg" alt="Tela de registro de resgates ou perda" />
                    </a>
                    <span>Cadastro de resgates ou perda</span>
                  </div>
                  <div className={style.printCard}>
                    <a
                      href="/pg_mapa_interativo.jpeg"
                      data-fancybox="projeto"
                      data-caption="Mapa de achados/perdidos"
                      className={style.imageButton}
                      title="Clique para ampliar"
                    >
                      <img src="/pg_mapa_interativo.jpeg" alt="Tela de mapa de animais perdidos" />
                    </a>
                    <span>Mapa de achados/perdidos</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </CustomSection>

        <CustomSection className={style.timelineSectionContainer}>
          <div className={style.timelineSection}>
            <h2 className={style.sectionHeading}>Road-map do projeto</h2>
            <div className={style.timelineWrapper}>
              <div className={style.timelineLine} aria-hidden="true"></div>
              <ul className={style.timelineList}>
                <li>
                  <span className={style.timelineMarker}>
                    <span className="material-symbols-rounded">calendar_month</span>
                  </span>
                  <div className={style.timelineContent}>
                    <strong>Agosto de 2025</strong>
                    <p>Primeiro a parceria em agosto de 2025, na qual o secretário Luiz Carlos Correa.</p>
                  </div>
                </li>
                <li>
                  <span className={style.timelineMarker}>
                    <span className="material-symbols-rounded">engineering</span>
                  </span>
                  <div className={style.timelineContent}>
                    <strong>2º semestre de 2025</strong>
                    <p>Planejamento e desenvolvimento do projeto orientado pela médica veterinária Evelyn e sua equipe (2sem de 2025).</p>
                  </div>
                </li>
                <li>
                  <span className={style.timelineMarker}>
                    <span className="material-symbols-rounded">campaign</span>
                  </span>
                  <div className={style.timelineContent}>
                    <strong>Dezembro de 2025</strong>
                    <p>Apresentação do projeto na qual compareceram diversos profissionais da secretaria e o secretário (dezembro de 2025).</p>
                  </div>
                </li>
                <li>
                  <span className={style.timelineMarker}>
                    <span className="material-symbols-rounded">trending_up</span>
                  </span>
                  <div className={style.timelineContent}>
                    <strong>1º semestre de 2026</strong>
                    <p>Melhoria do projeto (1 sem de 2026).</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </CustomSection>
      </main>

      <CustomFooter />
    </>
  );
}
