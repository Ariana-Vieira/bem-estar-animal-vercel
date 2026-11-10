# Como o projeto funciona (guia para estudar e explicar)

Este documento explica, em linguagem simples, **o que foi feito em cada parte do projeto**, onde fica o código e
quais conceitos de programação foram usados. A ideia é servir de roteiro para você entender e apresentar o trabalho.

> **Como manter este guia:** sempre que uma parte nova for criada, ela deve ganhar uma seção aqui
> (o que faz, onde está o código, como funciona, conceitos usados e limitações).

---

## 1. Visão geral

O **Projeto Bem-Estar Animal** é um site para o Departamento de Proteção e Bem-Estar Animal (DPBEA) de Votorantim.
Ele tem duas partes que conversam entre si:

| Parte | Tecnologia | Onde roda | Para que serve |
|---|---|---|---|
| **Site** (front-end) | Next.js + React + TypeScript | `http://localhost:3000` | As telas que a pessoa vê |
| **Servidor** (back-end) | Node.js + Express | `http://localhost:3010` | Recebe os cadastros e grava no banco |
| **Banco de dados** | SQL Server na Azure | nuvem | Guarda animais, fotos, vacinas, lotes |

**Como rodar** (dois terminais, na pasta do projeto):

```
npm run dev       # abre o site (porta 3000)
npm run server    # abre o servidor Express (porta 3010)
```

---

## 2. Mapa das pastas

| Pasta | O que tem |
|---|---|
| `app/` | **As páginas do site.** Cada pasta com um `page.tsx` vira um endereço (ex.: `app/projeto/page.tsx` → `/projeto`) |
| `app/Admin/` | Área administrativa (cadastros, listas) |
| `componentes/` | **Peças reutilizáveis** (menu, cabeçalho, rodapé, cartões...) |
| `data/` | **Dados** do site: lista de animais, lista de páginas para a busca, cartões do Acesso Rápido |
| `Server/` | O servidor Express e a conexão com o banco |
| `public/` | Imagens e arquivos que o navegador acessa direto (ex.: `/logo_Bem-EstarAnimal.png`) |
| `docs/` | Esta documentação |
| `app/_bkp/` | Cópias de segurança de páginas (a pasta começa com `_`, então **não vira rota**) |

---

## 3. A estrutura de toda página pública

Quase toda página tem a mesma "moldura", formada por 4 peças em `componentes/`:

1. **`CustomAcessibilidade`**: faixa de cima com contraste, aumentar/diminuir fonte e ícones das redes sociais.
2. **`CustomHeader`**: logos do Departamento e da Prefeitura e a barra de pesquisa.
3. **`CustomNavBar`**: o menu horizontal.
4. **`CustomFooter`**: o rodapé (links, contato, logos, redes sociais).

**Conceito:** *componente* é um pedaço de tela reutilizável. Em vez de copiar o menu em 30 páginas, ele é escrito
uma vez e usado com `<CustomNavBar />` em todas. Se o menu mudar, muda em todas.

**Logos clicáveis:** o logo do Departamento (topo e rodapé) leva à home; o da Prefeitura abre o site
`votorantim.sp.gov.br` **em outra aba** (`target="_blank"`, com `rel="noopener noreferrer"` por segurança).

---

## 4. O menu superior

- **Onde:** `componentes/CustomNavBar/CustomNavBar.tsx` (a tela) e `componentes/CustomNavBar/menuItens.ts` (os itens).
- **Como funciona:** os itens ficam num **array** em `menuItens.ts`. O componente percorre esse array com `.map()`
  e desenha cada categoria. Para mudar o menu, **edita-se só o array**, sem mexer no componente.
- **Dropdown:** abre ao passar o mouse e também ao clicar na setinha. Um `useState` guarda qual categoria está aberta.
  Fecha ao clicar fora, ao apertar Esc ou ao trocar de página.
- **Item da página atual destacado:** o componente usa `usePathname()` (o endereço atual) e compara com o link de
  cada item. O item da página atual ganha a classe `ativo`, que o CSS pinta de verde.
