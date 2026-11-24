/* =============================================================================
   CRIAR_NOTICIA.sql
   Cria a tabela NOTICIA, usada pelo cadastro de noticias do Admin (e, depois,
   pela secao de noticias do site).

   REGRAS DESTE SCRIPT (mesmas dos outros scripts desta pasta):
     - So ACRESCENTA: cria uma tabela nova. Nada existente e alterado ou apagado.
     - Pode ser executado varias vezes (verifica se a tabela ja existe).
     - Tudo roda numa transacao: se algo falhar, desfaz tudo.

   COMO A TABELA E USADA:
     - Cada linha e uma noticia.
     - A imagem NAO fica no banco: fica no Vercel Blob (ou em Server/img, no
       computador) e aqui guarda-se so o endereco (url_imagem), igual a BANNER.
     - "data_publicacao" e a data que aparece na noticia; noticia com data
       futura fica agendada e so aparece no site a partir desse dia.
     - "ativo" liga/desliga a noticia sem precisar apagar.

   Como rodar: abrir no SSMS/Azure Data Studio conectado ao banco
   GESTAO_ANIMAL e executar.
   ========================================================================== */

SET XACT_ABORT ON;   -- qualquer erro desfaz a transacao inteira
BEGIN TRANSACTION;

IF OBJECT_ID('NOTICIA', 'U') IS NULL
    CREATE TABLE NOTICIA (
        id_noticia      INT IDENTITY(1,1) PRIMARY KEY,
        titulo          NVARCHAR(150)  NOT NULL,
        resumo          NVARCHAR(250)  NULL,
        conteudo        NVARCHAR(MAX)  NULL,
        url_imagem      VARCHAR(500)   NULL,
        data_publicacao DATE NOT NULL CONSTRAINT DF_NOTICIA_data_publicacao DEFAULT CAST(GETDATE() AS DATE),
        ativo           BIT  NOT NULL CONSTRAINT DF_NOTICIA_ativo DEFAULT 1,
        criado_em       DATETIME NOT NULL CONSTRAINT DF_NOTICIA_criado_em DEFAULT GETDATE(),
        atualizado_em   DATETIME NULL
    );

COMMIT TRANSACTION;
PRINT 'CRIAR_NOTICIA aplicado com sucesso.';
