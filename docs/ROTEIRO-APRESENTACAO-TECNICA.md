# Roteiro da apresentação técnica do portal

> Parte técnica da apresentação do Projeto Bem-Estar Animal (DSM, 3º semestre, Fatec Votorantim).
> Duração sugerida: **cerca de 12 minutos**, mais perguntas.

**Antes desta parte:** uma colega apresenta o projeto e o Departamento de Proteção e Bem-Estar Animal (DPBEA).
**Esta parte:** mostra **como o portal foi construído**, seguindo a ordem em que a pessoa usa o site.

> **Sobre o texto:** o roteiro está em voz impessoal, como o restante da documentação. Na hora de falar, é natural adaptar
> para a própria voz.

---

## 1. A sequência e o porquê dela

A ordem foi pensada para ir do **mais geral ao mais específico**, acompanhando o caminho de quem visita o site:

```
Visão técnica  →  Identidade visual  →  Home (carrossel)  →  Acesso Rápido
      →  Busca  →  Quiz  →  Filtros de animais  →  Sprint  →  Próximos passos
```

| # | Slide | Tempo | Ideia que a plateia deve levar |
|---|---|---|---|
| 1 | Abertura e passagem da palavra | 0:30 | Esta parte explica *como* foi feito |
| 2 | Visão técnica em 1 minuto | 1:00 | O site é montado com peças reutilizáveis |
| 3 | Identidade visual | 1:30 | O site tem cara própria e consistente |
| 4 | Carrossel | 1:00 | A home destaca campanhas |
| 5 | Acesso Rápido | 1:30 | O site se adapta a quem usa |
| 6 | Busca | 1:00 | A pessoa acha o que procura |
| 7 | Quiz | 1:30 | O site ajuda a escolher um pet |
| 8 | Filtros de animais | 1:00 | A lista é fácil de explorar |
| 9 | Sprint (Agile) | 0:45 | O trabalho segue um processo |
| 10 | Próximos passos | 1:00 | Cadastros e hospedagem na Vercel |
| 11 | Encerramento | 0:30 | Resumo e perguntas |

**Correspondência com o PDF** (`docs/APRESENTACAO-TECNICA.pdf`, 12 páginas):

| Slide do roteiro | Página do PDF |
|---|---|
| 1 Abertura | 1 (capa) e 2 (o que será visto) |
| 2 Visão técnica | 3 |
| 3 Identidade visual | 4 |
| 4 Carrossel | 5 |
| 5 Acesso Rápido | 6 |
| 6 Busca | 7 |
| 7 Quiz | 8 |
| 8 Filtros de animais | 9 |
| 9 Sprint | 10 |
| 10 Próximos passos | 11 |
| 11 Encerramento | 12 |

---

## 2. Slide a slide

### Slide 1: Abertura (0:30)

**Na tela:** título "Como o portal foi construído" e a lista do que será visto.

**Pontos de fala**
- Depois de conhecer o projeto e o departamento, esta parte mostra a **parte técnica** do portal.
- O que será visto, nesta ordem: identidade visual, carrossel, Acesso Rápido, busca, quiz e filtros de animais.
- No final, o que já está pronto e quais são os próximos passos.

---

### Slide 2: Visão técnica em 1 minuto (1:00)

**Na tela:** o diagrama abaixo.

```
 Navegador (a pessoa)
        │
        ▼
 Site: Next.js + React + TypeScript   ◄── páginas e componentes
        │
        ▼
 Servidor Express  ──►  Banco de dados SQL Server (Azure)
```

**Pontos de fala**
- O site usa **Next.js com React e TypeScript**. Cada pasta em `app/` vira uma página.
- A ideia central é o **componente**: uma peça escrita uma vez e usada em várias páginas. O menu, por exemplo, é
  um único componente usado em todas as páginas; se o menu muda, muda em todas.
- O banco de dados já está na **Azure** (SQL Server). O servidor Express faz a ponte entre o site e o banco.
- Os dados do portal público (lista de animais, lista de páginas, atalhos) ficam na pasta `data/`.

**Conceito em uma frase:** componente é um pedaço de tela reutilizável.

---

### Slide 3: Identidade visual (1:30)

**Na tela:** o logo do **Departamento de Proteção e Bem-Estar Animal** (criado por quem apresenta esta parte) e a marca
**Meetin'Pet**, a paleta de cores do site, a fonte e alguns cartões e botões.

