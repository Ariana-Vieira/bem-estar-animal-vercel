# Portal do Projeto Bem-Estar Animal

> Documento de apresentação.
> Curso de Desenvolvimento de Software Multiplataforma (DSM), 3º semestre, Fatec Votorantim.

---

## 1. Do que este documento trata

O Projeto Bem-Estar Animal é um sistema para o **Departamento de Proteção e Bem-Estar Animal (DPBEA) de Votorantim**.
Ele tem várias partes. Este documento explica **somente o portal público**, ou seja, o que a pessoa vê a partir
da **home** do site: o topo, o menu, a busca, o Acesso Rápido, as páginas de informação e a jornada de adoção.

**Ficam de fora deste documento** (são outras partes do projeto):
- o cadastro de animais e de vacinas;
- a área administrativa;
- o banco de ração;
- pets perdidos e encontrados.

Esses itens aparecem no menu do site, mas pertencem a outros grupos.

### O que já existia no grupo e o que foi feito neste trabalho

| Já existia (trabalho do grupo) | O que foi feito ou alterado neste trabalho |
|---|---|
| O quiz com os mascotes Sol e Lua e o cálculo das recomendações | Reorganização da jornada de adoção e do menu; novos textos e novo título do quiz |
| A lista de animais e a página de detalhe de cada animal | Exibição só das recomendações no início; novo posicionamento dos cards da página do animal |
| O carrossel, o VLibras e o filtro de daltonismo | Correção de um erro do carrossel |
| A página "Sobre o DPBEA" com as patinhas | Melhoria do conteúdo e alinhamento com o resto do site |
| O cabeçalho, o rodapé e o menu lateral | Troca do menu lateral pelo menu horizontal com dropdowns; novo rodapé e logos clicáveis |
| (não existia) | **Barra de busca, Acesso Rápido inteligente, páginas Quem Somos e Assistência Veterinária, padrão visual** |

---

## 2. Qual era o problema e qual foi a ideia

**O problema:** o site tinha várias telas feitas em momentos diferentes, cada uma com um visual um pouco diferente
(cores, botões, títulos). O menu lateral escondia as opções, a barra de pesquisa não fazia nada e muitas páginas
do menu ainda não existiam.

**A ideia geral:** deixar o portal com **cara de um site só**, fácil de navegar e preparado para receber o conteúdo
oficial do departamento. Em vez de escrever textos sem confirmação, foi criada a **estrutura** de cada
página, e o que ainda falta ficou marcado como "Conteúdo a ser preenchido".

Três regras guiaram as decisões:
1. **Padronizar:** o mesmo visual em todas as páginas.
2. **Reaproveitar:** escrever uma vez e usar em vários lugares (componentes).
3. **Manter simples:** soluções fáceis de entender e de explicar, sem truques.

---

## 3. Tecnologias e por que foram usadas

| Tecnologia | Para que serve | Por que ela |
|---|---|---|
| **Next.js + React** | Montar as telas com componentes | Cada pasta em `app/` vira uma página automaticamente |
| **TypeScript** | JavaScript com tipos | Avisa de erros antes de rodar |
| **CSS e CSS Modules** | Visual das páginas | Classes que valem só para um componente evitam conflito |
| **Bootstrap** | Grade e alguns estilos prontos | Ajuda no layout e no carrossel |
| **Material Symbols** | Ícones | Biblioteca gratuita do Google, com milhares de ícones |

---

## 4. Como o código está organizado

| Pasta | O que tem |
|---|---|
| `app/` | As páginas (cada pasta com `page.tsx` é um endereço) |
| `componentes/` | Peças reutilizáveis: menu, cabeçalho, rodapé, cartões |
| `data/` | Os dados: lista de animais, lista de páginas (para a busca) e cartões do Acesso Rápido |
| `public/` | Imagens |
| `docs/` | Documentação |

**A ideia central é o componente.** Em vez de copiar o menu em 30 páginas, o componente `CustomNavBar` é escrito
uma única vez e usado com `<CustomNavBar />` em todas. Se o menu muda, muda em todas as páginas ao mesmo tempo.

---

## 5. O padrão visual definido

| Decisão | O que ficou | Por quê |
|---|---|---|
| **Botões de ação laranja** | `#FA7F08`, formato de pílula, texto branco. No hover ficam laranja escuro (`#e06e00`) | Combinado no começo do projeto; chama a atenção contra o fundo verde-água |
| **Verde-água** | Menu, títulos e ícones | É a identidade do site |
| **Títulos de página** | Caixa alta, centralizados, com um traço laranja embaixo | Todas as páginas seguem a página "Sobre o Projeto" como referência |
| **Cartões grandes** | Mesmo degradê, borda e cantos arredondados | Dá a sensação de um site só |

