'use client';


import { listaPets } from '../../src/data/pets';
import { CartaoPetMapa } from '../../src/components/CartaoPetMapa';
import { FiltroMapa } from '../../src/components/FiltroMapa';
import styles from './mapa.module.css';
// Mudanças
import { useState } from "react";
import { CustomAcessibilidade } from "@/componentes/CustomAcessibilidade/CustomAcessibilidade";
import { CustomAcessoRapido } from "@/componentes/CustomAcessoRapido/CustomAcessoRapido";
import { CustomCarrossel } from "@/componentes/CustomCarrossel/CustomCarrossel";
import { CustomChamadaProjeto } from "@/componentes/CustomChamadaProjeto/CustomChamadaProjeto";
import { CustomFooter } from "@/componentes/CustomFooter/CustomFooter";
import { CustomHeader } from "@/componentes/CustomHeader/CustomHeader";
import { CustomNavBar } from "@/componentes/CustomNavBar/CustomNavBar";
import { CustomNoticias } from "@/componentes/CustomNoticias/CustomNoticias";


//==============================
export default function MapaPage() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalFiltroAberto, setModalFiltroAberto] = useState(false);

  return (
    <>
      {/* <!-- Icones Acessibilidade --> */}
      <CustomAcessibilidade />

      {/* <!-- Cabeçalho Principal - Header --> */}
      <CustomHeader />

      {/* <!-- Navegação --> */}
      <CustomNavBar isMenuOpen={menuAberto} onOpenMenu={() => setMenuAberto(true)} />



      <main>
        <section className={styles['secao-mapa']}>
          <div className={styles['fundo-mapa']}></div>

          <button
            className={styles['icone-funil-mapa']}
            onClick={() => setModalFiltroAberto(true)}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '1.5em' }}>
              filter_alt
            </span>
          </button>

          {listaPets.map((pet) => (
            <CartaoPetMapa key={pet.id} pet={pet} />
          ))}
        </section>

        {modalFiltroAberto && (
          <FiltroMapa onFechar={() => setModalFiltroAberto(false)} />
        )}
      </main>
      {/* <!-- Rodapé --> */}
      <CustomFooter />
      </>
  );
}