- **Reaproveitado no Admin:** o mesmo componente recebe, por **props**, outra lista de itens (`categoriasAdmin`),
  então o Admin tem o mesmo visual sem duplicar código.
- **O botão verde "Início"** (com patinha) fica *por cima* do menu graças ao `z-index` no CSS.

**Conceitos:** array e `map`, `useState`, `useEffect`, props, `usePathname`.

---

## 5. As páginas de conteúdo (Quem Somos, Assistência Veterinária, Adoção)

Existem várias páginas com o mesmo desenho: título, um cartão de introdução e cartões de seção. Para não repetir
código, foi criado o componente **`CustomPaginaServico`** (`componentes/CustomPaginaServico/`).

- Cada página só informa: `titulo`, `resumo` e uma lista de `secoes` (título + conteúdo).
- Seção **sem conteúdo** mostra "Conteúdo a ser preenchido" e uma dica do que escrever. Assim a estrutura já
  está pronta e o departamento só precisa fornecer o texto oficial.
- Blocos de apoio (`CustomConteudoServico.tsx`): `Texto`, `LinkAcao` (botão laranja), `Destaque` (imagem + texto),
  `Itens`, `Faq` (perguntas que abrem e fecham), `CartoesLink`, `ListaContato`, `LocalContato` (contatos + mapa).
- **Páginas criadas com ele:** `app/quem-somos/*`, `app/assistencia-veterinaria/*`, `app/adocao-responsavel`, `app/busca`.

**Conceitos:** componente com props, `children`, reaproveitamento de código, CSS Modules.

> **CSS Modules:** arquivos `*.module.css` deixam o nome das classes "só daquele componente". Por isso, para estilizar
> uma classe *global* (como o ícone `material-symbols-rounded`) dentro de um módulo, usa-se `:global(.nome)`.

---

## 6. Jornada de adoção

São três páginas que se ligam:

| Página | O que faz |
|---|---|
| `/adocao-responsavel` | Explica como adotar, passear, a Festa do Pijama e o lar temporário. É a página central |
| `/filtro` | O **quiz** com os mascotes Sol e Lua |
| `/meetinpet` | A lista de **animais para adoção**, com filtros |
| `/meetinpet/lineu` | A **página de cada animal** (galeria, perfil, prontuário, adestramento) |

**Como as recomendações funcionam:**
1. No quiz, a pessoa responde às perguntas e as respostas são guardadas no navegador (`localStorage`, chave `quizRespostas`).
2. Em `/meetinpet`, o componente `ListaAnimais` lê essas respostas e calcula uma **pontuação** para cada animal
   (porte combina? ambiente? exercício? personalidade? experiência?).
3. Animais com pontuação alta aparecem como **"Principais recomendações"**. Logo abaixo há o botão
   **"Ver todos os animais"**; ao clicar, as recomendações somem e a lista completa aparece
   (com botão para voltar às recomendações). Um `useState` (`mostrarTodos`) controla isso.

**Backup:** a versão antiga do `/filtro` está em `app/_bkp/filtro_2026-11-09/`. Para restaurar, copie os
arquivos de volta para `app/filtro/` (instruções em `app/_bkp/LEIA-ME.md`).

**Botões da página do animal** (Passear, Adotar, Festa do Pijama): levam para o login (`/login`).

---

## 7. A página "Sobre o DPBEA" (`/sobrenos`)

- Cartão principal com a imagem flutuante (componente `CustomSobreCard`) e o efeito das patinhas.
- Cartões de **áreas de atuação** (ligando às outras seções do site).
- **Onde nos encontrar:** contatos + **mapa do Google Maps**. O mapa é um `<iframe>` com o endereço na URL
  (`https://www.google.com/maps?q=ENDEREÇO&output=embed`), sem precisar de chave de API.

---

## 8. A barra de pesquisa do topo

**Objetivo:** a pessoa digita uma palavra e acha páginas do site e animais.

**Peças:**
1. **`data/paginas.ts`**: uma lista (array) com todas as páginas: `titulo`, `descricao`, `link`, `palavras` (sinônimos)
   e `icone`. **Quando criar uma página nova, acrescente um item aqui.**
