/* =============================================================================
   CRIAR_BANNER.sql
   Cria a tabela BANNER, usada pelo cadastro de banners do Admin e pelo
   carrossel da home.

   REGRAS DESTE SCRIPT (mesmas dos outros scripts desta pasta):
     - So ACRESCENTA: cria uma tabela nova. Nada existente e alterado ou apagado.
     - Pode ser executado varias vezes (verifica se a tabela ja existe).
     - Tudo roda numa transacao: se algo falhar, desfaz tudo.

   COMO A TABELA E USADA:
     - Cada linha e um slide do carrossel da home.
     - A imagem NAO fica no banco: fica no Vercel Blob (ou em Server/img, no
       computador) e aqui guarda-se so o endereco (url_imagem), igual a FOTO.
     - "ordem" define a posicao no carrossel (menor aparece primeiro).
     - "ativo" liga/desliga o banner sem precisar apagar.
     - data_inicio / data_fim sao opcionais: o banner so aparece dentro do
       periodo (ex.: campanha de castracao). Vazio = sem limite.

   Como rodar: abrir no SSMS/Azure Data Studio conectado ao banco
   GESTAO_ANIMAL e executar.
   ========================================================================== */

SET XACT_ABORT ON;   -- qualquer erro desfaz a transacao inteira
BEGIN TRANSACTION;

IF OBJECT_ID('BANNER', 'U') IS NULL
    CREATE TABLE BANNER (
        id_banner     INT IDENTITY(1,1) PRIMARY KEY,
        titulo        NVARCHAR(120) NOT NULL,
        subtitulo     NVARCHAR(200) NULL,
        descricao     NVARCHAR(250) NULL,
        texto_botao   NVARCHAR(40)  NULL,
        link_botao    VARCHAR(300)  NULL,
        url_imagem    VARCHAR(500)  NULL,
        ordem         INT NOT NULL CONSTRAINT DF_BANNER_ordem DEFAULT 1,
        ativo         BIT NOT NULL CONSTRAINT DF_BANNER_ativo DEFAULT 1,
        data_inicio   DATE NULL,
        data_fim      DATE NULL,
        criado_em     DATETIME NOT NULL CONSTRAINT DF_BANNER_criado_em DEFAULT GETDATE(),
        atualizado_em DATETIME NULL,
        CONSTRAINT CK_BANNER_periodo
            CHECK (data_inicio IS NULL OR data_fim IS NULL OR data_fim >= data_inicio)
    );

COMMIT TRANSACTION;
PRINT 'CRIAR_BANNER aplicado com sucesso.';