Uma decisão mudou no caminho: o botão do cadastro ficava **vermelho** ao passar o mouse. A cor foi trocada para o
laranja escuro, igual à dos botões das outras páginas. Só permanece vermelho o que é ação destrutiva (excluir ou recusar).

---

## 6. A "moldura" das páginas: topo, menu e rodapé

Toda página pública tem quatro peças, nesta ordem:

1. **Faixa de acessibilidade** (`CustomAcessibilidade`): contraste, aumentar e diminuir fonte, e as **redes sociais**
   à direita. As redes sociais saíram da barra do menu e foram para cá, porque no menu faltava espaço e os ícones
   passavam por cima das opções.
2. **Cabeçalho** (`CustomHeader`): logo do Departamento, barra de busca e logo da Prefeitura.
3. **Menu** (`CustomNavBar`): o menu horizontal.
4. **Rodapé** (`CustomFooter`): links, contato e logos.

**Logos clicáveis:** o logo do Departamento leva para a home; o da Prefeitura abre o site oficial
`votorantim.sp.gov.br` **em outra aba**, para a pessoa não perder o site do projeto.

### Rodapé

O rodapé foi organizado em colunas com o mesmo estilo: **Institucional**, **Transparência e Participação** e **Contato**.
A transparência ficou no rodapé (e não no menu) porque é o lugar onde sites públicos costumam colocar esse tipo
de informação, o que também deixou o menu mais enxuto.

---

## 7. O menu

### Por que o menu lateral foi trocado

O menu antigo abria numa gaveta lateral com cerca de 35 links, e a pessoa precisava clicar em "Menu" para ver qualquer coisa.
Ele foi substituído por um **menu horizontal com dropdowns**, que mostra as categorias o tempo todo.

### Como as categorias foram pensadas

| Categoria | Para que serve |
|---|---|
| **Quem Somos** | Sobre o departamento, o projeto, a equipe, os mascotes, notícias, voluntários e perguntas frequentes |
| **Adoção Responsável** | Como adotar, quiz, lista de animais, lar temporário, festa do pijama e passeio |
| **Pets Perdidos e Encontrados** | (fora deste documento) |
| **Banco de Ração** | (fora deste documento) |
| **Assistência Veterinária** | Atendimento clínico, castração, mutirões, vacinação, microchip e clínicas |
| **Login / Cadastro** | Acesso da pessoa |

Os nomes foram escolhidos para que a pessoa os entenda sem precisar de explicação, e o que antes estava espalhado no
menu lateral foi agrupado por assunto.

### Como funciona por dentro

- Os itens ficam num **array** no arquivo `menuItens.ts`. O componente percorre o array com `.map()` e desenha o menu.
  **Para mudar o menu, basta editar o array**, sem mexer no componente.
- O dropdown abre ao passar o mouse e também ao clicar na setinha (para funcionar no celular e no teclado).
  Um `useState` guarda qual categoria está aberta; o dropdown fecha ao clicar fora, com a tecla Esc ou ao trocar de página.
- **A página atual fica destacada** (pílula verde com um traço laranja). O componente usa `usePathname()` para saber
  em que endereço está e compara com o link de cada item.
- Dentro do dropdown, ao clicar em "Festa do Pijama", a página rola direto para essa seção (isso se chama **âncora**,
  como `/adocao-responsavel#festa-do-pijama`) e o item correto fica destacado.
- O botão verde **Início** (com a patinha) fica **por cima** do menu, por meio do `z-index`.

**Conceitos usados:** array e `map`, `useState`, `useEffect`, props, `usePathname`.

---

## 8. A home

### Carrossel

O carrossel já existia, feito com o do Bootstrap. Um erro foi corrigido: se a pessoa saía da home **no meio da troca de
slide**, o carrossel era destruído, mas o Bootstrap ainda tentava terminar a troca num elemento que já não existia.
A solução foi **pausar na hora e só destruir 1 segundo depois**, quando a transição já tinha acabado.

### Acesso Rápido

**A ideia:** o Acesso Rápido mostra atalhos. Em vez de ser uma lista fixa, ele **aprende o que a pessoa usa**.

- Na **primeira visita** aparecem 4 cartões, escolhidos por serem os serviços mais procurados: **Adote,
  Pets Perdidos, Castração e Banco de Ração**.
