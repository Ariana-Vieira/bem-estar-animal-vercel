"use client";
import Link from "next/link";

import "./Menu.css";

import { useState } from "react";

import {
  PawPrint,
  ChevronDown,
} from "lucide-react";

export default function Menu() {
  const [openCadastro, setOpenCadastro] =
    useState(false);

  const [openSolicitacoes, setOpenSolicitacoes] =
    useState(false);

  return (
    <div className="menu-wrapper">

      {/* MENU BUTTON */}
      <Link href="/Admin" className="menu-button">

        <PawPrint size={28} />

        <span>Home</span>

      </Link>

      {/* NAVBAR */}
      <nav className="menu-navbar">

        {/* CADASTRO */}
        <div className="menu-item admin-dropdown">

          <button className="botaodropdown"
            onClick={() =>
              setOpenCadastro(!openCadastro)
            }
          >
            Cadastro

            <ChevronDown size={18} />
          </button>

          {openCadastro && (
            <div className="admin-dropdown-menu">

              <Link href="/Admin/cadastro-animais">
                Cadastro de Animais
              </Link>

              <Link href="/Admin/cadastro-vacinas">
                Cadastro de Vacinas
              </Link>

            </div>
          )}

        </div>

        {/* LISTA DE ANIMAIS */}
        <Link href="/Admin/lista-animais" className="menu-item">
          Lista de Animais
        </Link>

        {/* LISTA DE VACINAS */}
        <Link href="/Admin/lista-vacinas" className="menu-item">
          Lista de Vacinas
        </Link>

        {/* SAÍDA */}
        <Link href="/Admin/saida-animais" className="menu-item">
          Saída de Animais
        </Link>

        {/* ADOTANTES */}
        <Link href="/Admin/adotantes" className="menu-item">
          Adotantes
        </Link>

        {/* ADESTRADORES */}
        <Link href="/Admin/adestradores" className="menu-item">
          Adestradores
        </Link>

        {/* SOLICITAÇÕES */}
        <div className="menu-item admin-dropdown">

          <button className="botaodropdown"
            onClick={() =>
              setOpenSolicitacoes(
                !openSolicitacoes
              )
            }
          >
            Solicitações

            <ChevronDown size={18} />
          </button>

          {openSolicitacoes && (
            <div className="admin-dropdown-menu">

              <Link href="/Admin/solicitacoes-simples">
                Solicitações de Eventos
              </Link>

              <Link href="/Admin/solicitacoes-adocao">
                Solicitações de Adoção
              </Link>

            </div>
          )}

        </div>

      </nav>

    </div>
  );
}