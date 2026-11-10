'use client';

import { useState } from "react";
import { CustomHeader } from "@/componentes/CustomHeader/CustomHeader";
import { CustomAcessibilidade } from "@/componentes/CustomAcessibilidade/CustomAcessibilidade";
import { CustomNavBar } from "@/componentes/CustomNavBar/CustomNavBar";
import { CustomFooter } from "@/componentes/CustomFooter/CustomFooter";
import { CustomTitle } from "@/componentes/CustomTitle/CustomTitle";
import { CustomSection } from "@/componentes/CustomSection/CustomSection";
import { ListaAnimais } from "@/componentes/ListaAnimais";
import Link from "next/link";
import { PataFundo } from "@/componentes/PataFundo/PataFundo";
import style from "./page.module.css";


export default function MeetinpetPage() {
    const [menuAberto, setMenuAberto] = useState(false)


    return (
        <>
            {/* <!-- Icones Acessibilidade --> */}
                    <CustomAcessibilidade />
            
                    {/* <!-- Cabeçalho Principal - Header --> */}
                    <CustomHeader extraLogo="\logo_meetin.png" className="logoMeetin" />
            
                    {/* <!-- Navegação --> */}
                    <CustomNavBar isMenuOpen={menuAberto} onOpenMenu={() => setMenuAberto(true)} />


                    <main className={style.paginaMeetin}>
                        <PataFundo />
                        {/* <!-- Titulo --> */}
                        <CustomTitle title="ANIMAIS PARA ADOÇÃO" />

                        <p className={style.dicaQuiz}>
                            Ainda não sabe qual escolher? <Link href="/filtro">Faça o quiz</Link> e descubra seu pet ideal.
                            Quer entender como funciona? <Link href="/adocao-responsavel">Veja como adotar</Link>.
                        </p>

                        {/* <!-- Lista e filtros --> */}
                        <CustomSection>
                            <ListaAnimais />
                        </CustomSection>
                    </main>

                    {/* <!-- Rodapé --> */}
                    <CustomFooter />
        </>
    )
}