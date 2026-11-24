"use client";
// =============================================================================
// CADASTRO DE NOTÍCIAS
//   Segue o mesmo padrão do cadastro de banners:
//   - Formik + Yup para formulário e validação;
//   - useSearchParams para saber se é cadastro novo ou edição (?id=...);
//   - fetch direto para o servidor Express (Server/index_ProjIn.js), porta 3010.
//   A notícia tem IMAGEM, então os dados vão em FormData: o servidor guarda a
//   imagem no Vercel Blob (ou em Server/img, no computador) e grava só o
//   endereço dela na tabela NOTICIA.
// =============================================================================
import "../cadastro-vacinas/CadastroVacinaForm.css";
import "../cadastro-banners/CadastroBanner.css"; // reaproveita .banner-dica, .banner-remover etc.
import Layout from "@/app/Admin/components/Layout/Layout";
import Button from "@/app/Admin/components/UI/Button/Button";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { reduzirFoto } from "@/app/Admin/utils/reduzirFoto";
import { urlFoto } from "@/app/Admin/utils/urlFoto";
import type { Noticia } from "@/app/Admin/types/noticia";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3010";

// Data de hoje no formato do campo de data ("2026-01-31"), no horário do navegador
function hoje() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

const noticiaSchema = Yup.object({
  titulo: Yup.string()
    .trim()
    .required("Informe o título da notícia")
    .max(150, "No máximo 150 caracteres"),

  resumo: Yup.string().max(250, "No máximo 250 caracteres"),

  conteudo: Yup.string().max(20000, "No máximo 20000 caracteres"),

  dataPublicacao: Yup.string().required("Informe a data de publicação"),

  ativo: Yup.boolean(),
});

const valoresVazios = {
  titulo: "",
  resumo: "",
  conteudo: "",
  dataPublicacao: hoje(),
  ativo: true,
};

function CadastroNoticiaPageConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const noticiaId = searchParams.get("id");
  const modoEdicao = noticiaId !== null;

  const [dadosIniciais, setDadosIniciais] = useState(valoresVazios);

  // ----- imagem -----
  // arquivoImagem: arquivo escolhido agora; imagemAtual: a que já está salva
  // (edição); removerImagem: pediu para tirar a imagem salva.
  const [arquivoImagem, setArquivoImagem] = useState<File | null>(null);
  const [imagemAtual, setImagemAtual] = useState<string | null>(null);
  const [removerImagem, setRemoverImagem] = useState(false);
  const [previaArquivo, setPreviaArquivo] = useState("");
  const [chaveInput, setChaveInput] = useState(0); // zera o <input type="file">

  // Endereço temporário só para a prévia do arquivo escolhido
  useEffect(() => {
    if (!arquivoImagem) {
      setPreviaArquivo("");
      return;
    }
    const url = URL.createObjectURL(arquivoImagem);
    setPreviaArquivo(url);
    return () => URL.revokeObjectURL(url);
  }, [arquivoImagem]);

  const imagemPrevia =
    previaArquivo || (imagemAtual && !removerImagem ? urlFoto(imagemAtual) : "");

  // ----- carrega a notícia que está sendo editada -----
  useEffect(() => {
    if (!modoEdicao) return;

    async function carregarNoticia() {
      try {
        const response = await fetch(`${API}/noticias/${noticiaId}`);

        if (!response.ok) {
          alert("Notícia não encontrada.");
          router.push("/Admin/lista-noticias");
          return;
        }

        const noticia: Noticia = await response.json();

        setDadosIniciais({
          titulo: noticia.titulo || "",
          resumo: noticia.resumo || "",
          conteudo: noticia.conteudo || "",
          dataPublicacao: noticia.dataPublicacao || hoje(),
          ativo: !!noticia.ativo,
        });
        setImagemAtual(noticia.urlImagem);
      } catch (error) {
        console.error(error);
      }
    }

    carregarNoticia();
  }, [modoEdicao, noticiaId, router]);

  function aoEscolherImagem(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.currentTarget.files?.[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      alert("Escolha um arquivo de imagem (JPG, PNG ou WEBP).");
      setChaveInput((c) => c + 1);
      return;
    }

    if (arquivo.size > 15 * 1024 * 1024) {
      alert("Imagem muito grande (máximo 15 MB).");
      setChaveInput((c) => c + 1);
      return;
    }

    setArquivoImagem(arquivo);
    setRemoverImagem(false);
  }

  function tirarImagem() {
    setArquivoImagem(null);
    setChaveInput((c) => c + 1);
    // se havia uma imagem salva, avisa o servidor para removê-la ao salvar
    if (imagemAtual) setRemoverImagem(true);
  }

  const temImagem = !!arquivoImagem || (!!imagemAtual && !removerImagem);

  return (
    <Layout>
      <section className="vacina-container">
        {/* HEADER */}

        <div className="vacina-header">
          <h1>{modoEdicao ? "Editar Notícia" : "Cadastro de Notícias"}</h1>

          <p>
            Gerencie as notícias do Departamento: título, resumo, texto,
            imagem e data de publicação.
          </p>
        </div>

        <Formik
          initialValues={dadosIniciais}
          enableReinitialize
          validationSchema={noticiaSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              // Imagem + campos de texto no mesmo envio (FormData), igual ao banner
              const formData = new FormData();

              formData.append("titulo", values.titulo);
              formData.append("resumo", values.resumo);
              formData.append("conteudo", values.conteudo);
              formData.append("dataPublicacao", values.dataPublicacao);
              formData.append("ativo", String(values.ativo));

              if (arquivoImagem) {
                // reduz para no máx. 1920 px antes de enviar (limite da Vercel: 4,5 MB)
                const reduzida = await reduzirFoto(arquivoImagem, 1920, 0.82);
                formData.append("imagem", reduzida, reduzida.name);
              } else if (removerImagem) {
                formData.append("removerImagem", "true");
              }

              const caminho = modoEdicao
                ? `${API}/noticias/${noticiaId}`
                : `${API}/noticias`;

              const response = await fetch(caminho, {
                method: modoEdicao ? "PUT" : "POST",
                // sem "Content-Type": o navegador monta sozinho (FormData)
                body: formData,
              });

              if (!response.ok) {
                const erro = await response.json().catch(() => null);
                throw new Error(erro?.erro || "Erro ao salvar notícia");
              }

              alert(
                modoEdicao
                  ? "Notícia atualizada com sucesso!"
                  : "Notícia cadastrada com sucesso!"
              );

              if (modoEdicao) {
                router.push("/Admin/lista-noticias");
              } else {
                resetForm({ values: { ...valoresVazios, dataPublicacao: hoje() } });
                setArquivoImagem(null);
                setChaveInput((c) => c + 1);
              }
            } catch (error) {
              console.error(error);

              alert(
                error instanceof Error && error.message
                  ? error.message
                  : "Erro ao cadastrar notícia"
              );
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="vacina-form">
              {/* TEXTOS */}

              <div className="form-card">
                <h2>Textos da Notícia</h2>

                <div className="form-group full-width">
                  <label>Título</label>
                  <Field name="titulo" type="text" maxLength={150} />
                  <ErrorMessage
                    name="titulo"
                    component="span"
                    className="error-message"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Resumo (opcional)</label>
                  <Field name="resumo" as="textarea" maxLength={250} />
                  <ErrorMessage
                    name="resumo"
                    component="span"
                    className="error-message"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Texto da notícia (opcional)</label>
                  <Field name="conteudo" as="textarea" rows={8} maxLength={20000} />
                  <ErrorMessage
                    name="conteudo"
                    component="span"
                    className="error-message"
                  />
                </div>
              </div>

              {/* IMAGEM */}

              <div className="form-card">
                <h2>Imagem da Notícia</h2>

                <div className="form-group full-width">
                  <label>Selecionar imagem (opcional)</label>

                  <input
                    key={chaveInput}
                    type="file"
                    accept="image/*"
                    onChange={aoEscolherImagem}
                  />

                  <p className="banner-dica">
                    Use uma imagem horizontal (JPG, PNG ou WEBP). Ela é reduzida
                    automaticamente antes de ser enviada.
                  </p>
                </div>

                {imagemPrevia && (
                  <img
                    src={imagemPrevia}
                    alt="Pré-visualização da imagem da notícia"
                    style={{ maxWidth: "100%", maxHeight: 240, borderRadius: 8 }}
                  />
                )}

                {temImagem && (
                  <div className="banner-imagem-acoes">
                    <button
                      type="button"
                      className="banner-remover"
                      onClick={tirarImagem}
                    >
                      Remover imagem
                    </button>

                    {arquivoImagem && (
                      <span className="banner-arquivo-nome">
                        {arquivoImagem.name}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* PUBLICAÇÃO */}

              <div className="form-card">
                <h2>Publicação</h2>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Data de publicação</label>
                    <Field name="dataPublicacao" type="date" />
                    <ErrorMessage
                      name="dataPublicacao"
                      component="span"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group banner-ativo-grupo">
                    <div className="checkbox-group">
                      <Field name="ativo" type="checkbox" id="noticia-ativo" />
                      <label htmlFor="noticia-ativo">
                        Notícia ativa (aparece no site)
                      </label>
                    </div>
                  </div>
                </div>

                <p className="banner-dica">
                  Com data futura, a notícia fica agendada e só aparece no site
                  a partir desse dia.
                </p>
              </div>

              <div className="submit-area">
                <Button type="submit">
                  {isSubmitting
                    ? "Salvando..."
                    : modoEdicao
                      ? "Salvar Alterações"
                      : "Cadastrar Notícia"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </section>
    </Layout>
  );
}

// Suspense: exigido pelo Next em produção quando se usa useSearchParams
export default function CadastroNoticiaPage() {
  return (
    <Suspense fallback={null}>
      <CadastroNoticiaPageConteudo />
    </Suspense>
  );
}
