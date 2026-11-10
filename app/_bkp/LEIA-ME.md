# Backups de páginas

Esta pasta começa com `_`, então o Next.js a trata como **privada**: nada daqui vira rota
(por exemplo, `/_bkp/...` não existe no site). Serve só para guardar cópias.

## filtro_2026-11-09
Cópia da página `/filtro` (quiz + "Sobre nosso canil") **antes** da reorganização do menu
de Adoção Responsável.

Para voltar atrás:
1. apague (ou renomeie) o conteúdo atual de `app/filtro/`;
2. copie `app/_bkp/filtro_2026-11-09/page.tsx` e `filtro.module.css` de volta para `app/filtro/`.