2. **`componentes/CustomHeader/CustomHeader.tsx`**: ao enviar o formulário, vai para `/busca?q=palavra`
   (`router.push`).
3. **`app/busca/page.tsx`**: lê o `q` da URL, filtra a lista de páginas e a lista de animais (`data/animais.json`)
   e mostra os resultados em cartões.

**Como o filtro compara:**
- `normalizar()` deixa o texto em minúsculas e **sem acento** ("Castração" vira "castracao").
- `contemTodas()` exige que **cada palavra digitada seja o começo de alguma palavra do texto**. Por isso "ração" não
  acha "castração", mas "castr" acha.

**Limitação:** só procura no que está na lista (título, descrição, palavras-chave), não dentro do texto completo de
cada página, nem nas telas do Admin.

**Conceitos:** array, `filter`, `every`, `some`, `startsWith`, parâmetros de URL (`searchParams`), componente de servidor.

---

## 9. O Acesso Rápido da home

**Objetivo:** mostrar atalhos. Na primeira visita aparecem 4 cartões; conforme a pessoa visita páginas, elas
**substituem** os cartões iniciais. Os demais ficam atrás do botão **"Mais serviços"**.

**Peças:**
1. **`data/acessoRapido.ts`**: os 4 cartões iniciais e duas constantes (a chave do `localStorage` e o máximo de páginas
   guardadas: 8). Os 4 cartões foram escolhidos por serem os serviços mais procurados pelo público e por já terem página:

   | Cartão | Ícone | Texto | Leva para |
   |---|---|---|---|
   | Adote | casinha com coração | Veja como adotar seu novo amigo | `/adocao-responsavel` |
   | Pets Perdidos | lupa | Registre ou procure um animal | `/adote` |
   | Castração | maleta médica | Solicite a castração gratuita | `/assistencia-veterinaria/castracao-gratuita` |
   | Banco de Ração | osso | Solicite ou doe ração | `/racao` |

   Para trocar um cartão, basta editar esse arquivo (texto, ícone e link). O visual dos cartões (classes
   `card-acesso` etc.) está no `app/globals.css`.

   **Alinhamento dos cartões:** as páginas visitadas têm títulos e descrições de tamanhos diferentes. Para os
   cartões ficarem alinhados, o CSS reserva uma altura fixa para o título (2 linhas, centralizado) e para a
   descrição (3 linhas; se passar, corta com "..."). Além disso, títulos muito longos têm uma versão curta
   (`tituloCartao` em `data/paginas.ts`, por exemplo "Quiz: encontre seu pet ideal" vira "Quiz do Pet Ideal").
2. **`componentes/RegistrarVisita/RegistrarVisita.tsx`**: componente *invisível*, colocado uma vez em `app/layout.tsx`.
   A cada página aberta (`usePathname` + `useEffect`), procura a página em `data/paginas.ts` e guarda o link no
   `localStorage`, **no começo da lista e sem repetir**.
3. **`componentes/CustomAcessoRapido/CustomAcessoRapido.tsx`**: lê a lista guardada e monta os cartões:
   `visitados + iniciais que sobraram`. Mostra os 4 primeiros; "Mais serviços" mostra todos (`useState`).

**Exemplo:** quem visitar `/racao`, as notícias e `/projeto` verá na home:
`Sobre o Projeto | Notícias e Eventos | Banco de Ração | Adote`, e `Pets Perdidos` e `Castração` em "Mais serviços".

**Limitações:**
- O histórico fica **no navegador** de quem visita (não vai para o banco nem acompanha a pessoa em outro computador).
- A leitura do `localStorage` é feita dentro do `useEffect` porque ele só existe no navegador; se fosse lida
  direto, o Next daria erro de hidratação.

---

## 10. Botões e padrão visual

- **Botões de ação são laranja** (`#FA7F08` / `#ff8500`), em formato de pílula (bordas totalmente redondas), texto
  branco em negrito. No hover ficam **laranja escuro** (`#e06e00`), nunca vermelhos.