**Pontos de fala**
- O logo do Departamento foi **criado por quem apresenta esta parte**. Ele reúne **animais (cão, gato e gambá), uma
  pessoa e mãos que amparam o planeta**, dentro de um círculo com o nome do departamento. Este é o ponto para explicar
  a ideia por trás do desenho.
- O logo aparece **no topo e no rodapé de todas as páginas**, e clicar nele leva à home.
- Ao lado dele está a marca **Meetin'Pet**, que identifica a parte de adoção do projeto: verde-água e laranja, com uma
  patinha no "i". Essas duas cores são as mesmas que guiam o site.
- Das cores do logo (azul-petróleo, verde e amarelo-dourado), o **verde-água** passou a guiar o site, junto com o
  **laranja** das ações.
- **Paleta:** verde-água `#348888` (identidade, menu e títulos), ciano claro `#9EF8EE` (fundos), laranja `#FA7F08`
  (ações) e cinza escuro para os textos.
- **Fonte:** Outfit, do Google Fonts, arredondada e fácil de ler, combinando com os cantos arredondados do site.
- **Ícones:** Material Symbols, do Google, gratuitos.
- **Mascotes:** Sol e Lua, que aparecem no quiz.
- **Padrões definidos:**
  - botões de ação **laranja**, em formato de pílula, com hover laranja escuro;
  - títulos de página em caixa alta, centralizados, com um traço laranja embaixo;
  - cartões com o mesmo degradê, borda e cantos arredondados.
- O laranja foi reservado para ações porque chama a atenção contra o fundo verde-água.

> **Opcional:** o projeto guarda duas versões do logo (`public/logo_Bem-EstarAnimalold.png`, mais detalhada, e
> `public/logo_Bem-EstarAnimal.png`, a atual). Se fizer sentido, vale mostrar a evolução e explicar o que mudou.

**Por que importa:** consistência. A pessoa reconhece o site em qualquer página e sabe onde clicar.

**Conceito em uma frase:** as cores ficam guardadas em **variáveis CSS** (`--cor-laranja`, `--cor-verde-agua`), então
trocar uma cor em um único lugar muda o site inteiro.

---

### Slide 3 → 4: Transição

> "Definida a identidade, o primeiro lugar onde ela aparece é a home."

---

### Slide 4: Carrossel da home (1:00)

**Na tela:** a home, com o carrossel trocando de slide.

**Pontos de fala**
- O carrossel destaca **campanhas** logo na entrada (castração e guarda responsável).
- Foi feito com o carrossel do **Bootstrap**: troca sozinho a cada 5 segundos, **pausa quando o mouse está em cima**
  e funciona com o dedo no celular.
- Um problema real: se a pessoa saía da home no meio da troca de slide, o navegador mostrava um erro. A causa era o
  carrossel ser destruído enquanto o Bootstrap ainda terminava a animação. A solução foi **pausar na hora e só
  destruir 1 segundo depois**.

**Conceito em uma frase:** `useEffect` com função de limpeza, que desfaz o que foi criado quando a pessoa sai da página.

---

### Slide 5: Acesso Rápido (1:30)

**Na tela:** os 4 cartões iniciais e, depois da demonstração, os cartões mudados.

**Pontos de fala**
- Os 4 primeiros cartões foram escolhidos por serem os serviços mais procurados: **Adote, Pets Perdidos, Castração e
  Banco de Ração**.
- A parte inteligente: conforme a pessoa visita outras páginas, elas **vão substituindo** os cartões iniciais.
  O que sobra fica escondido atrás do botão **Mais serviços**.
- Como funciona, em 3 peças:
  1. um componente invisível guarda o endereço de cada página visitada, no **`localStorage`** do navegador;
  2. o componente do Acesso Rápido lê essa lista, junta com os cartões iniciais que sobraram e mostra os 4 primeiros;
  3. os dados (título, texto, ícone e link) ficam em arquivos simples na pasta `data/`.
- **Limitação, dita com clareza:** o histórico fica só no navegador de cada pessoa. Para acompanhar a pessoa em
  outro computador, seria preciso login e banco de dados.

**Demonstração sugerida (30 s):** com o `localStorage` limpo, mostrar os 4 cartões, visitar a página de notícias e a de
voluntários, voltar à home e mostrar os cartões **mudados**. Clicar em *Mais serviços*.

