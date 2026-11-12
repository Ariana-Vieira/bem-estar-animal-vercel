"use client";
// =============================================================================
// CADASTRO DE BANNERS (slides do carrossel da home)
//   Segue o mesmo padrão do cadastro de animais e de vacinas:
//   - Formik + Yup para formulário e validação;
//   - useSearchParams para saber se é cadastro novo ou edição (?id=...);
//   - fetch direto para o servidor Express (Server/index_ProjIn.js), porta 3010.
//   Como o banner tem IMAGEM, os dados vão em FormData (igual ao animal): o
//   servidor guarda a imagem no Vercel Blob (ou em Server/img, no computador)
//   e grava só o endereço dela na tabela BANNER.
// =============================================================================
import "../cadastro-vacinas/CadastroVacinaForm.css";
import "./CadastroBanner.css";
import Layout from "@/app/Admin/components/Layout/Layout";
import Button from "@/app/Admin/components/UI/Button/Button";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { reduzirFoto } from "@/app/Admin/utils/reduzirFoto";
import { urlFoto } from "@/app/Admin/utils/urlFoto";
import type { Banner } from "@/app/Admin/types/banner";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3010";

// O link do botão vira um <a href> na home: só página do site (/...), âncora (#...) ou http(s)
const LINK_VALIDO = /^(\/(?!\/)|#|https?:\/\/)/i;

const bannerSchema = Yup.object({
  titulo: Yup.string()
    .trim()
    .required("Informe o título do banner")
    .max(120, "No máximo 120 caracteres"),

  subtitulo: Yup.string().max(200, "No máximo 200 caracteres"),

  descricao: Yup.string().max(250, "No máximo 250 caracteres"),

  textoBotao: Yup.string().max(40, "No máximo 40 caracteres"),

  linkBotao: Yup.string()
    .max(300, "No máximo 300 caracteres")
    .test(
      "link-valido",
      "O link deve começar com / (página do site), # ou http(s)://",
      (v) => !v || LINK_VALIDO.test(v)
    )
    // se tem texto no botão, precisa ter para onde ir
    .when("textoBotao", ([textoBotao], schema) =>
      textoBotao ? schema.required("Informe o link do botão") : schema
    ),

  ordem: Yup.number()
    .typeError("Informe um número")
    .integer("Use um número inteiro")
    .min(1, "A ordem começa em 1")
    .required("Informe a ordem"),

  ativo: Yup.boolean(),

  dataInicio: Yup.string(),

  dataFim: Yup.string().test(
    "fim-depois-do-inicio",
    "A data final não pode ser anterior à inicial",
    function (v) {
      return !v || !this.parent.dataInicio || v >= this.parent.dataInicio;
    }
  ),
});

const valoresVazios = {
  titulo: "",
  subtitulo: "",
  descricao: "",
  textoBotao: "",
  linkBotao: "",
  ordem: 1,
  ativo: true,
  dataInicio: "",
  dataFim: "",
};

// Pré-visualização FIEL do slide da home: usa o mesmo tamanho (altura de 420 px) e
// as mesmas medidas de texto do carrossel real (CustomCarrossel + globals.css). O
// slide é desenhado na largura real da tela escolhida e depois reduzido (scale)
// para caber no cartão; assim o corte da imagem e o tamanho das letras ficam
// iguais aos da home naquele tipo de tela.
const TELAS = {
  computador: { rotulo: "Computador", largura: 1920 },
  notebook: { rotulo: "Notebook", largura: 1366 },
  celular: { rotulo: "Celular", largura: 390 },
} as const;

type Tela = keyof typeof TELAS;

const ALTURA_SLIDE = 420; // .carousel-item na home

// O contêiner do Admin usa "zoom: 0.9" (app/Admin/globals.css), que encolhe tudo que
// está dentro dele. Para o slide aparecer no tamanho REAL da tela, o zoom acumulado
// dos elementos pais é descontado na escala da prévia.
function zoomAcumulado(el: HTMLElement | null) {
  let zoom = 1;
  for (let n: HTMLElement | null = el; n; n = n.parentElement) {
    zoom *= parseFloat(getComputedStyle(n).zoom) || 1;
  }
  return zoom;
}

function PreviaBanner({
  titulo,
  subtitulo,
  descricao,
  textoBotao,
  link,
  imagem,
}: {
  titulo: string;
  subtitulo: string;
  descricao: string;
  textoBotao: string;
  link: string;
  imagem: string;
}) {
  const [tela, setTela] = useState<Tela>("computador");
  // largura do cartão em pixels reais da tela + zoom dos elementos pais
  const [medidas, setMedidas] = useState({ largura: 0, zoom: 1 });
  const areaRef = useRef<HTMLDivElement>(null);

  // acompanha o redimensionamento da janela
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;

    const medir = () =>
      setMedidas({ largura: el.getBoundingClientRect().width, zoom: zoomAcumulado(el) });
    medir();

    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  const larguraArea = medidas.largura;
  const larguraTela = TELAS[tela].largura;
  // só reduz (nunca amplia): o celular fica no tamanho real, centralizado.
  // Dividir pelo zoom devolve o tamanho real em pixels da tela.
  const escala =
    larguraArea > 0 ? Math.min(1, larguraArea / larguraTela) / medidas.zoom : 1;

  return (
    <>
      <div className="banner-previa-telas">
        {(Object.keys(TELAS) as Tela[]).map((chave) => (
          <button
            key={chave}
            type="button"
            className={tela === chave ? "ativa" : ""}
            onClick={() => setTela(chave)}
          >
            {TELAS[chave].rotulo} ({TELAS[chave].largura} px)
          </button>
        ))}
      </div>

      <div
        className="banner-previa-area"
        ref={areaRef}
        style={{ visibility: larguraArea > 0 ? "visible" : "hidden" }}
      >
        <div
          className="banner-previa-moldura"
          style={{
            width: larguraTela * escala,
            height: ALTURA_SLIDE * escala,
          }}
        >
          <div
            className={`banner-previa-slide${tela === "celular" ? " bp-celular" : ""}`}
            style={{
              width: larguraTela,
              height: ALTURA_SLIDE,
              transform: `scale(${escala})`,
              ...(imagem
                ? { backgroundImage: `url("${imagem.replace(/"/g, "%22")}")` }
                : {}),
            }}
          >
            <div className="bp-conteudo">
              <h2 className="bp-titulo">{titulo || "Título do banner"}</h2>

              {subtitulo && <p className="bp-lead">{subtitulo}</p>}

              {descricao && <p className="bp-texto">{descricao}</p>}

              {textoBotao && (
                <span className="btn-slide-cta">{textoBotao}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {!textoBotao && link && LINK_VALIDO.test(link) && (
        <p className="banner-previa-aviso">
          Sem botão: o banner inteiro será clicável e levará para{" "}
          <strong>{link}</strong>.
        </p>
      )}

      <p className="banner-dica">
        É o tamanho real do slide na home (420 px de altura) para o tipo de tela
        escolhido. As setas e as bolinhas do carrossel aparecem quando há mais
        de um banner no ar.
      </p>
    </>
  );
}

// Cadastro novo: preenche a "posição" com a próxima do carrossel. Só mexe nesse
// campo (se trocasse os valores iniciais do formulário, apagaria o que a pessoa
// já digitou caso o servidor demorasse a responder).
function SugerirOrdem({ ativo }: { ativo: boolean }) {
  const { setFieldValue } = useFormikContext<typeof valoresVazios>();

  useEffect(() => {
    if (!ativo) return;
    let cancelado = false;

    fetch(`${API}/banners`)
      .then((r) => r.json())
      .then((banners: Banner[]) => {
        if (cancelado || !Array.isArray(banners)) return;
        const maior = banners.reduce((m, b) => Math.max(m, b.ordem), 0);
        setFieldValue("ordem", maior + 1);
      })
      .catch(() => {
        // sem o servidor a posição fica em 1; o envio vai mostrar o erro de conexão
      });

    return () => {
      cancelado = true;
    };
  }, [ativo, setFieldValue]);

  return null;
}

function CadastroBannerPageConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bannerId = searchParams.get("id");
  const modoEdicao = bannerId !== null;

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

  // ----- carrega o banner que está sendo editado -----
  useEffect(() => {
    if (!modoEdicao) return;

    async function carregarBanner() {
      try {
        const response = await fetch(`${API}/banners/${bannerId}`);

        if (!response.ok) {
          alert("Banner não encontrado.");
          router.push("/Admin/lista-banners");
          return;
        }

        const banner: Banner = await response.json();

        setDadosIniciais({
          titulo: banner.titulo || "",
          subtitulo: banner.subtitulo || "",
          descricao: banner.descricao || "",
          textoBotao: banner.textoBotao || "",
          linkBotao: banner.linkBotao || "",
          ordem: banner.ordem ?? 1,
          ativo: !!banner.ativo,
          dataInicio: banner.dataInicio || "",
          dataFim: banner.dataFim || "",
        });
        setImagemAtual(banner.urlImagem);
      } catch (error) {
        console.error(error);
      }
    }

    carregarBanner();
  }, [modoEdicao, bannerId, router]);

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
          <h1>{modoEdicao ? "Editar Banner" : "Cadastro de Banners"}</h1>

          <p>
            Gerencie os banners do carrossel da página inicial: textos,
            imagem, botão e período de exibição.
          </p>
        </div>

        <Formik
          initialValues={dadosIniciais}
          enableReinitialize
          validationSchema={bannerSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              // Imagem + campos de texto no mesmo envio (FormData), igual ao animal
              const formData = new FormData();

              formData.append("titulo", values.titulo);
              formData.append("subtitulo", values.subtitulo);
              formData.append("descricao", values.descricao);
              formData.append("textoBotao", values.textoBotao);
              formData.append("linkBotao", values.linkBotao);
              formData.append("ordem", String(values.ordem));
              formData.append("ativo", String(values.ativo));
              formData.append("dataInicio", values.dataInicio);
              formData.append("dataFim", values.dataFim);

              if (arquivoImagem) {
                // Banner é horizontal e grande: reduz para no máx. 1920 px antes de enviar
                const reduzida = await reduzirFoto(arquivoImagem, 1920, 0.82);
                formData.append("imagem", reduzida, reduzida.name);
              } else if (removerImagem) {
                formData.append("removerImagem", "true");
              }

              const caminho = modoEdicao
                ? `${API}/banners/${bannerId}`
                : `${API}/banners`;

              const response = await fetch(caminho, {
                method: modoEdicao ? "PUT" : "POST",
                // sem "Content-Type": o navegador monta sozinho (FormData)
                body: formData,
              });

              if (!response.ok) {
                const erro = await response.json().catch(() => null);
                throw new Error(erro?.erro || "Erro ao salvar banner");
              }

              alert(
                modoEdicao
                  ? "Banner atualizado com sucesso!"
                  : "Banner cadastrado com sucesso!"
              );

              if (modoEdicao) {
                router.push("/Admin/lista-banners");
              } else {
                // limpa o formulário e já sugere a próxima posição
                const ordemAnterior = Number(values.ordem) || 0;
                resetForm({ values: { ...valoresVazios, ordem: ordemAnterior + 1 } });
                setArquivoImagem(null);
                setChaveInput((c) => c + 1);
              }
            } catch (error) {
              console.error(error);

              alert(
                error instanceof Error && error.message
                  ? error.message
                  : "Erro ao cadastrar banner"
              );
            }
          }}
        >
          {({ values, isSubmitting }) => (
            <Form className="vacina-form">
              <SugerirOrdem ativo={!modoEdicao} />

              {/* TEXTOS */}

              <div className="form-card">
                <h2>Textos do Banner</h2>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Título</label>
                    <Field name="titulo" type="text" maxLength={120} />
                    <ErrorMessage
                      name="titulo"
                      component="span"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label>Subtítulo (opcional)</label>
                    <Field name="subtitulo" type="text" maxLength={200} />
                    <ErrorMessage
                      name="subtitulo"
                      component="span"
                      className="error-message"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Texto complementar (opcional)</label>
                  <Field name="descricao" as="textarea" maxLength={250} />
                  <ErrorMessage
                    name="descricao"
                    component="span"
                    className="error-message"
                  />
                </div>
              </div>

              {/* BOTÃO */}

              <div className="form-card">
                <h2>Botão e Link do Banner</h2>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Texto do botão (opcional)</label>
                    <Field
                      name="textoBotao"
                      type="text"
                      maxLength={40}
                      placeholder="Ex.: Saiba mais"
                    />
                    <ErrorMessage
                      name="textoBotao"
                      component="span"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label>Link</label>
                    <Field
                      name="linkBotao"
                      type="text"
                      maxLength={300}
                      placeholder="Ex.: /adocao-responsavel ou https://..."
                    />
                    <ErrorMessage
                      name="linkBotao"
                      component="span"
                      className="error-message"
                    />
                  </div>
                </div>

                <p className="banner-dica">
                  <strong>Com texto no botão:</strong> o botão leva ao link.{" "}
                  <strong>Sem texto no botão:</strong> o banner inteiro (a
                  imagem) vira um link clicável. Sem link, o banner é só
                  informativo. Use <strong>/pagina</strong> para uma página do
                  próprio site ou o endereço completo (
                  <strong>https://...</strong>) para um site externo.
                </p>
              </div>

              {/* IMAGEM */}

              <div className="form-card">
                <h2>Imagem do Banner</h2>

                <div className="form-group full-width">
                  <label>Selecionar imagem</label>

                  <input
                    key={chaveInput}
                    type="file"
                    accept="image/*"
                    onChange={aoEscolherImagem}
                  />

                  <p className="banner-dica">
                    Use uma imagem horizontal, de preferência com{" "}
                    <strong>1920 × 600 px</strong> (JPG, PNG ou WEBP). Ela é
                    reduzida automaticamente antes de ser enviada. O texto
                    aparece por cima, com uma camada escura para facilitar a
                    leitura. Sem imagem, o banner usa um fundo colorido.
                  </p>
                </div>

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

              {/* EXIBIÇÃO */}

              <div className="form-card">
                <h2>Exibição na Home</h2>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Posição no carrossel</label>
                    <Field name="ordem" type="number" min={1} />
                    <ErrorMessage
                      name="ordem"
                      component="span"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label>Exibir a partir de (opcional)</label>
                    <Field name="dataInicio" type="date" />
                  </div>

                  <div className="form-group">
                    <label>Exibir até (opcional)</label>
                    <Field name="dataFim" type="date" />
                    <ErrorMessage
                      name="dataFim"
                      component="span"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group banner-ativo-grupo">
                    <div className="checkbox-group">
                      <Field name="ativo" type="checkbox" id="banner-ativo" />
                      <label htmlFor="banner-ativo">
                        Banner ativo (aparece na home)
                      </label>
                    </div>
                  </div>
                </div>

                <p className="banner-dica">
                  Menor posição aparece primeiro. Deixe as datas em branco para
                  o banner ficar no ar sem prazo; fora do período ele some da
                  home sozinho.
                </p>
              </div>

              {/* PRÉ-VISUALIZAÇÃO */}

              <div className="form-card">
                <h2>Pré-visualização</h2>

                <PreviaBanner
                  titulo={values.titulo}
                  subtitulo={values.subtitulo}
                  descricao={values.descricao}
                  textoBotao={values.textoBotao}
                  link={values.linkBotao}
                  imagem={imagemPrevia}
                />
              </div>

              <div className="submit-area">
                <Button type="submit">
                  {isSubmitting
                    ? "Salvando..."
                    : modoEdicao
                      ? "Salvar Alterações"
                      : "Cadastrar Banner"}
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
export default function CadastroBannerPage() {
  return (
    <Suspense fallback={null}>
      <CadastroBannerPageConteudo />
    </Suspense>
  );
}