- Conforme a pessoa visita outras páginas, elas **vão substituindo** os cartões iniciais.
- Os que sobram ficam escondidos atrás do botão **Mais serviços**.

**Como funciona (3 peças):**

1. **`RegistrarVisita`**: um componente invisível, colocado no layout do site. A cada página aberta, ele guarda o link
   no `localStorage` do navegador, no começo de uma lista, sem repetir (máximo de 8).
2. **`CustomAcessoRapido`**: lê essa lista, junta com os cartões iniciais que sobraram e mostra os 4 primeiros.
   Um `useState` controla se mostra todos ou só 4.
3. **`data/acessoRapido.ts` e `data/paginas.ts`**: os dados dos cartões (título, texto, ícone e link).

**Detalhe que exigiu cuidado:** cada página tem título e descrição de tamanhos diferentes, e isso deixava os cartões
desalinhados. A solução foi usar **altura fixa** para o título (2 linhas) e para a descrição (3 linhas, com "..." se passar)
e criar **títulos curtos** para os nomes longos (por exemplo, "Quiz do Pet Ideal").

**Limitação:** o histórico fica **no navegador** de cada pessoa. Não vai para o banco de dados.

### Barra de busca

**A ideia:** a barra do topo não fazia nada. Foi criada uma busca simples, que procura **nas páginas do site e nos animais**.

1. A pessoa digita e aperta Enter. O site abre `/busca?q=palavra`.
2. A página `/busca` lê a palavra da URL e usa `filter` em duas listas: a lista de páginas (`data/paginas.ts`)
   e a lista de animais.
3. Os resultados aparecem em cartões, e cada um leva ao destino.

**Como o filtro compara:**
- Ignora **maiúsculas e acentos** (assim "castração" e "castracao" são iguais).
- Cada palavra digitada precisa ser o **começo** de alguma palavra do texto. Assim "ração" **não** acha "castração"
  (esse erro apareceu nos testes e foi corrigido), mas "castr" acha.
- Se a pessoa digita duas palavras, as duas precisam aparecer.

**Limitação:** a busca olha só o que está na lista (título, descrição e palavras-chave), **não o texto inteiro** de
cada página. Para uma página nova aparecer, é preciso incluí-la em `data/paginas.ts`. Uma busca no texto completo
exigiria um mecanismo de busca, que é bem mais complexo e foge do que é possível fazer neste semestre.

---

## 9. As páginas de informação

Para não repetir código, foi criado um componente que monta o desenho de todas elas: título, cartão de introdução e
cartões de seção. Cada página só informa o **título, um resumo e a lista de seções**.

**Decisão importante:** os textos oficiais do departamento ainda não estão disponíveis. Por isso, onde não há conteúdo,
a seção mostra **"Conteúdo a ser preenchido"** e uma **dica do que escrever**. Assim a estrutura fica pronta e o
departamento só precisa entregar o texto. Onde já havia conteúdo no site (por exemplo, o texto do DPBEA ou das notícias),
ele foi **reaproveitado**, em vez de escrever algo novo.

### Quem Somos

| Página | O que tem |
|---|---|
| **Sobre o DPBEA** | Quem é o departamento, áreas de atuação, contatos e **mapa do Google** |
| **Sobre o Projeto** | Módulos do projeto e linha do tempo |
| **Estrutura e Equipe** | Parcerias (Secretaria de Meio Ambiente e Fatec) e orientação técnica |
| **Mascotes Sol e Lua** | Apresentação dos mascotes, com link para o quiz |
| **Notícias e Eventos** | As notícias que já estavam na home e as ações do departamento |
| **Seja Voluntário** | Formas de ajudar |
| **Perguntas Frequentes** | Perguntas que abrem e fecham, respondidas com o que já estava no site |

O **mapa** é um `<iframe>` do Google Maps com o endereço na URL, sem precisar de chave de API.

### Assistência Veterinária

Para definir quais itens uma prefeitura costuma oferecer, foi feita uma **pesquisa** (castração gratuita, mutirões,
vacinação antirrábica, microchip, clínicas credenciadas). Com ela, foram montadas 6 páginas: Atendimento Clínico,
Castração Gratuita, Mutirões de Castração, Vacinação Antirrábica, Microchip e Registro, e Clínicas Credenciadas.

Todas estão com a estrutura pronta. **O conteúdo (o que é gratuito, documentos, datas) precisa vir do departamento**,
porque varia de município para município e não se deve afirmar nada que ainda não esteja confirmado.

