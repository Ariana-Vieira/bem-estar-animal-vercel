'use client'

import { useState } from "react";
import { CustomAcessibilidade } from "@/componentes/CustomAcessibilidade/CustomAcessibilidade";
import { CustomAcessoRapido } from "@/componentes/CustomAcessoRapido/CustomAcessoRapido";
import { CustomCarrossel } from "@/componentes/CustomCarrossel/CustomCarrossel";
import { CustomChamadaProjeto } from "@/componentes/CustomChamadaProjeto/CustomChamadaProjeto";
import { CustomFooter } from "@/componentes/CustomFooter/CustomFooter";
import { CustomHeader } from "@/componentes/CustomHeader/CustomHeader";
import { CustomNavBar } from "@/componentes/CustomNavBar/CustomNavBar";
import { CustomNoticias } from "@/componentes/CustomNoticias/CustomNoticias";

export default function Home() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <>
        {/* <!-- Icones Acessibilidade --> */}
        <CustomAcessibilidade />

        {/* <!-- Cabeçalho Principal - Header --> */}
        <CustomHeader />

        {/* <!-- Navegação --> */}
        <CustomNavBar isMenuOpen={menuAberto} onOpenMenu={() => setMenuAberto(true)} />


        {/* <!-- Chamada para o projeto Bem-Estar --> */}
        <CustomChamadaProjeto />

        {/* <!-- Carrossel Principal --> */}
        <CustomCarrossel />

        {/* <!-- Acesso Rápido --> */}
        <CustomAcessoRapido />

        {/* <!-- Notícias --> */}
        <CustomNoticias />

        {/* <!-- Rodapé --> */}
        <CustomFooter />

    </>
  );
}
