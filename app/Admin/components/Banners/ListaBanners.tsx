"use client";

// =============================================================================
// LISTA DE BANNERS
// Mesmo padrão da lista de vacinas/animais: busca a lista no servidor Express
// (Server/index_ProjIn.js, porta 3010) e filtra na própria tela. Daqui o
// Admin edita, liga/desliga e exclui os banners do carrossel da home.
// =============================================================================

import "@/app/Admin/components/Vacinas/ListaVacinas.css";
import "./ListaBanners.css";
import Link from "next/link";
import Titulo from "@/app/Admin/components/UI/Titulo/Titulo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { urlFoto } from "@/app/Admin/utils/urlFoto";
import type { Banner } from "@/app/Admin/types/banner";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3010";

type Situacao = "no-ar" | "inativo" | "agendado" | "encerrado";

// Data de hoje no formato do banco ("2026-01-31"), no horário do navegador
function hoje() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

// Mesma regra do servidor para decidir o que a home mostra
function situacaoDe(banner: Banner): Situacao {
  if (!banner.ativo) return "inativo";
  const h = hoje();
  if (banner.dataInicio && banner.dataInicio > h) return "agendado";
  if (banner.dataFim && banner.dataFim < h) return "encerrado";
  return "no-ar";
}

const textoSituacao: Record<Situacao, string> = {
  "no-ar": "No ar",
  inativo: "Inativo",
  agendado: "Agendado",
  encerrado: "Encerrado",
};

const classeSituacao: Record<Situacao, string> = {
  "no-ar": "status-ok",
  inativo: "status-inativo",
  agendado: "status-agendado",
  encerrado: "status-vencida",
};

// "2026-01-31" -> "31/01/2026"
function dataBR(data: string | null) {
  if (!data) return "";
  const [a, m, d] = data.split("-");
  return `${d}/${m}/${a}`;
}

function textoPeriodo(banner: Banner) {
  if (!banner.dataInicio && !banner.dataFim) return "Sem prazo";
  if (banner.dataInicio && banner.dataFim)
    return `${dataBR(banner.dataInicio)} a ${dataBR(banner.dataFim)}`;
  if (banner.dataInicio) return `A partir de ${dataBR(banner.dataInicio)}`;
  return `Até ${dataBR(banner.dataFim)}`;
}

export default function ListaBanners() {
  const router = useRouter();

  const [banners, setBanners] = useState<Banner[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [situacaoFiltro, setSituacaoFiltro] = useState("");

  async function carregarBanners() {
    try {
      const response = await fetch(`${API}/banners`);

      if (!response.ok) throw new Error("Erro ao carregar banners");

      setBanners(await response.json());
      setErro("");
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar os banners. O servidor está ligado?");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarBanners();
  }, []);

  async function alternarAtivo(banner: Banner) {
    try {
      const response = await fetch(`${API}/banners/${banner.id}/ativo`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ativo: !banner.ativo }),
      });

      if (!response.ok) throw new Error();

      setBanners((lista) =>
        lista.map((b) => (b.id === banner.id ? { ...b, ativo: !b.ativo } : b))
      );
    } catch {
      alert("Erro ao alterar o banner");
    }
  }

  async function excluirBanner(banner: Banner) {
    if (!window.confirm(`Deseja realmente excluir o banner "${banner.titulo}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API}/banners/${banner.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const e = await response.json().catch(() => null);
        alert(e?.erro || "Erro ao excluir banner");
        return;
      }

      setBanners((lista) => lista.filter((b) => b.id !== banner.id));
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir banner");
    }
  }

  const filtrados = banners.filter((b) => {
    const termo = busca.toLowerCase();

    const bateBusca =
      b.titulo.toLowerCase().includes(termo) ||
      (b.subtitulo ?? "").toLowerCase().includes(termo);

    const bateSituacao = situacaoFiltro === "" || situacaoDe(b) === situacaoFiltro;

    return bateBusca && bateSituacao;
  });

  const noAr = banners.filter((b) => situacaoDe(b) === "no-ar").length;
  const inativos = banners.filter((b) => situacaoDe(b) === "inativo").length;

  return (
    <section className="lista-container">
      <Titulo
        titulo="Lista de Banners"
        descricao="Gerencie os banners do carrossel da página inicial."
      />

      {/* CARDS */}

      <div className="cards-grid">
        <div className="info-card">
          <h3>Total de Banners</h3>
          <span>{banners.length}</span>
        </div>

        <div className="info-card">
          <h3>No ar agora</h3>
          <span>{noAr}</span>
        </div>

        <div className="info-card">
          <h3>Inativos</h3>
          <span>{inativos}</span>
        </div>
      </div>

      {/* FILTROS */}

      <div className="filtro-container">
        <input
          type="text"
          placeholder="Buscar banner pelo título..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <select
          value={situacaoFiltro}
          onChange={(e) => setSituacaoFiltro(e.target.value)}
        >
          <option value="">Todas as situações</option>
          <option value="no-ar">No ar</option>
          <option value="inativo">Inativo</option>
          <option value="agendado">Agendado</option>
          <option value="encerrado">Encerrado</option>
        </select>

        <Link href="/Admin/cadastro-banners" className="banner-novo">
          + Novo banner
        </Link>
      </div>

      {/* TABELA */}

      <div className="table-container">
        <table className="banner-tabela">
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Banner</th>
              <th>Posição</th>
              <th>Período</th>
              <th>Situação</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map((banner) => {
              const situacao = situacaoDe(banner);

              return (
                <tr key={banner.id}>
                  <td>
                    {banner.urlImagem ? (
                      <img
                        className="banner-miniatura"
                        src={urlFoto(banner.urlImagem)}
                        alt={`Imagem do banner ${banner.titulo}`}
                      />
                    ) : (
                      <div className="banner-miniatura banner-sem-imagem">
                        Sem imagem
                      </div>
                    )}
                  </td>

                  <td>
                    <strong>{banner.titulo}</strong>
                    {banner.subtitulo && (
                      <div className="banner-subtitulo">{banner.subtitulo}</div>
                    )}
                  </td>

                  <td>{banner.ordem}</td>

                  <td>{textoPeriodo(banner)}</td>

                  <td>
                    <span className={`status-badge ${classeSituacao[situacao]}`}>
                      {textoSituacao[situacao]}
                    </span>
                  </td>

                  <td>
                    <div className="acoes">
                      <button
                        onClick={() =>
                          router.push(`/Admin/cadastro-banners?id=${banner.id}`)
                        }
                      >
                        Editar
                      </button>

                      <button onClick={() => alternarAtivo(banner)}>
                        {banner.ativo ? "Desativar" : "Ativar"}
                      </button>

                      <button
                        className="banner-btn-excluir"
                        onClick={() => excluirBanner(banner)}
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

        {carregando && <p className="banner-aviso">Carregando banners...</p>}

        {erro && <p className="banner-aviso banner-erro">{erro}</p>}

        {!carregando && !erro && filtrados.length === 0 && (
          <p className="banner-aviso">
            {banners.length === 0
              ? "Nenhum banner cadastrado ainda."
              : "Nenhum banner encontrado com esses filtros."}
          </p>
        )}
      </div>
    </section>
  );
}
