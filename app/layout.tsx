import "bootstrap/dist/css/bootstrap.min.css"
import "./globals.css";
import { VLibrasWidget } from "@/componentes/VLibrasWidget/VLibrasWidget";
import { CustomFiltroDaltonismo } from "@/componentes/CustomFiltroDaltonismo/CustomFiltroDaltonismo";
import { RegistrarVisita } from "@/componentes/RegistrarVisita/RegistrarVisita";

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
