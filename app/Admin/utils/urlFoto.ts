// Endereço completo de uma foto de animal, conforme a pasta onde ela está:
//  - "/img/arquivo.jpg"  -> foto enviada pelo Admin, fica no SERVIDOR (API)
//  - "/kairi.jpg" etc.   -> foto do catálogo, fica na pasta public/ do SITE
// Endereços completos (http, data:, blob:) passam direto - é o caso das
// fotos salvas no Vercel Blob (https://...blob.vercel-storage.com/...).
export function urlFoto(caminho?: string | null): string {
  if (!caminho) return "";
  if (/^(https?:|data:|blob:)/.test(caminho)) return caminho;

  if (caminho.startsWith("/img/")) {
    const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3010";
    return api + caminho;
  }

  const site = typeof window !== "undefined" ? window.location.origin : "";
  return site + caminho;
}
