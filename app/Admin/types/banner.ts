// Um banner = um slide do carrossel da home (tabela BANNER no banco).
export interface Banner {
  id: number;
  titulo: string;
  subtitulo: string | null;
  descricao: string | null;
  textoBotao: string | null;
  linkBotao: string | null;
  urlImagem: string | null;
  ordem: number;
  ativo: boolean;
  dataInicio: string | null; // "2026-01-31"
  dataFim: string | null;
}