**Conceitos em uma frase:** `localStorage` guarda dados no navegador; `useState` controla "mostrar 4" ou "mostrar todos".

---

### Slide 6: Busca (1:00)

**Na tela:** a barra do topo e a página de resultados.

**Pontos de fala**
- A barra de busca procura **nas páginas do site e nos animais**.
- Fluxo: a pessoa digita e aperta Enter; o site abre `/busca?q=palavra`; a página filtra duas listas (páginas e animais)
  e mostra os resultados em cartões.
- Regras da comparação:
  - ignora **maiúsculas e acentos** ("castração" e "castracao" são iguais);
  - a palavra digitada precisa ser o **começo** de uma palavra do texto; por isso "ração" não acha "castração";
  - se forem duas palavras, as duas precisam aparecer.
- **Limitação:** procura só no que está na lista (título, descrição e palavras-chave), não dentro do texto completo de
  cada página. É uma solução simples e suficiente para o estágio atual.

**Demonstração sugerida (30 s):** digitar "castração" (aparecem páginas) e depois "kairi" (aparece um animal).

**Conceitos em uma frase:** `filter` percorre uma lista e devolve só o que combina; o texto digitado viaja na URL (`?q=`).

---

### Slide 7: Quiz "Descubra seu pet ideal" (1:30)

**Na tela:** o quiz com os mascotes Sol e Lua e a trilha.

**Pontos de fala**
- O quiz ajuda quem **não sabe qual animal escolher**. São **6 perguntas**:
  1. cachorro ou gato;
  2. porte (pequeno, médio ou grande);
  3. ambiente (apartamento ou casa com quintal);
  4. tempo para exercícios (pouco, moderado ou muito);
  5. experiência com pets (iniciante, intermediário ou experiente);
  6. perfil do pet (mais calmo ou mais ativo).
- Os mascotes acompanham a trilha, para o quiz parecer um jogo e não um formulário.
- As respostas ficam guardadas no navegador e, ao final, o botão leva para a lista de animais.
- **Como a recomendação é calculada:** cada animal ganha **1 ponto** para cada critério que combina (porte, ambiente,
  exercício, personalidade e experiência). A espécie funciona como filtro. Quem faz **2 pontos ou mais** vira
  recomendação, e a lista é ordenada do maior para o menor.

**Conceito em uma frase:** é uma **pontuação por compatibilidade**: o código compara as respostas com as características
de cada animal e soma pontos.

---

### Slide 8: Filtros de animais (1:00)

**Na tela:** a lista de animais depois do quiz, o botão "Ver todos os animais" e os filtros.

**Pontos de fala**
- Quem vem do quiz vê **só as recomendações**. Abaixo, o botão **Ver todos os animais** mostra a lista completa, com
  um botão para voltar às recomendações. Isso evita despejar todos os animais de uma vez.
- Na lista completa há **cinco filtros** que podem ser combinados: **espécie, sexo, porte, idade e peso**.
- Quem entra direto, sem fazer o quiz, já vê a lista completa.
- Cada animal tem uma página própria, com fotos, perfil, prontuário e adestramento.

**Conceitos em uma frase:** `useState` guarda os filtros escolhidos; `filter` devolve só os animais que combinam com
**todos** os filtros ao mesmo tempo.

---

### Slide 9: Como o trabalho foi organizado, a sprint (0:45)

**Na tela:** o quadro da sprint criada na aula de Agile (print do backlog ou do quadro).

**Pontos de fala**
- O desenvolvimento segue a **sprint planejada na aula de Agile**: o trabalho é dividido em itens pequenos, entregues
  aos poucos e revisados.
- Itens desta parte já entregues:

  | Item | Situação |
  |---|---|
  | Identidade visual | Entregue |
  | Carrossel da home | Entregue |
  | Acesso Rápido | Entregue |
  | Busca | Entregue |
  | Quiz | Entregue |
  | Filtros e recomendações de animais | Entregue |

- Cada entrega foi **testada e ajustada** antes de passar para a seguinte.

> **Preencher antes de apresentar:** nome e meta da sprint, os números dos itens no quadro e a definição de "pronto"
> usada pelo grupo. Esses dados não constam no código.

---

### Slide 10: Próximos passos (1:00)

**Na tela:** uma linha do tempo simples.

```
 Já pronto:  portal público  +  banco de dados na Azure
 Próxima semana:  criar os cadastros  →  hospedar na Vercel
```

