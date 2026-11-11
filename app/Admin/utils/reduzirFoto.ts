// Reduz a foto no navegador ANTES de enviar para o servidor.
// Motivo: na Vercel cada requisição aceita no máximo 4,5 MB, e fotos de
// celular costumam ter vários MB. Aqui a foto é redimensionada (lado maior de
// 1280 px) e salva como JPEG, ficando em geral abaixo de 500 KB.
// Se algo falhar, ou se a foto reduzida não ficar menor, envia a original.
export async function reduzirFoto(
  arquivo: File,
  ladoMaximo = 1280,
  qualidade = 0.8
): Promise<File> {
  if (!arquivo.type.startsWith("image/")) return arquivo;

  try {
    const imagem = await createImageBitmap(arquivo);
    const escala = Math.min(1, ladoMaximo / Math.max(imagem.width, imagem.height));
    const largura = Math.round(imagem.width * escala);
    const altura = Math.round(imagem.height * escala);

    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    canvas.getContext("2d")?.drawImage(imagem, 0, 0, largura, altura);
    imagem.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", qualidade)
    );

    if (!blob || blob.size >= arquivo.size) return arquivo;

    const nome = arquivo.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], nome, { type: "image/jpeg" });
  } catch {
    return arquivo;
  }
}