---

## 10. A jornada de adoção

A adoção passa por três páginas ligadas entre si:

```
Como adotar  →  Quiz  →  Animais para adoção  →  Página do animal  →  Login
```

| Página | Função |
|---|---|
| **Adoção Responsável** (`/adocao-responsavel`) | Página central: explica adoção, passeio, festa do pijama e lar temporário |
| **Quiz** (`/filtro`) | Pergunta sobre o perfil da pessoa e dos animais |
| **Animais para adoção** (`/meetinpet`) | Lista de animais com filtros |
| **Página do animal** (`/meetinpet/nome`) | Fotos, perfil, prontuário e adestramento |

### O problema encontrado e as mudanças

O quiz se chamava "Sobre nosso canil" e repetia o texto do "Sobre o DPBEA" e das atividades, o que confundia. Então:
- o quiz foi renomeado para **"Descubra seu pet ideal"**, e o que se repetia foi removido;
- foi criada a página **central**, que explica tudo e leva para o quiz e para a lista;
- a lista de animais entrou **no menu** (antes só se chegava a ela por botões);
- foi feita uma **cópia de segurança** do `/filtro` em `app/_bkp/` (a pasta começa com `_`, então não vira página), para
  permitir voltar atrás se necessário.

### Como o quiz recomenda animais

O quiz (feito pelo grupo) guarda as respostas no `localStorage`. Na lista de animais, o código calcula uma
**pontuação** para cada animal: soma 1 ponto para cada resposta que combina (porte, ambiente, exercício,
personalidade e experiência). Quem tem pontuação alta vira **recomendação**.

### Recomendações primeiro, "ver todos" depois

Antes, a lista mostrava as recomendações **e** todos os animais logo abaixo. O novo comportamento é:
1. mostrar **só as recomendações**;
2. abaixo, o botão **"Ver todos os animais"**;
3. ao clicar, as recomendações somem e aparece a lista completa, com um botão para **voltar às recomendações**.

Bastou um `useState` (`mostrarTodos`) para alternar entre as duas telas. Quem chega direto, sem fazer o quiz,
continua vendo todos os animais.

### A página de cada animal

Os três cards (**Perfil Social, Prontuário e Adestramento**) ficavam numa faixa larga embaixo da galeria, com
pouco texto e muito espaço vazio. Eles foram movidos para a **coluna da direita, alinhados com as miniaturas**, usando CSS
(`flex` com `space-between`). Em telas menores, os cards empilham. Os botões **Passear, Adotar e Festa do Pijama** levam
para o login.

---

## 11. Detalhes que melhoram a experiência

- **Efeito de patinhas** (`PataFundo`): patinhas que aparecem e somem no fundo dos cartões de adoção. É um
  componente com `setInterval` dentro de um `useEffect`, que **limpa o intervalo ao sair da página** para não
  ficar rodando à toa.
- **Hover e clique:** os itens do menu e os cartões ganham efeito ao passar o mouse, e o item da página atual
  ganha destaque.
- **Acessibilidade:** contraste, ajuste de fonte, VLibras (tradutor para Libras) e filtro para daltonismo, que já faziam
  parte do site. O foco visível (contorno laranja) foi mantido ao navegar pelo teclado.
- **Responsivo:** as grades se reorganizam em telas menores (por exemplo, o Acesso Rápido tem 4, 2 ou 1 cartão por
  linha, conforme a largura).

---

## 12. Problemas que apareceram e como foram resolvidos

| O que aconteceu | Causa | Solução |
|---|---|---|
| A home recarregava sem parar | Cache do servidor de desenvolvimento ficou inconsistente | Parar o servidor, apagar a pasta `.next` e iniciar de novo |
| Erro "`<html>` cannot be a child of `<body>`" | O layout de uma página declarava `<html>` e `<body>` de novo | Trocar por um `<div>`: só o layout raiz pode ter esses elementos |
| Erro no carrossel ao sair da home | Carrossel destruído no meio de uma transição | Pausar na hora e destruir 1 s depois |
| Ícone sem a cor definida no CSS | Em CSS Modules, a classe de um ícone global vira "local" | Usar `:global(.material-symbols-rounded)` |
| Busca por "ração" trazia "castração" | O código usava `includes`, que acha a palavra no meio de outra | Comparar só o **começo** das palavras (`startsWith`) |
| Cartões do Acesso Rápido desalinhados | Textos de tamanhos diferentes | Altura fixa para título e descrição + títulos curtos |
| Mudança no CSS não aparecia | Cache do navegador ou do servidor de desenvolvimento | `Ctrl+F5`; se continuar, reiniciar o servidor |

