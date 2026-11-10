import type { Metadata } from "next";

import { Outfit } from "next/font/google";

import "./globals.css";

import { CustomAcessibilidade } from "@/componentes/CustomAcessibilidade/CustomAcessibilidade";
import { CustomHeader } from "@/componentes/CustomHeader/CustomHeader";
import { CustomFooter } from "@/componentes/CustomFooter/CustomFooter";
import { CustomNavBar } from "@/componentes/CustomNavBar/CustomNavBar";
import { categoriasAdmin } from "@/componentes/CustomNavBar/menuItens";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sistema Animal - Admin",
  description: "ERP de Cadastro Animal",
};

// Layout ANINHADO: o <html> e o <body> já existem no layout raiz do projeto
// (app/layout.tsx). Aqui entram o topo e o rodapé IGUAIS aos da home (fora do
// contêiner .admin-root, que zera margens/paddings e quebraria esses
// componentes) e, no meio, o contêiner que isola o estilo do Admin.
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CustomAcessibilidade />
      <CustomHeader />
      <CustomNavBar categorias={categoriasAdmin} homeHref="/Admin" itemFinal={null} />

      <div className={`admin-root ${outfit.className}`}>
        {children}
      </div>

      <CustomFooter />
    </>
  );
}
