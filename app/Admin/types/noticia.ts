// Uma notícia (tabela NOTICIA no banco).
export interface Noticia {
  id: number;
  titulo: string;
  resumo: string | null;
  conteudo: string | null;
  urlImagem: string | null;
  ativo: boolean;
  dataPublicacao: string; // "2026-01-31"
}
