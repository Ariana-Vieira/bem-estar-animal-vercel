/* =============================================================================
   AJUSTE_CATALOGO.sql
   Prepara o banco GESTAO_ANIMAL para receber os dados do catalogo publico
   (data/animais.json): campos do quiz, adestramento e historico de vacinas.

   REGRAS DESTE SCRIPT (para nao quebrar o cadastro que ja funciona):
     - So ACRESCENTA: colunas novas e tabelas novas. Nada e apagado,
       renomeado nem tem o tipo alterado.
     - Toda coluna nova aceita vazio (NULL) ou tem valor padrao (DEFAULT),
       entao o INSERT atual de animais (que nao conhece essas colunas) continua
       funcionando.
     - As tabelas novas usam ON DELETE CASCADE ligado a ANIMAL, para que o
       "Excluir animal" do Admin continue funcionando.
     - Pode ser executado varias vezes (cada passo verifica se ja existe).
     - Tudo roda numa transacao: se algo falhar, desfaz tudo.

   Como rodar: abrir no SSMS/Azure Data Studio conectado ao banco
   GESTAO_ANIMAL e executar. Testar primeiro no banco LOCAL.
   ========================================================================== */

SET XACT_ABORT ON;   -- qualquer erro desfaz a transacao inteira
BEGIN TRANSACTION;

/* ---------- 1) ANIMAL: campos do quiz e da pagina de detalhe ---------- */

IF COL_LENGTH('ANIMAL', 'descricao') IS NULL
    ALTER TABLE ANIMAL ADD descricao VARCHAR(1000) NULL;

IF COL_LENGTH('ANIMAL', 'personalidade') IS NULL
    ALTER TABLE ANIMAL ADD personalidade VARCHAR(30) NULL;

IF COL_LENGTH('ANIMAL', 'ambiente') IS NULL
    ALTER TABLE ANIMAL ADD ambiente VARCHAR(20) NULL;

IF COL_LENGTH('ANIMAL', 'exercicio') IS NULL
    ALTER TABLE ANIMAL ADD exercicio VARCHAR(20) NULL;

IF COL_LENGTH('ANIMAL', 'experiencia') IS NULL
    ALTER TABLE ANIMAL ADD experiencia VARCHAR(20) NULL;

IF COL_LENGTH('ANIMAL', 'alergico') IS NULL
    ALTER TABLE ANIMAL ADD alergico BIT NOT NULL CONSTRAINT DF_ANIMAL_alergico DEFAULT 0;

IF COL_LENGTH('ANIMAL', 'vermifugado') IS NULL
    ALTER TABLE ANIMAL ADD vermifugado BIT NOT NULL CONSTRAINT DF_ANIMAL_vermifugado DEFAULT 0;

IF COL_LENGTH('ANIMAL', 'microchipado') IS NULL
    ALTER TABLE ANIMAL ADD microchipado BIT NOT NULL CONSTRAINT DF_ANIMAL_microchipado DEFAULT 0;

-- Textos do catalogo (ex.: "2 anos", "3.5 kg") e faixas usadas nos filtros do
-- quiz (ex.: "ate 5kg", "menor que 03 meses"). "idade" e "peso" continuam
-- como estao, porque o cadastro atual usa essas colunas.
IF COL_LENGTH('ANIMAL', 'idade_detalhada') IS NULL
    ALTER TABLE ANIMAL ADD idade_detalhada VARCHAR(50) NULL;

IF COL_LENGTH('ANIMAL', 'peso_detalhado') IS NULL
    ALTER TABLE ANIMAL ADD peso_detalhado VARCHAR(50) NULL;

IF COL_LENGTH('ANIMAL', 'faixa_idade') IS NULL
    ALTER TABLE ANIMAL ADD faixa_idade VARCHAR(40) NULL;

IF COL_LENGTH('ANIMAL', 'faixa_peso') IS NULL
    ALTER TABLE ANIMAL ADD faixa_peso VARCHAR(30) NULL;

IF COL_LENGTH('ANIMAL', 'criado_em') IS NULL
    ALTER TABLE ANIMAL ADD criado_em DATETIME NOT NULL CONSTRAINT DF_ANIMAL_criado_em DEFAULT GETDATE();

IF COL_LENGTH('ANIMAL', 'atualizado_em') IS NULL
    ALTER TABLE ANIMAL ADD atualizado_em DATETIME NULL;

/* ---------- 2) PRONTUARIO: situacao do tratamento ---------- */

IF COL_LENGTH('PRONTUARIO', 'status_tratamento') IS NULL
    ALTER TABLE PRONTUARIO ADD status_tratamento VARCHAR(20) NULL;

/* ---------- 3) ADESTRAMENTO (tabela nova) ---------- */

IF OBJECT_ID('ADESTRAMENTO', 'U') IS NULL
    CREATE TABLE ADESTRAMENTO (
        id_adestramento   INT IDENTITY(1,1) PRIMARY KEY,
        id_animal         INT NOT NULL,
        id_profissional   INT NULL,
        data_adestramento DATE NULL,
        comportamento_alvo VARCHAR(100) NULL,
        metodo            VARCHAR(150) NULL,
        nivel             VARCHAR(30)  NULL,
        resultado_final   VARCHAR(30)  NULL,
        tempo             VARCHAR(50)  NULL,
        observacao        VARCHAR(255) NULL,
        CONSTRAINT FK_ADESTRAMENTO_ANIMAL
            FOREIGN KEY (id_animal) REFERENCES ANIMAL (id_animal) ON DELETE CASCADE,
        CONSTRAINT FK_ADESTRAMENTO_PROFISSIONAL
            FOREIGN KEY (id_profissional) REFERENCES PROFISSIONAL (id_profissional)
    );

IF OBJECT_ID('ADESTRAMENTO_TRUQUE', 'U') IS NULL
    CREATE TABLE ADESTRAMENTO_TRUQUE (
        id_truque         INT IDENTITY(1,1) PRIMARY KEY,
        id_adestramento   INT NOT NULL,
        truque            VARCHAR(60) NOT NULL,
        CONSTRAINT FK_TRUQUE_ADESTRAMENTO
            FOREIGN KEY (id_adestramento) REFERENCES ADESTRAMENTO (id_adestramento) ON DELETE CASCADE
    );

/* ---------- 4) VACINA_ANIMAL: historico simples de vacinas do animal ---------- */
-- (nome, lote, datas e dose, como esta no JSON; sem depender de LOTE_VACINA)

IF OBJECT_ID('VACINA_ANIMAL', 'U') IS NULL
    CREATE TABLE VACINA_ANIMAL (
        id_vacina_animal  INT IDENTITY(1,1) PRIMARY KEY,
        id_animal         INT NOT NULL,
        nome_vacina       VARCHAR(100) NOT NULL,
        lote              VARCHAR(50)  NULL,
        data_aplicacao    DATE NULL,
        data_validade     DATE NULL,
        dose_recomendada  VARCHAR(30)  NULL,
        observacao        VARCHAR(255) NULL,
        CONSTRAINT FK_VACINA_ANIMAL_ANIMAL
            FOREIGN KEY (id_animal) REFERENCES ANIMAL (id_animal) ON DELETE CASCADE
    );

COMMIT TRANSACTION;
PRINT 'AJUSTE_CATALOGO aplicado com sucesso.';