**Pontos de fala**
- O **banco de dados já está na Azure** e funcionando.
- Para a **próxima semana** estão previstos:
  1. **criar os cadastros** do sistema;
  2. **hospedar na Vercel**, para o site ficar acessível pela internet.
- Pontos de atenção já mapeados para a hospedagem:
  - o site vai para a Vercel, mas o **servidor Express** precisa de uma hospedagem própria (por exemplo, o Render)
    ou de uma adaptação;
  - os endereços que hoje apontam para `localhost` precisam virar **variáveis de ambiente**;
  - as **fotos enviadas** precisam de um armazenamento externo, porque o disco da hospedagem gratuita é apagado;
  - o **firewall do banco** na Azure precisa liberar o servidor, e a **senha do banco** fica só nas variáveis de
    ambiente, nunca no repositório.

---

### Slide 11: Encerramento (0:30)

**Pontos de fala**
- Em resumo: o portal tem **identidade própria**, uma home que **se adapta a quem usa**, **busca**, um **quiz** que
  recomenda animais e **filtros** que facilitam a escolha.
- Tudo foi feito com peças reutilizáveis, o que facilita manter e crescer.
- Os próximos passos são os cadastros e a hospedagem.
- Abrir para perguntas.

---

## 3. Perguntas prováveis e respostas curtas

**Por que usar Next.js e React?**
Porque o Next.js transforma cada pasta em uma página e o React permite criar componentes reutilizáveis, o que
mantém o visual consistente e o código organizado.

**O que é um componente?**
Um pedaço de tela escrito uma vez e usado em vários lugares, como o menu e o rodapé.

**Onde ficam guardados os dados do Acesso Rápido e do quiz? Vão para o banco?**
No `localStorage`, no navegador de quem visita. Não vão para o banco porque ainda não existe login por usuário.

**A busca lê o texto de todas as páginas?**
Não. Procura na lista de páginas (título, descrição e palavras-chave). Uma busca no texto completo exigiria um
mecanismo de busca, bem mais complexo.

**Como o quiz decide quais animais recomendar?**
Soma 1 ponto para cada critério que combina (porte, ambiente, exercício, personalidade e experiência). Com 2 pontos
ou mais, o animal é recomendado, na ordem da maior pontuação.

**Por que a cor laranja nos botões?**
Foi combinada no início do projeto e destaca as ações contra o fundo verde-água.

**O site é acessível?**
Há ajuste de tamanho da fonte, alto contraste, tradutor para Libras (VLibras) e filtro para daltonismo, além de
foco visível ao navegar pelo teclado.

**Como o site vai para a internet?**
Pela Vercel, que publica o Next.js a partir do repositório. O banco já está na Azure; falta definir onde roda o
servidor Express.

**Por que o banco está na Azure?**
Porque permite um banco SQL Server na nuvem, acessível de qualquer lugar, sem depender do computador de quem desenvolve.

**O que acontece com os dados se o navegador bloquear o `localStorage`?**
O código trata o erro e o Acesso Rápido só mostra os 4 cartões iniciais.

**Qual foi a maior dificuldade técnica?**
O erro do carrossel ao sair da home e o alinhamento dos cartões do Acesso Rápido, que tinham textos de tamanhos
diferentes. Ambos foram resolvidos (pausa antes de destruir; altura fixa para título e descrição).

---

## 4. Checklist antes de apresentar

- [ ] Os dois servidores estão rodando: `npm run dev` (site) e `npm run server` (Express).
- [ ] Navegador aberto na home (`http://localhost:3000`), em tela cheia, com zoom que permita ler à distância.
- [ ] `localStorage` limpo (F12 → Application → Local Storage → Clear), para mostrar a **primeira visita** do Acesso Rápido.
- [ ] Páginas de apoio abertas em abas: notícias, voluntários, quiz e lista de animais.
- [ ] Quiz respondido uma vez antes, para saber o resultado que vai aparecer.
- [ ] Print do quadro da sprint e do logo prontos.
- [ ] **Plano B:** prints de cada tela, caso a internet ou o servidor falhem.
- [ ] Tempo ensaiado: cerca de 12 minutos.

---

*Documentos de apoio: `docs/APRESENTACAO-PORTAL.md` (visão geral do portal) e `docs/COMO-FUNCIONA.md` (guia técnico).*
