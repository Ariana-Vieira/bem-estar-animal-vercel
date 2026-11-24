"use client";

// =============================================================================
// LISTA DE NOTÍCIAS
// Mesmo padrão da lista de banners: busca a lista no servidor Express
// (Server/index_ProjIn.js, porta 3010) e filtra na própria tela. Daqui o
// Admin edita, liga/desliga e exclui as notícias.
// =============================================================================

import "@/app/Admin/components/Vacinas/ListaVacinas.css";
import "@/app/Admin/components/Banners/ListaBanners.css"; // reaproveita o visual da lista de banners
import Link from "next/link";
import Titulo from "@/app/Admin/components/UI/Titulo/Titulo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { urlFoto } from "@/app/Admin/utils/urlFoto";
import type { Noticia } from "@/app/Admin/types/noticia";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3010";

type Situacao = "publicada" | "inativa" | "agendada";

// Data de hoje no formato do banco ("2026-01-31"), no horário do navegador
function hoje() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

// Mesma regra do servidor para decidir o que o site mostra
function situacaoDe(noticia: Noticia): Situacao {
  if (!noticia.ativo) return "inativa";
  if (noticia.dataPublicacao > hoje()) return "agendada";
  return "publicada";
}

const textoSituacao: Record<Situacao, string> = {
  publicada: "Publicada",
  inativa: "Inativa",
  agendada: "Agendada",
};

const classeSituacao: Record<Situacao, string> = {
  publicada: "status-ok",
  inativa: "status-inativo",
  agendada: "status-agendado",
};

// "2026-01-31" -> "31/01/2026"
function dataBR(data: string | null) {
  if (!data) return "";
  const [a, m, d] = data.split("-");
  return `${d}/${m}/${a}`;
}

export default function ListaNoticias() {
  const router = useRouter();

  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [situacaoFiltro, setSituacaoFiltro] = useState("");

  async function carregarNoticias() {
    try {
      const response = await fetch(`${API}/noticias`);

      if (!response.ok) throw new Error("Erro ao carregar notícias");

      setNoticias(await response.json());
      setErro("");
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar as notícias. O servidor está ligado?");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarNoticias();
  }, []);

  async function alternarAtivo(noticia: Noticia) {
    try {
      const response = await fetch(`${API}/noticias/${noticia.id}/ativo`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ativo: !noticia.ativo }),
      });

      if (!response.ok) throw new Error();

      setNoticias((lista) =>
        lista.map((n) => (n.id === noticia.id ? { ...n, ativo: !n.ativo } : n))
      );
    } catch {
      alert("Erro ao alterar a notícia");
    }
  }

  async function excluirNoticia(noticia: Noticia) {
    if (!window.confirm(`Deseja realmente excluir a notícia "${noticia.titulo}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API}/noticias/${noticia.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const e = await response.json().catch(() => null);
        alert(e?.erro || "Erro ao excluir notícia");
        return;
      }

      setNoticias((lista) => lista.filter((n) => n.id !== noticia.id));
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir notícia");
    }
  }

  const filtradas = noticias.filter((n) => {
    const termo = busca.toLowerCase();

    const bateBusca =
      n.titulo.toLowerCase().includes(termo) ||
      (n.resumo ?? "").toLowerCase().includes(termo);

    const bateSituacao = situacaoFiltro === "" || situacaoDe(n) === situacaoFiltro;

    return bateBusca && bateSituacao;
  });

  const publicadas = noticias.filter((n) => situacaoDe(n) === "publicada").length;
  const inativas = noticias.filter((n) => situacaoDe(n) === "inativa").length;

  return (
    <section className="lista-container">
      <Titulo
        titulo="Lista de Notícias"
        descricao="Gerencie as notícias do Departamento."
      />

      {/* CARDS */}

      <div className="cards-grid">
        <div className="info-card">
          <h3>Total de Notícias</h3>
          <span>{noticias.length}</span>
        </div>

        <div className="info-card">
          <h3>Publicadas</h3>
          <span>{publicadas}</span>
        </div>

        <div className="info-card">
          <h3>Inativas</h3>
          <span>{inativas}</span>
        </div>
      </div>

      {/* FILTROS */}

      <div className="filtro-container">
        <input
          type="text"
          placeholder="Buscar notícia pelo título..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <select
          value={situacaoFiltro}
          onChange={(e) => setSituacaoFiltro(e.target.value)}
        >
          <option value="">Todas as situações</option>
          <option value="publicada">Publicada</option>
          <option value="inativa">Inativa</option>
          <option value="agendada">Agendada</option>
        </select>

        <Link href="/Admin/cadastro-noticias" className="banner-novo">
          + Nova notícia
        </Link>
      </div>

      {/* TABELA */}

      <div className="table-container">
        <table className="banner-tabela">
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Notícia</th>
              <th>Publicação</th>
              <th>Situação</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {filtradas.map((noticia) => {
              const situacao = situacaoDe(noticia);

              return (
                <tr key={noticia.id}>
                  <td>
                    {noticia.urlImagem ? (
                      <img
                        className="banner-miniatura"
                        src={urlFoto(noticia.urlImagem)}
                        alt={`Imagem da notícia ${noticia.titulo}`}
                      />
                    ) : (
                      <div className="banner-miniatura banner-sem-imagem">
                        Sem imagem
                      </div>
                    )}
                  </td>

                  <td>
                    <strong>{noticia.titulo}</strong>
                    {noticia.resumo && (
                      <div className="banner-subtitulo">{noticia.resumo}</div>
                    )}
                  </td>

                  <td>{dataBR(noticia.dataPublicacao)}</td>

                  <td>
                    <span className={`status-badge ${classeSituacao[situacao]}`}>
                      {textoSituacao[situacao]}
                    </span>
                  </td>

                  <td>
                    <div className="acoes">
                      <button
                        onClick={() =>
                          router.push(`/Admin/cadastro-noticias?id=${noticia.id}`)
                        }
                      >
                        Editar
                      </button>

                      <button onClick={() => alternarAtivo(noticia)}>
                        {noticia.ativo ? "Desativar" : "Ativar"}
                      </button>

                      <button
                        className="banner-btn-excluir"
                        onClick={() => excluirNoticia(noticia)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {carregando && <p className="banner-aviso">Carregando notícias...</p>}

        {erro && <p className="banner-aviso banner-erro">{erro}</p>}

        {!carregando && !erro && filtradas.length === 0 && (
          <p className="banner-aviso">
            {noticias.length === 0
              ? "Nenhuma notícia cadastrada ainda."
              : "Nenhuma notícia encontrada com esses filtros."}
          </p>
        )}
      </div>
    </section>
  );
}
