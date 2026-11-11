/* =============================================================================
   AJUSTE_MICROCHIP.sql
   Corrige o cadastro de animais sem microchip.

   PROBLEMA: na Azure, ANIMAL.microchip tinha uma UNIQUE CONSTRAINT
   (UQ_ANIMAL_MICROCHIP). O formulario de cadastro nao envia microchip (fica
   NULL) e o SQL Server trata NULL como um valor na restricao unica, entao so
   um animal sem microchip podia ser cadastrado; o segundo dava erro 500.

   SOLUCAO: trocar pela mesma regra, mas FILTRADA: o microchip continua nao
   podendo repetir, porem so quando estiver preenchido. Varios animais sem
   microchip passam a ser aceitos.

   - Seguro de repetir: cada passo verifica se ja foi feito.
   - Transacao: se falhar, desfaz tudo.
   - Se ja houver microchips repetidos preenchidos, a criacao do indice falha
     e a transacao desfaz tudo (nada e perdido).
   - Pode ser rodado no banco local tambem (la nao existia a restricao;
     o script so cria a regra filtrada).
   ========================================================================== */

SET XACT_ABORT ON;
BEGIN TRANSACTION;

-- 1) remove a restricao antiga (se existir)
IF EXISTS (SELECT 1 FROM sys.key_constraints
           WHERE name = 'UQ_ANIMAL_MICROCHIP' AND parent_object_id = OBJECT_ID('ANIMAL'))
    ALTER TABLE ANIMAL DROP CONSTRAINT UQ_ANIMAL_MICROCHIP;

-- 2) cria a regra filtrada (se ainda nao existir)
IF NOT EXISTS (SELECT 1 FROM sys.indexes
               WHERE name = 'UQ_ANIMAL_MICROCHIP_PREENCHIDO' AND object_id = OBJECT_ID('ANIMAL'))
    EXEC('CREATE UNIQUE INDEX UQ_ANIMAL_MICROCHIP_PREENCHIDO
          ON ANIMAL (microchip) WHERE microchip IS NOT NULL');

COMMIT TRANSACTION;
PRINT 'AJUSTE_MICROCHIP aplicado com sucesso.';