---

## 13. O que funciona hoje e o que falta

**Funciona:**
- Topo, menu com dropdowns, rodapé e logos clicáveis.
- Busca por páginas e animais.
- Acesso Rápido que se adapta às páginas visitadas.
- Páginas de Quem Somos, Assistência Veterinária e Adoção.
- Quiz, recomendações e lista de animais, com a página de cada animal.
- Mapa e contatos do departamento.

**Ainda falta (e por quê):**

| Pendência | Motivo |
|---|---|
| Textos oficiais nas seções "Conteúdo a ser preenchido" | Dependem do departamento |
| Login de verdade | Hoje o botão de entrar não valida usuário e senha |
| Histórico do Acesso Rápido por pessoa | Fica só no navegador; para acompanhar a pessoa seria preciso login e banco de dados |
| Busca no texto completo | Exigiria um mecanismo de busca |
| Conferir o pino do mapa no endereço do canil | É preciso confirmar no mapa se aponta o ponto certo |

---

## 14. Conceitos de aula usados

| Conceito | Onde aparece no projeto |
|---|---|
| **Componente e props** | Menu, cabeçalho, rodapé, cartões e o componente das páginas de informação |
| **Array, `map` e `filter`** | Desenhar o menu e os cartões; filtrar a busca e os animais |
| **`useState`** | Dropdown aberto, "Mais serviços", "Ver todos os animais" |
| **`useEffect`** | Ler o `localStorage`, registrar visitas, criar as patinhas |
| **`localStorage`** | Respostas do quiz e histórico do Acesso Rápido |
| **Rotas do Next.js** | Cada pasta de `app/` é uma página; parâmetros na URL (`?q=`) na busca |
| **CSS (flex, grid, hover, responsivo)** | Menu, cartões, página do animal, Acesso Rápido |
| **TypeScript** | Tipos dos dados (animal, página, cartão) |

---

## 15. Roteiro para a demonstração (cerca de 5 a 7 minutos)

1. **Home:** mostrar o topo (acessibilidade, redes sociais, logos clicáveis) e o menu com dropdowns.
2. **Acesso Rápido:** mostrar os 4 cartões, visitar duas páginas, voltar à home e ver os cartões **mudarem**. Clicar em *Mais serviços*.
3. **Busca:** digitar "castração" e depois "kairi" para mostrar páginas **e** animais.
4. **Quem Somos:** abrir "Sobre o DPBEA" (com o mapa) e uma página com "Conteúdo a ser preenchido", explicando o motivo.
5. **Adoção:** página central → quiz → resultado → só as recomendações → "Ver todos os animais" → página de um animal.
6. **Fechar:** mostrar o que falta (textos oficiais e login) e como o código facilita isso (um arquivo para o menu, um para a busca).

---

## 16. Perguntas que o professor pode fazer (e como responder)

**Por que usar componentes?**
Para escrever uma vez e usar em vários lugares. Se o menu muda, muda em todas as páginas.

**Onde ficam os dados do Acesso Rápido? Vão para o banco?**
Ficam no `localStorage`, no navegador de quem visita. Não vão para o banco porque ainda não existe login por usuário.

**A busca lê o texto de todas as páginas?**
Não. Ela procura na lista de páginas (`data/paginas.ts`), nos títulos, descrições e palavras-chave. É uma solução simples
e suficiente por enquanto; uma busca no texto completo exigiria um mecanismo de busca.

**Por que muitas seções estão com "Conteúdo a ser preenchido"?**
Porque o conteúdo oficial é do departamento, e não se deve afirmar nada que não esteja confirmado.
A estrutura está pronta para receber o texto.

**Como o menu sabe qual página destacar?**
O componente usa `usePathname()` (o endereço atual) e compara com o link de cada item.

**O que acontece se o navegador bloquear o `localStorage`?**
O código usa `try/catch`: se não conseguir guardar, o Acesso Rápido simplesmente mostra os 4 cartões iniciais.

**Como acrescentar uma página nova?**
Criar a pasta e o `page.tsx` em `app/`, incluir o item em `menuItens.ts` (menu) e em `data/paginas.ts` (busca e
Acesso Rápido).

---

*Documento complementar: `docs/COMO-FUNCIONA.md` (guia técnico, com todos os detalhes do código).*
