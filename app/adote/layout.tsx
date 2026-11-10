'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Outfit } from 'next/font/google';
// import Navbar from "../src/components/Navbar/Navbar";
// import Footer from "../src/components/Footer/Footer";
import Sidebar from "../../src/components/Sidebar/Sidebar";
//import "./globals.css";

//=============================

// Mudanças

import { CustomAcessibilidade } from "@/componentes/CustomAcessibilidade/CustomAcessibilidade";
import { CustomAcessoRapido } from "@/componentes/CustomAcessoRapido/CustomAcessoRapido";
import { CustomCarrossel } from "@/componentes/CustomCarrossel/CustomCarrossel";
import { CustomChamadaProjeto } from "@/componentes/CustomChamadaProjeto/CustomChamadaProjeto";
import { CustomFooter } from "@/componentes/CustomFooter/CustomFooter";
import { CustomHeader } from "@/componentes/CustomHeader/CustomHeader";
import { CustomNavBar } from "@/componentes/CustomNavBar/CustomNavBar";
import { CustomNoticias } from "@/componentes/CustomNoticias/CustomNoticias";

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  return (
    // O <html> e o <body> já existem no layout raiz (app/layout.tsx): aqui só entra o conteúdo.
    // (Antes este layout declarava os próprios <html>/<body>, o que causava erro de hidratação.)
    <div className={outfit.className}>

        {/* <!-- Icones Acessibilidade --> */}
        <CustomAcessibilidade />

        {/* <!-- Cabeçalho Principal - Header --> */}
        <CustomHeader />

        {/* <!-- Navegação --> */}
        <CustomNavBar isMenuOpen={menuAberto} onOpenMenu={() => setMenuAberto(true)} />


        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        {children}
        {/* <!-- Rodapé --> */}
        <CustomFooter />
    </div>
  );
}