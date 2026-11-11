/* =============================================================================
   CARGA_CATALOGO.js
   Passa os animais do catalogo publico (data/animais.json) para o banco
   GESTAO_ANIMAL: ANIMAL, FOTO, PROFISSIONAL, PRONTUARIO, VACINA_ANIMAL,
   ADESTRAMENTO e ADESTRAMENTO_TRUQUE.

   ANTES: rodar estruturabanco/AJUSTE_CATALOGO.sql e AJUSTE_MICROCHIP.sql.

   COMO RODAR (na pasta do projeto):
     node estruturabanco/CARGA_CATALOGO.js local --simular   (ensaio no banco LOCAL, nao grava)
     node estruturabanco/CARGA_CATALOGO.js local             (grava no banco LOCAL)
     node estruturabanco/CARGA_CATALOGO.js azure --simular   (ensaio na AZURE, nao grava)
     node estruturabanco/CARGA_CATALOGO.js azure             (grava na AZURE)

   - "local" usa o SQL Server da maquina; "azure" le Server/.env.
     O script confere em qual servidor realmente conectou e aborta se for o
     banco errado.
   - Pode rodar mais de uma vez: animal que ja existe (mesmo nome e especie)
     e pulado, entao nada duplica.
   - Tudo roda numa transacao: se algo der erro, nada e gravado.
   - NAO apaga nem altera nenhum registro existente.
   ========================================================================== */

const path = require("path");
const fs = require("fs");

const alvo = process.argv[2];
const simular = process.argv.includes("--simular");
if (!["local", "azure"].includes(alvo)) {
  console.log("Uso: node estruturabanco/CARGA_CATALOGO.js <local|azure> [--simular]");
  process.exit(1);
}

// A conexao (Server/database.js) le o .env da pasta de onde o comando roda:
// em "azure" entramos em Server/ (onde esta o .env); em "local" ficamos na raiz.
const raiz = path.join(__dirname, "..");
process.chdir(alvo === "azure" ? path.join(raiz, "Server") : raiz);
const { sql, conectar } = require(path.join(raiz, "Server", "database.js"));

const catalogo = JSON.parse(fs.readFileSync(path.join(raiz, "data", "animais.json"), "utf8"));

// ---------- conversoes do formato do JSON para o formato do banco ----------
const sexoBanco = (s) => (s === "macho" ? "M" : s === "femea" ? "F" : null);

// "2 anos" -> 2 | "1 ano e 6 meses" -> 1 | "2 meses" -> 0  (a coluna "idade" e numerica no local)
function idadeEmAnos(texto) {
  const m = /(\d+)\s*ano/.exec(texto || "");
  return m ? Number(m[1]) : 0;
}

