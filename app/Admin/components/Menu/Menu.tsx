"use client";
import Link from "next/link";

import "./Menu.css";

import { useState, useEffect } from "react";
import { getUsuario, logout, temPermissao } from "@/app/lib/auth";
import { useRouter } from "next/navigation";

import {
  PawPrint,
  ChevronDown,
} from "lucide-react";

export default function Menu() {
  const router = useRouter();
  const [openCadastro, setOpenCadastro] = useState(false);
  const [openSolicitacoes, setOpenSolicitacoes] = useState(false);
  const [permissoes, setPermissoes] = useState<string[]>([]);

  useEffect(() => {
    const usuario = getUsuario();
    if (!usuario) {
      router.push('/login');
      return;
    }
    setPermissoes(usuario.permissoes.map(p => p.nome));
  }, [router]);

  const tem = (nome: string) => permissoes.includes('admin') || permissoes.includes(nome);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

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
        {(tem('cadastro-animais') || tem('cadastro-vacinas')) && (
          <div className="menu-item admin-dropdown">
            <button className="botaodropdown" onClick={() => setOpenCadastro(!openCadastro)}>
              Cadastro
              <ChevronDown size={18} />
            </button>
            {openCadastro && (
              <div className="admin-dropdown-menu">
                {tem('cadastro-animais') && (
                  <Link href="/Admin/cadastro-animais">Cadastro de Animais</Link>
                )}
                {tem('cadastro-vacinas') && (
                  <Link href="/Admin/cadastro-vacinas">Cadastro de Vacinas</Link>
                )}
              </div>
            )}
          </div>
        )}

        {/* LISTA DE ANIMAIS */}
        {tem('lista-animais') && (
          <Link href="/Admin/lista-animais" className="menu-item">
            Lista de Animais
          </Link>
        )}

        {/* LISTA DE VACINAS */}
        {tem('lista-vacinas') && (
          <Link href="/Admin/lista-vacinas" className="menu-item">
            Lista de Vacinas
          </Link>
        )}

        {/* SAÍDA */}
        {tem('saida-animais') && (
          <Link href="/Admin/saida-animais" className="menu-item">
            Saída de Animais
          </Link>
        )}

        {/* ADOTANTES */}
        {tem('adotantes') && (
          <Link href="/Admin/adotantes" className="menu-item">
            Adotantes
          </Link>
        )}

        {/* ADESTRADORES */}
        {tem('adestradores') && (
          <Link href="/Admin/adestradores" className="menu-item">
            Adestradores
          </Link>
        )}

        {/* SOLICITAÇÕES */}
        {(tem('solicitacoes-eventos') || tem('solicitacoes-adocao')) && (
          <div className="menu-item admin-dropdown">
            <button className="botaodropdown" onClick={() => setOpenSolicitacoes(!openSolicitacoes)}>
              Solicitações
              <ChevronDown size={18} />
            </button>
            {openSolicitacoes && (
              <div className="admin-dropdown-menu">
                {tem('solicitacoes-eventos') && (
                  <Link href="/Admin/solicitacoes-simples">Solicitações de Eventos</Link>
                )}
                {tem('solicitacoes-adocao') && (
                  <Link href="/Admin/solicitacoes-adocao">Solicitações de Adoção</Link>
                )}
              </div>
            )}
          </div>
        )}

        {/* LOGOUT */}
        <button className="menu-item botao-logout" onClick={handleLogout}>
          Sair
        </button>

      </nav>

    </div>
  );
}