- O verde-água (`#348888`) é usado na identidade (menu, títulos), não nos botões de ação.
- **Títulos de página:** caixa alta, centralizados, verde-água, com um traço laranja embaixo.
- **Cartões grandes:** mesmo degradê, borda e cantos arredondados em todas as páginas (padrão da `/projeto`).

Botões de excluir/recusar ficam vermelhos de propósito (ação destrutiva).

---

## 11. Efeito das patinhas

- Componente `componentes/PataFundo/PataFundo.tsx`. A cada meio segundo cria 3 patinhas em posições aleatórias,
  que aparecem e somem sozinhas (animação em CSS, `PataFundo.module.css`).
- Usado em `/adocao-responsavel`, `/filtro` e `/meetinpet`. Para usar em outra página: coloque `<PataFundo />`
  dentro de um contêiner com `position: relative`.
- Usa `setInterval` dentro de um `useEffect` e **limpa o intervalo ao sair da página** (a função que o `useEffect`
  retorna), para não ficar rodando à toa.
- (A `/sobrenos` tem sua própria versão desse efeito, escrita antes no próprio arquivo da página.)

---

## 12. O carrossel da home

- `componentes/CustomCarrossel/CustomCarrossel.tsx`, feito com o carrossel do **Bootstrap**.
- **Erro que corrigimos:** ao sair da home no meio da troca de slide, o carrossel era destruído e o Bootstrap ainda
  tentava terminar a troca em um elemento que não existia mais (`TypeError: Illegal invocation`). A solução: pausar
  ao sair e só destruir (`dispose`) 1 segundo depois, quando a transição já acabou.

---

## 13. Área administrativa e banco de dados

- **Cadastro de animais** (`/Admin/cadastro-animais`) e **de vacinas** (`/Admin/cadastro-vacinas`): formulários com
  **Formik + Yup** (validação). Ao enviar, o site manda os dados para o servidor Express (`http://localhost:3010`).
- **Servidor** (`Server/index_ProjIn.js`): rotas principais:
  - `POST /INSERT`: grava o animal na tabela `ANIMAL` e as fotos na tabela `FOTO` (upload com `multer`, arquivos em `Server/img`).
  - `POST /addvacina`: grava fabricante, fornecedor, entrada de estoque, vacina e lote.
  - `GET /animais`, `GET /vacinas`: listam o que está no banco.
- **Conexão com o banco:** `Server/database.js` lê as credenciais do arquivo `Server/.env` (nunca publique esse arquivo).
- **Ajustes feitos no banco da Azure** para o cadastro de animais funcionar:
  coluna `rg` criada; `idade` virou texto (`VARCHAR`); regras (`CHECK`) de porte e status ampliadas para aceitar
  os valores do formulário.
- **Moldura do Admin:** usa o mesmo topo, menu e rodapé da home (definidos em `app/Admin/layout.tsx`).
- **Atenção:** as *listas* do Admin ainda leem arquivos JSON locais (`app/Admin/api/*`), não o banco. Só o
  **cadastro** grava na Azure.

---

## 14. Problemas que apareceram e como resolver (ótimo para explicar na apresentação)

| Sintoma | Causa | Solução |
|---|---|---|
| Página recarrega sem parar em modo dev | Cache do servidor de desenvolvimento ficou inconsistente | Parar o `npm run dev`, apagar a pasta `.next` e iniciar de novo |
| Site inteiro dá erro 500 | Servidor de desenvolvimento travado | Mesmo procedimento acima |
| Mudança no CSS não aparece | Cache do navegador (ou do servidor dev) | `Ctrl+F5` no navegador; se persistir, reiniciar o `npm run dev` |
| `In HTML, <html> cannot be a child of <body>` | O layout do `/adote` declarava `<html>` e `<body>` de novo | Trocar por um `<div>` (só o layout raiz `app/layout.tsx` pode ter `<html>` e `<body>`) |
| Ícone sem cor/tamanho no CSS Module | Em módulos, classe global precisa de `:global(...)` | Usar `:global(.material-symbols-rounded)` |
| Hover do botão ficava vermelho | CSS usava `#F24405` no `:hover` | Trocar para `#e06e00` |

