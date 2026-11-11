import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css"
import "./globals.css";
import { VLibrasWidget } from "@/componentes/VLibrasWidget/VLibrasWidget";
import { CustomFiltroDaltonismo } from "@/componentes/CustomFiltroDaltonismo/CustomFiltroDaltonismo";
import { RegistrarVisita } from "@/componentes/RegistrarVisita/RegistrarVisita";

const titulo = "Departamento de Proteção e Bem-Estar Animal de Votorantim - DPBEA";
const descricao =
  "Conheça os serviços do Departamento de Proteção e Bem-Estar Animal de Votorantim! Encontre informações sobre adoção responsável, castração gratuita, vacinação, banco de rações e animais perdidos. Adote. Proteja. Transforme. Juntos por uma Votorantim mais acolhedora!";

// Título, descrição e imagem usados na aba do navegador e na prévia do link
// (WhatsApp, Telegram, redes sociais). A imagem vem de app/opengraph-image.png.
// metadataBase: endereço do site, para os links das imagens saírem completos.
// Se o site ganhar um domínio próprio, defina NEXT_PUBLIC_SITE_URL na Vercel.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://bem-estar-animal-votorantim.vercel.app"),
  title: titulo,
  description: descricao,
  openGraph: {
    title: titulo,
    description: descricao,
    siteName: "DPBEA Votorantim",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: titulo,
    description: descricao,
  },
};

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      </head>
      <body>
        {children}
        <VLibrasWidget />
        <CustomFiltroDaltonismo />
        {/* Guarda as páginas visitadas para o Acesso Rápido da home */}
        <RegistrarVisita />
      </body>
    </html>
  )
}
