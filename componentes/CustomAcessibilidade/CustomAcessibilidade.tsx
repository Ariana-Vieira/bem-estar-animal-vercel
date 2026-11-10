'use client'

import { useState, useEffect } from "react";
import style from "./CustomAcessibilidade.module.css"
import { CustomRedesSociais } from "../CustomRedesSociais/CustomRedesSociais"


export const CustomAcessibilidade = () => {

    const [tamanhoFonte, setTamanhoFonte] = useState(16);
    const [contrasteAtivo, setContrasteAtivo] = useState(false);

    useEffect(() => {
        document.body.style.fontSize = `${tamanhoFonte}px`;
    }, [tamanhoFonte]);

    useEffect(() => {
        if (contrasteAtivo) {
        document.body.classList.add("alto-contraste");
        } else {
        document.body.classList.remove("alto-contraste");
        }
    }, [contrasteAtivo]);

    const incrementarFonte = () => {
        setTamanhoFonte((prev) => (prev + 2 > 24 ? 24 : prev + 2));
    };

    const decrementarFonte = () => {
        setTamanhoFonte((prev) => (prev - 2 < 12 ? 12 : prev - 2));
    };
    
    return (
        <div className={`${style["barra-acessibilidade"]} bg-ligth`} >
            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center gap-2 py-2">
                    <div className="d-flex align-items-center gap-2">
                    <button className={`${style["btn-acessibilidade"]} ${style["btn-contraste"]}`} aria-label="Contraste" onClick={() => setContrasteAtivo(!contrasteAtivo)}>
                        <span className="material-symbols-rounded">fiber_manual_record</span>
                    </button>

                    <button className={`${style["btn-acessibilidade"]} btn-vermelho`} id="aumentarFonte" onClick={incrementarFonte}>
                        A+
                    </button>

                    <button className={`${style["btn-acessibilidade"]} btn-vermelho`} id="diminuirFonte" onClick={decrementarFonte}>
                        A-
                    </button>

                    <button className={style["btn-acessibilidade"]} aria-label="Modo audiodescrição">
                        <span className="material-symbols-rounded">hearing</span>
                    </button>
                    </div>

                    <CustomRedesSociais />
                </div>
            </div>
        </div>
    )
}