---

## 15. Como acrescentar uma página nova (passo a passo)

1. Crie a pasta e o arquivo: `app/minha-pagina/page.tsx` (pode copiar uma página de `app/quem-somos/`).
2. Se quiser que apareça no **menu**: acrescente um item em `componentes/CustomNavBar/menuItens.ts`.
3. Para aparecer na **busca** e no **Acesso Rápido**: acrescente um item em `data/paginas.ts` (com `icone`).
4. Se for citada no rodapé: edite `componentes/CustomFooter/CustomFooter.tsx`.
5. Registre aqui, neste guia, o que a página faz.

---

## 16. Glossário dos conceitos usados

| Conceito | Em uma frase |
|---|---|
| **Componente** | Pedaço de tela reutilizável (uma função que devolve JSX) |
| **Props** | Informações que um componente recebe de quem o usa (como parâmetros de função) |
| **`useState`** | Guarda um valor que, ao mudar, atualiza a tela (ex.: se o dropdown está aberto) |
| **`useEffect`** | Roda um código depois que a tela aparece ou quando algo muda (ex.: ler o `localStorage`) |
| **`localStorage`** | Pequeno "armário" no navegador para guardar dados (fica mesmo depois de fechar a página) |
| **`usePathname`** | Devolve o endereço da página atual (ex.: `/racao`) |
| **`map` / `filter`** | Percorrem um array: `map` transforma cada item, `filter` escolhe alguns |
| **Rota** | Endereço de uma página; no Next.js, vem do nome da pasta em `app/` |
| **Componente de servidor / de cliente** | De servidor roda antes de chegar ao navegador; de cliente (`'use client'`) usa `useState`, cliques etc. |
| **CSS Modules** | CSS em que as classes valem só para um componente |
| **API / Express** | O servidor que recebe pedidos do site e conversa com o banco |

---

## 17. O que ainda está pendente

- Textos oficiais do departamento nas seções marcadas como "Conteúdo a ser preenchido".
- Login de verdade (hoje o botão "Entrar" leva direto ao cadastro de animais, sem validar usuário e senha).
- Padronizar para laranja os botões menores do Admin (Editar, Detalhes, Fechar, Aceitar).
- Conferir no mapa de `/sobrenos` se o pino cai exatamente no canil.

---

## Versão para a Vercel (cópia de hospedagem)

Esta pasta (`2 - projeto_integrador_vercel`) é uma **cópia** do projeto original, feita para ir ao ar na Vercel. O original (`1 - projeto_integrador`) não foi alterado e continua sendo o plano B da apresentação.

O que mudou em relação ao original:

- **Endereço da API**: os 4 arquivos que usavam `http://localhost:3010` agora usam `process.env.NEXT_PUBLIC_API_URL` (e, se a variável não existir, continuam usando `localhost:3010`).
- **Suspense**: `cadastro-animais` e `cadastro-vacinas` foram envolvidas em `<Suspense>`, exigência do Next no build de produção por causa do `useSearchParams`.
- **next.config.ts**: `ignoreBuildErrors: true`, porque o código tem um erro antigo de tipo do TypeScript (`vacina.id`) que travaria o deploy.
- **app/(private)** foi removida da cópia: eram páginas antigas que importavam componentes que não existem mais e impediam o build.
- **Server/**: (1) o `msnodesqlv8` saiu do package.json (driver só de Windows, quebra na Vercel); (2) o servidor exporta o `app` em vez de só dar `listen` quando roda na Vercel; (3) novos uploads de foto vão para uma pasta temporária; (4) novo `Server/vercel.json`.

Limitações conhecidas na Vercel:

- Fotos **novas** enviadas pelo site não ficam salvas de forma permanente (o disco da Vercel é temporário). As fotos que já estavam em `Server/img` funcionam normalmente.
- As rotas `app/Admin/api/*` que **escrevem** nos arquivos `.json` não salvam na Vercel (só leitura). A leitura funciona.
- O banco (Azure SQL) precisa liberar o acesso de IPs externos no firewall.