// "3.5 kg" -> 3.5   (coluna "peso" e DECIMAL(5,2))
function pesoNumero(texto) {
  const n = parseFloat(String(texto || "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

const texto = (v) => (v === undefined || v === null || v === "" ? null : String(v));

(async () => {
  const cn = await conectar();

  // ---------- trava de seguranca: confere o banco ----------
  const servidor = (await cn.request().query("SELECT @@SERVERNAME s")).recordset[0].s;
  const ehAzure = /gestaoanimal/i.test(servidor);
  if ((alvo === "azure") !== ehAzure) {
    console.log(`ABORTADO: pedi "${alvo}", mas conectei em "${servidor}".`);
    process.exit(1);
  }
  console.log(`Banco: ${alvo.toUpperCase()} (${servidor})  |  modo: ${simular ? "SIMULACAO (nao grava)" : "GRAVANDO"}`);

  // confere se a estrutura nova existe
  const faltando = (await cn.request().query(`
      SELECT 'ADESTRAMENTO' n WHERE OBJECT_ID('ADESTRAMENTO','U') IS NULL
      UNION SELECT 'VACINA_ANIMAL' WHERE OBJECT_ID('VACINA_ANIMAL','U') IS NULL
      UNION SELECT 'ANIMAL.faixa_peso' WHERE COL_LENGTH('ANIMAL','faixa_peso') IS NULL`)).recordset;
  if (faltando.length) {
    console.log("ABORTADO: rode antes o AJUSTE_CATALOGO.sql. Faltando:", faltando.map((x) => x.n).join(", "));
    process.exit(1);
  }

  const total = { animais: 0, pulados: 0, fotos: 0, profissionais: 0, prontuarios: 0, vacinas: 0, adestramentos: 0, truques: 0 };
  const tr = new sql.Transaction(cn);
  await tr.begin();
  const req = () => new sql.Request(tr);

  try {
    // ---------- profissionais (veterinarios e adestradores), sem repetir ----------
    const cacheProf = new Map();
    async function profissional(nome, tipo) {
      if (!nome) return null;
      const chave = tipo + "|" + nome;
      if (cacheProf.has(chave)) return cacheProf.get(chave);
      const achou = await req().input("n", sql.NVarChar(100), nome).input("t", sql.NVarChar(30), tipo)
        .query("SELECT id_profissional id FROM PROFISSIONAL WHERE nome = @n AND tipo = @t");
      let id;
      if (achou.recordset.length) id = achou.recordset[0].id;
      else {
        const novo = await req().input("n", sql.NVarChar(100), nome).input("t", sql.NVarChar(30), tipo)
          .query("INSERT INTO PROFISSIONAL (nome, tipo) OUTPUT INSERTED.id_profissional id VALUES (@n, @t)");
        id = novo.recordset[0].id;
        total.profissionais++;
      }
      cacheProf.set(chave, id);
      return id;
    }

    for (const a of catalogo) {
      // ---------- ja existe? pula ----------
      const existe = await req().input("n", sql.NVarChar(100), a.nome).input("e", sql.NVarChar(50), a.especie)
        .query("SELECT id_animal FROM ANIMAL WHERE nome = @n AND especie = @e");
      if (existe.recordset.length) {
        total.pulados++;
        console.log(`  pulado (ja existe): ${a.nome}`);
        continue;
      }

      // ---------- ANIMAL ----------
      // rg fica vazio ('') e nao NULL: a lista do Admin chama rg.toLowerCase().
      const r = await req()
        .input("nome", sql.NVarChar(100), a.nome)
        .input("rg", sql.NVarChar(30), "")
        .input("especie", sql.NVarChar(50), a.especie)
        .input("raca", sql.NVarChar(60), texto(a.raca))
        .input("sexo", sql.Char(1), sexoBanco(a.sexo))
        .input("porte", sql.NVarChar(10), texto(a.porte))
        .input("idade", sql.Int, idadeEmAnos(a.idadeDetalhada))
        .input("peso", sql.Decimal(5, 2), pesoNumero(a.pesoDetalhado))
        .input("cor", sql.NVarChar(50), texto(a.cor))
        .input("castrado", sql.Bit, !!a.castrado)
        .input("vacinado", sql.Bit, !!a.vacinacao)
        .input("status", sql.NVarChar(20), a.status)
        .input("descricao", sql.NVarChar(1000), texto(a.descricao))
        .input("personalidade", sql.NVarChar(30), texto(a.personalidade))
        .input("ambiente", sql.NVarChar(20), texto(a.ambiente))
        .input("exercicio", sql.NVarChar(20), texto(a.exercicio))
        .input("experiencia", sql.NVarChar(20), texto(a.experiencia))
        .input("alergico", sql.Bit, !!a.alergico)
        .input("vermifugado", sql.Bit, !!a.vermifugado)
        .input("microchipado", sql.Bit, !!a.microchipado)
        .input("idadeDet", sql.NVarChar(50), texto(a.idadeDetalhada))
        .input("pesoDet", sql.NVarChar(50), texto(a.pesoDetalhado))
        .input("faixaIdade", sql.NVarChar(40), texto(a.idade))
        .input("faixaPeso", sql.NVarChar(30), texto(a.peso))
        .query(`INSERT INTO ANIMAL
                  (nome, rg, especie, raca, sexo, porte, idade, peso, cor, castrado, vacinado, status,
                   descricao, personalidade, ambiente, exercicio, experiencia, alergico, vermifugado,
                   microchipado, idade_detalhada, peso_detalhado, faixa_idade, faixa_peso)
                OUTPUT INSERTED.id_animal id
                VALUES
                  (@nome, @rg, @especie, @raca, @sexo, @porte, @idade, @peso, @cor, @castrado, @vacinado, @status,
                   @descricao, @personalidade, @ambiente, @exercicio, @experiencia, @alergico, @vermifugado,
                   @microchipado, @idadeDet, @pesoDet, @faixaIdade, @faixaPeso)`);
      const idAnimal = r.recordset[0].id;
      total.animais++;

      // ---------- FOTO: so o caminho (os arquivos ja estao em public/) ----------
      // A foto principal e a "imagem"; se ela nao estiver na lista de fotos, entra tambem.
      const urls = a.fotos.map((f) => f.urlFoto);
      if (a.imagem && !urls.includes(a.imagem)) urls.unshift(a.imagem);
      for (const url of urls) {
        await req().input("id", sql.Int, idAnimal).input("url", sql.VarChar(255), url).input("p", sql.Bit, url === a.imagem)
          .query("INSERT INTO FOTO (id_animal, url_foto, principal, data_cadastro) VALUES (@id, @url, @p, GETDATE())");
        total.fotos++;
      }

      // ---------- VACINA_ANIMAL ----------
      for (const v of a.vacinas || []) {
        await req().input("id", sql.Int, idAnimal)
          .input("nome", sql.NVarChar(100), v.nomeVacina).input("lote", sql.NVarChar(50), texto(v.lote))
          .input("aplic", sql.Date, texto(v.dataAplicacao)).input("valid", sql.Date, texto(v.dataValidade))
          .input("dose", sql.NVarChar(30), texto(v.doseRecomendada)).input("obs", sql.NVarChar(255), texto(v.observacoes))
          .query(`INSERT INTO VACINA_ANIMAL (id_animal, nome_vacina, lote, data_aplicacao, data_validade, dose_recomendada, observacao)
                  VALUES (@id, @nome, @lote, @aplic, @valid, @dose, @obs)`);
        total.vacinas++;
      }

      // ---------- PRONTUARIO (exige profissional) ----------
      for (const p of a.prontuarios || []) {
        const idProf = await profissional(p.veterinario && p.veterinario.nomeUsuario, "veterinario");
        if (!idProf) { console.log(`  aviso: prontuario de ${a.nome} sem veterinario, ignorado`); continue; }
        await req().input("id", sql.Int, idAnimal).input("prof", sql.Int, idProf)
          .input("data", sql.DateTime, new Date(p.dataProntuario + "T12:00:00"))
          .input("desc", sql.NVarChar(sql.MAX), texto(p.diagnostico))
          .input("obs", sql.NVarChar(255), texto(p.observacoes))
          .input("st", sql.NVarChar(20), texto(p.statusTratamento))
          .query(`INSERT INTO PRONTUARIO (id_animal, id_profissional, data_atendimento, descricao, observacao, status_tratamento)
                  VALUES (@id, @prof, @data, @desc, @obs, @st)`);
        total.prontuarios++;
      }

      // ---------- ADESTRAMENTO + truques ----------
      for (const ad of a.adestramento || []) {
        const idProf = await profissional(ad.adestrador && ad.adestrador.nomeUsuario, "adestrador");
        const novo = await req().input("id", sql.Int, idAnimal).input("prof", sql.Int, idProf)
          .input("data", sql.Date, texto(ad.dataAdestramento))
          .input("alvo", sql.NVarChar(100), texto(ad.comportamentoAlvo))
          .input("metodo", sql.NVarChar(150), texto(ad.metodoUtilizado))
          .input("nivel", sql.NVarChar(30), texto(ad.nivelTreinamento))
          .input("res", sql.NVarChar(30), texto(ad.resultadoFinal))
          .input("tempo", sql.NVarChar(50), texto(ad.tempoAdestramento))
          .input("obs", sql.NVarChar(255), texto(ad.observacao))
          .query(`INSERT INTO ADESTRAMENTO (id_animal, id_profissional, data_adestramento, comportamento_alvo, metodo, nivel, resultado_final, tempo, observacao)
                  OUTPUT INSERTED.id_adestramento id
                  VALUES (@id, @prof, @data, @alvo, @metodo, @nivel, @res, @tempo, @obs)`);
        total.adestramentos++;
        for (const t of ad.truques || []) {
          await req().input("ad", sql.Int, novo.recordset[0].id).input("t", sql.NVarChar(60), t)
            .query("INSERT INTO ADESTRAMENTO_TRUQUE (id_adestramento, truque) VALUES (@ad, @t)");
          total.truques++;
        }
      }
      console.log(`  ok: ${a.nome}`);
    }

    if (simular) { await tr.rollback(); console.log("\nSIMULACAO: nada foi gravado (rollback)."); }
    else { await tr.commit(); console.log("\nGravado com sucesso (commit)."); }
    console.log("Resumo:", JSON.stringify(total));
    process.exit(0);
  } catch (e) {
    try { await tr.rollback(); } catch (_) { }
    console.log("\nERRO, NADA FOI GRAVADO (rollback):", e.message);
    process.exit(2);
  }
})().catch((e) => { console.log("ERRO:", e.message); process.exit(2); });
