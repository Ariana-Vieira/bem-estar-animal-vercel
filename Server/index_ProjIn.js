//https://expressjs.com/
//https://nodemon.io/
//https://expressjs.com/en/resources/middleware/cors/
//https://www.npmjs.com/package/mssql

//npm install mssql msnodesqlv8


const express = require('express');
const cors = require('cors');
let app = express();
let bodyParser = require('body-parser');
let methodOvirride = require('method-override');
app.use(express.json());// antigamenete era o body-parser precisa ser instalado, mas agora já vem junto com o express
let port = 3010;


// Permite que você use verbos HTTP
app.use(methodOvirride('X-HTTP-Method'));
app.use(methodOvirride('X-HTTP-Method-Override'));
app.use(methodOvirride('X-Method-Override'));
app.use(methodOvirride('_method'));



app.use((req, resp, next) => {
    resp.header("Access-Control-Allow-Origin", "*");
    resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ====== INSTALAR MULTER https://www.npmjs.com/package/multer
//=== npm install multer

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { sql, conectar } = require('./database.js');

// A idade pode vir como faixa ("06 meses a 07 anos") ou texto livre ("2 anos").
// A coluna ANIMAL.idade (numerica no banco local) guarda so os ANOS inteiros,
// quando for possivel descobrir; o texto original vai em idade_detalhada e a
// faixa em faixa_idade.
function idadeEmAnos(texto) {
    const t = String(texto || "");
    let m = /(\d+)\s*ano/i.exec(t);
    if (m) return Number(m[1]);
    if (/^\s*\d+\s*$/.test(t)) return Number(t);
    if (/(\d+)\s*mes/i.test(t)) return 0;
    return null;
}
// const { MAX } = require('mssql');
// const { decapsulate } = require('crypto');

app.use(cors());

//===========Multer CONFIGURAR O DIRETORIO ===============

// Na Vercel o disco e somente leitura: uploads novos vao para /tmp (temporario)
const pastaImgFixas = path.join(__dirname, "./img");
const pastaUploads = process.env.VERCEL ? require("os").tmpdir() : pastaImgFixas;

app.use("/img", express.static(pastaImgFixas));
app.use("/img", express.static(pastaUploads));

if (!fs.existsSync(pastaUploads)) {
    fs.mkdirSync(pastaUploads, { recursive: true });
}

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, pastaUploads);
    },

    filename: function (req, file, cb) {

        const extensao = path.extname(file.originalname);

        const nomeArquivo =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${extensao}`;

        cb(null, nomeArquivo);
    }
});

const upload = multer({
    storage: storage
});


app.use("/img", express.static(pastaUploads));

//=======================================


//========== LER A QUANTIDADE DE REGISTRO  ANIMAIS ============
app.get('/qtd', async (req, resp) => {
    try {
        // FAZER  A CONTAGEM DE REGISTRO
        const cn = await conectar();
        const qtd = await cn.request().query("SELECT COUNT(*) as total FROM ANIMAL");
        resp.json({ "qtd": qtd.recordset[0].total });
    }
    catch (error) {
        resp.json({ "tipo de erro ": error })
   }
})



//========== LER A LISTA DE VACINAS ===========================
// *Mesma ideia do app.get("/animais"): lá o
// professor fez INNER JOIN entre ANIMAL e FOTO (pegando a foto.principal = 1)
// porque os dados de foto ficam em outra tabela. Aqui é parecido, só que com
// várias tabelas de detalhe penduradas no lote mais recente de cada vacina:
//   - LOTE_VACINA: lote, data de fabricação, validade, quantidade,
//     valor unitário, responsável, temperatura e local de armazenamento;
//   - FABRICANTE: ligado por LOTE_VACINA.id_fabricante;
//   - ENTRADA_ESTOQUE + FORNECEDOR: ligados por LOTE_VACINA.id_entrada
//     (fornecedor, data de entrada, nota fiscal e valor total).
// O "SELECT * FROM VACINA" antigo não trazia nada disso.
// Como uma vacina pode ter mais de um lote cadastrado, usamos CROSS APPLY
// para pegar sempre o lote mais recente (TOP 1 ... ORDER BY id_lote_vacina
// DESC), fazendo o papel que o "principal = 1" faz para as fotos do animal.
app.get('/vacinas', async (req, resp) => {
    try {
        const cn = await conectar();
        const querySql = `SELECT
                                vacina.id_vacina,
                                vacina.id_vacina AS id,
                                lote.id_lote_vacina,
                                vacina.nome,
                                vacina.descricao,
                                vacina.especie,
                                vacina.tipo,
                                lote.numero_lote      AS lote,
                                lote.data_fabricacao  AS dataFabricacao,
                                lote.data_validade    AS validade,
                                lote.quantidade_disponivel AS quantidade,
                                lote.valor_unitario   AS valorUnitario,
                                lote.responsavel      AS responsavel,
                                lote.temperatura      AS temperatura,
                                lote.local_armazenamento AS localArmazenamento,
                                fabricante.nome        AS fabricante,
                                fornecedor.nome        AS fornecedor,
                                entrada.data_entrada   AS dataEntrada,
                                entrada.nota_fiscal    AS notaFiscal,
                                entrada.valor_total    AS valorTotal
                          FROM VACINA vacina
                          CROSS APPLY (
                                SELECT TOP 1 *
                                FROM LOTE_VACINA lv
                                WHERE lv.id_vacina = vacina.id_vacina
                                ORDER BY lv.id_lote_vacina DESC
                          ) lote
                          LEFT JOIN FABRICANTE fabricante
                                ON fabricante.id_fabricante = lote.id_fabricante
                          LEFT JOIN ENTRADA_ESTOQUE entrada
                                ON entrada.id_entrada = lote.id_entrada
                          LEFT JOIN FORNECEDOR fornecedor
                                ON fornecedor.id_fornecedor = entrada.id_fornecedor
                          ORDER BY vacina.id_vacina DESC`;

        const resultado = await cn.request().query(querySql);
        resp.json(resultado.recordset);
    }
    catch (error) {
        resp.json({ "tipo de erro ": error })
    }


})


 app.get('/qtdvacinas', async (req, resp) => {
    try {
        // FAZER  A CONTAGEM DE REGISTRO
        const cn = await conectar();
        const resultado= await cn.request().query("SELECT COUNT(*) AS TOTAL  FROM VACINA");
        resp.json({"qtd": resultado.recordset[0].TOTAL});
    }
    catch (error) {
        resp.json({ "tipo de erro ": error })
    }


})

//===================================================================



//==== MONTAR A  TABELA DE LISTA DE ANIMAL ===============
app.get("/animais", async (req, resp) => {
    try {
        // FAZER  A CONTAGEM DE REGISTRO
        const cn = await conectar();
        const querySql = `SELECT 
                                    animal.id_animal, 
                                    animal.id_animal AS id,
                                    animal.especie AS tipo,
                                    animal.nome, 
                                    animal.rg, 
                                    animal.especie, 
                                    animal.porte,  
                                    animal.raca, 
                                    animal.idade,
                                    animal.faixa_idade,
                                    animal.idade_detalhada,  
                                    animal.sexo,
                                    animal.status,  
                                    foto.url_foto,
                                    foto.principal
                          from ANIMAL inner join  foto
                          on ANIMAL.id_animal = foto.id_animal
                             where foto.principal = 1 
                             ORDER BY  animal.id_animal DESC`;

        const campos = await cn.request().query(querySql);
        resp.json(campos.recordset);
    }
    catch (error) {
        resp.json({ "tipo de erro ": error })
    }
})

app.get('/', async (req, res) => {
    // fazer diretamente a conexão com o banco de dados
    const cn = await conectar();
    // fazer o query para testar a conexão com o banco de dados
    const result = await cn.request().query("SELECT * FROM ANIMAL");
    //res.send('Conexão com o banco de dados realizada com sucesso!');    
    res.json(result.recordset);
    //res.send('Hsadasl');
});

//========== CADASTRO DE ANIMAIS ========================
// INSERT
app.post("/INSERT", upload.array("fotos", 3), async (req, res) => {
    const {
        id,
        nome,
        rg,
        tipo,
        porte,
        raca,
        idade,
        faixaIdade,
        sexo,
        status,
        fotos,
        fotoPrincipal

    } = req.body;

    // está pegando os dados do corpo da requisição
    console.log("=================================");
    console.log("FOTO PRINCIPAL RECEBIDA:");
    console.log(fotoPrincipal);
    console.log("TIPO:");
    console.log(typeof fotoPrincipal);
    console.log("FOTOS RECEBIDAS:");
    console.log(req.files);
    console.log("=================================");
    const cn = await conectar();


    // conectando com o banco de dados
    // Executar INSERT
    const result = await cn
        .request()
        .input('nome', sql.VarChar(100), nome)
        .input('rg', sql.VarChar(100), rg)
        .input('tipo', sql.VarChar(100), tipo)
        .input('porte', sql.VarChar(100), porte)
        .input('raca', sql.VarChar(100), raca)
        .input('idade', sql.Int, idadeEmAnos(idade))
        .input('idadeDetalhada', sql.NVarChar(50), idade ? String(idade).slice(0, 50) : null)
        .input('faixaIdade', sql.NVarChar(40), faixaIdade || null)
        .input('sexo', sql.Char(1), (sexo ? String(sexo).charAt(0).toUpperCase() : null))
        .input('status', sql.VarChar(100), status)
        .query(`
                INSERT INTO ANIMAL
            (
                nome,
                rg,
                especie,
                porte,
                raca,
                idade,
                idade_detalhada,
                faixa_idade,
                sexo,
                status
            )
                OUTPUT INSERTED.*
            VALUES
                (
                    @nome,
                    @rg,
                    @tipo,
                    @porte,
                    @raca,
                    @idade,
                    @idadeDetalhada,
                    @faixaIdade,
                    @sexo,
                    @status
                )
                `);


    // Pegar o ID DO ANIMAL E COLOCAR  NA TABELA FOTO
    // ==========================================

    const idAnimal = result.recordset[0].id_animal;
    // 3 - CADASTRAR AS FOTOS
    // ==========================================

    if (req.files && req.files.length > 0) {

        for (let i = 0; i < req.files.length; i++) {
            const foto = req.files[i];
            // Caminho que será salvo no banco
            const caminhoFoto = `/img/${foto.filename}`;
            console.log("Foto:", caminhoFoto);
            await cn
                .request()
                .input("id_animal", sql.Int, idAnimal)
                .input("url_foto", sql.VarChar(255), caminhoFoto)
                .input("principal", sql.Bit, i === Number(fotoPrincipal)
                )
                .query(`
                        INSERT INTO FOTO
            (
                id_animal,
                url_foto,
                principal,
                data_cadastro
            )
        VALUES
            (
                @id_animal,
                @url_foto,
                @principal,
                GETDATE()
            )
            `);
        }
    }


    res.status(201).json({
        mensagem: 'Usuário cadastrado com sucesso!',
        usuario: result.recordset[0]
        //foto: foto.recordset[0]

    });
});

//========== CADASTRO DE VACINAS ========================
// *(ALUNA - cadastro de vacinas) Segue o mesmo esquema de "cabeçalho +
// detalhe" que o professor usou em ANIMAL + FOTO: insere o cabeçalho
// (VACINA), pega o id gerado (OUTPUT INSERTED.*, igual ao /INSERT de
// animal) e usa esse id para inserir o detalhe (LOTE_VACINA).
//
// A diferença para o animal é que o lote de vacina tem mais "pedaços"
// espalhados em tabelas que já existiam no banco, só não estavam ligadas:
//   - FABRICANTE: fabricante não é texto solto, é outra tabela. Por isso
//     aqui a gente procura o fabricante pelo nome e só cria um registro
//     novo se ainda não existir;
//   - FORNECEDOR + ENTRADA_ESTOQUE: fornecedor, data de entrada, nota
//     fiscal e valor total já tinham tabela própria no banco
//     (ENTRADA_ESTOQUE), só faltava o LOTE_VACINA apontar pra ela
//     (coluna id_entrada, adicionada em estruturabanco/AJUSTE_VACINA.sql);
//   - responsavel / valor_unitario / temperatura / local_armazenamento:
//     não tinham tabela própria que fizesse sentido usar, então viraram
//     colunas simples direto em LOTE_VACINA (mesmo script de ajuste).
//
// IMPORTANTE SOBRE O BANCO (ajustar nesta máquina):
// rodar estruturabanco/AJUSTE_VACINA.sql ANTES de testar este cadastro -
// é ele quem cria especie/tipo em VACINA e id_entrada/valor_unitario/
// responsavel/temperatura/local_armazenamento em LOTE_VACINA.
app.post("/addvacina", async (req, resp) => {
    try {
        // FAZER UM OBJETO PARA RECEBER OS REQ
        const {
            nome,
            descricao,
            especie,
            tipo,
            fabricante,
            lote,
            dataFabricacao,
            dataValidade,
            quantidadeRecebida,
            dataEntrada,
            responsavel,
            fornecedor,
            notaFiscal,
            valorUnitario,
            valorTotal,
            temperatura,
            localArmazenamento

        } = req.body;

        const cn = await conectar();

        //=========== 1) FABRICANTE: procura pelo nome, cria se não existir =====
        let id_fabricante = null;
        if (fabricante && String(fabricante).trim() !== "") {
            const achadoFab = await cn.request()
                .input("nome", sql.VarChar(100), fabricante)
                .query(`SELECT id_fabricante FROM FABRICANTE WHERE nome = @nome`);

            if (achadoFab.recordset.length > 0) {
                id_fabricante = achadoFab.recordset[0].id_fabricante;
            } else {
                const criadoFab = await cn.request()
                    .input("nome", sql.VarChar(100), fabricante)
                    .query(`INSERT INTO FABRICANTE (nome) OUTPUT INSERTED.* VALUES (@nome)`);
                id_fabricante = criadoFab.recordset[0].id_fabricante;
            }
        }

        //=========== 2) FORNECEDOR: mesma ideia do fabricante =====
        let id_fornecedor = null;
        if (fornecedor && String(fornecedor).trim() !== "") {
            const achadoForn = await cn.request()
                .input("nome", sql.VarChar(100), fornecedor)
                .query(`SELECT id_fornecedor FROM FORNECEDOR WHERE nome = @nome`);

            if (achadoForn.recordset.length > 0) {
                id_fornecedor = achadoForn.recordset[0].id_fornecedor;
            } else {
                const criadoForn = await cn.request()
                    .input("nome", sql.VarChar(100), fornecedor)
                    .query(`INSERT INTO FORNECEDOR (nome) OUTPUT INSERTED.* VALUES (@nome)`);
                id_fornecedor = criadoForn.recordset[0].id_fornecedor;
            }
        }

        //=========== 3) ENTRADA_ESTOQUE: só dá pra criar se tiver fornecedor
        // e data de entrada (são colunas NOT NULL na tabela) =====
        let id_entrada = null;
        if (id_fornecedor && dataEntrada) {
            const entrada = await cn.request()
                .input("id_fornecedor", sql.Int, id_fornecedor)
                .input("dataEntrada", sql.Date, dataEntrada)
                .input("notaFiscal", sql.VarChar(50), notaFiscal || null)
                .input("valorTotal", sql.Decimal(10, 2), Number(valorTotal) || 0)
                .query(`
                    INSERT INTO ENTRADA_ESTOQUE (id_fornecedor, data_entrada, nota_fiscal, valor_total)
                    OUTPUT INSERTED.*
                    VALUES (@id_fornecedor, @dataEntrada, @notaFiscal, @valorTotal)
                `);
            id_entrada = entrada.recordset[0].id_entrada;
        }

        //=========== 4) VACINA (cabeçalho): VACINA.nome é UNIQUE, então se a
        // vacina já existe só cadastramos um novo lote para ela =====
        let resultado = await cn.request()
            .input('nome', sql.VarChar(100), nome)
            .query(`SELECT id_vacina FROM VACINA WHERE nome = @nome`);

        if (resultado.recordset.length === 0) resultado = await cn.request()
            .input('nome', sql.VarChar(100), nome)
            .input('descricao', sql.VarChar(250), descricao)
            .input('especie', sql.VarChar(100), especie)
            .input('tipo', sql.VarChar(100), tipo)
            .query(`
          INSERT INTO VACINA(
            nome,
            descricao,
            especie,
            tipo
          )
              OUTPUT INSERTED.*
         VALUES(
            @nome,
            @descricao,
            @especie,
            @tipo
         )
        `)

       //============== 5) LOTE_VACINA (detalhe) PEGAR O ID DA VACINA ===========
       const id_v = resultado.recordset[0].id_vacina;
       // *(ALUNA) A tabela LOTE_VACINA exige quantidade_total (NOT NULL,
       // sem valor padrão) além de quantidade_disponivel. Como é a primeira
       // entrada do lote, quantidade_total e quantidade_disponivel começam
       // com o mesmo valor (nada foi usado/aplicado ainda).
       resultado = await cn.request()
       .input("id_v", sql.Int, id_v)
       .input("id_fabricante", sql.Int, id_fabricante)
       .input("id_entrada", sql.Int, id_entrada)
       .input("lote", sql.VarChar(30), lote)
       .input("dataFabricacao", sql.Date, dataFabricacao)
       .input("dataValidade", sql.Date, dataValidade)
       .input("quantidadeRecebida", sql.Int, quantidadeRecebida)
       .input("valorUnitario", sql.Decimal(10, 2), valorUnitario ? Number(valorUnitario) : null)
       .input("responsavel", sql.VarChar(100), responsavel || null)
       .input("temperatura", sql.VarChar(50), temperatura || null)
       .input("localArmazenamento", sql.VarChar(100), localArmazenamento || null)
       .query(`
         INSERT INTO LOTE_VACINA (
                    id_vacina,
                    id_fabricante,
                    id_entrada,
                    numero_lote,
                    data_fabricacao,
                    data_validade,
                    quantidade_total,
                    quantidade_disponivel,
                    valor_unitario,
                    responsavel,
                    temperatura,
                    local_armazenamento)
                OUTPUT INSERTED.*
                VALUES
                    ( @id_v,
                      @id_fabricante,
                      @id_entrada,
                      @lote,
                      @dataFabricacao,
                      @dataValidade,
                      @quantidadeRecebida,
                      @quantidadeRecebida,
                      @valorUnitario,
                      @responsavel,
                      @temperatura,
                      @localArmazenamento )

        `)




        // VER SE ESTÁ RETORNAR O DADOS CADASTRADO
        resp.status(201).json(
            {
                "MS": "OK",
                //"ID": resultado.recordset[0].id_vacina
            })

    } catch (e) {
        resp.status(500).json({ "error:": e.message });
    }

})






//========== ANIMAL: BUSCAR UM (para preencher o formulário de edição) ===
app.get("/animais/:id", async (req, resp) => {
    try {
        const id = parseInt(req.params.id);
        const cn = await conectar();

        const animal = await cn.request()
            .input("id", sql.Int, id)
            .query(`SELECT id_animal AS id, nome, rg, especie AS tipo, porte,
                           raca, idade, idade_detalhada, faixa_idade, sexo, status
                    FROM ANIMAL WHERE id_animal = @id`);

        if (animal.recordset.length === 0) {
            return resp.status(404).json({ erro: "Animal não encontrado" });
        }

        const fotos = await cn.request()
            .input("id", sql.Int, id)
            .query(`SELECT url_foto, principal FROM FOTO
                    WHERE id_animal = @id ORDER BY id_foto`);

        resp.json({ ...animal.recordset[0], fotos: fotos.recordset });
    } catch (e) {
        resp.status(500).json({ erro: e.message });
    }
});

//========== ANIMAL: ALTERAR (UPDATE) ====================================
// Mesmo formulário do cadastro (FormData + multer). Se vierem fotos novas,
// elas SUBSTITUEM as antigas; se não vier nenhuma, as fotos continuam.
app.put("/animais/:id", upload.array("fotos", 3), async (req, resp) => {
    try {
        const id = parseInt(req.params.id);
        const { nome, rg, tipo, porte, raca, idade, faixaIdade, sexo, status, fotoPrincipal } = req.body;
        const cn = await conectar();

        const atual = await cn.request().input("id", sql.Int, id)
            .query("SELECT status FROM ANIMAL WHERE id_animal = @id");
        if (atual.recordset.length === 0) {
            return resp.status(404).json({ erro: "Animal não encontrado" });
        }
        if (atual.recordset[0].status === "falecido") {
            return resp.status(403).json({ erro: "Animal falecido não pode ser alterado" });
        }

        await cn.request()
            .input("id", sql.Int, id)
            .input("nome", sql.NVarChar(100), nome)
            .input("rg", sql.NVarChar(100), rg)
            .input("tipo", sql.NVarChar(100), tipo)
            .input("porte", sql.NVarChar(100), porte)
            .input("raca", sql.NVarChar(100), raca)
            .input("idade", sql.Int, idadeEmAnos(idade))
            .input("idadeDetalhada", sql.NVarChar(50), idade ? String(idade).slice(0, 50) : null)
            .input("faixaIdade", sql.NVarChar(40), faixaIdade || null)
            .input("sexo", sql.Char(1), (sexo ? String(sexo).charAt(0).toUpperCase() : null))
            .input("status", sql.NVarChar(100), status)
            .query(`UPDATE ANIMAL
                    SET nome = @nome, rg = @rg, especie = @tipo, porte = @porte,
                        raca = @raca, idade = @idade, idade_detalhada = @idadeDetalhada,
                        faixa_idade = @faixaIdade, sexo = @sexo, status = @status
                    WHERE id_animal = @id`);

        if (req.files && req.files.length > 0) {
            await cn.request().input("id", sql.Int, id)
                .query("DELETE FROM FOTO WHERE id_animal = @id");

            for (let i = 0; i < req.files.length; i++) {
                await cn.request()
                    .input("id_animal", sql.Int, id)
                    .input("url_foto", sql.VarChar(255), `/img/${req.files[i].filename}`)
                    .input("principal", sql.Bit, i === Number(fotoPrincipal))
                    .query(`INSERT INTO FOTO (id_animal, url_foto, principal, data_cadastro)
                            VALUES (@id_animal, @url_foto, @principal, GETDATE())`);
            }
        }

        resp.json({ mensagem: "Animal atualizado com sucesso!" });
    } catch (e) {
        console.error(e);
        resp.status(500).json({ erro: e.message });
    }
});

//========== ANIMAL: EXCLUIR (DELETE) ====================================
// A FOTO depende do animal, então apaga primeiro as fotos e depois o animal.
// Se o animal já tem prontuário/adoção/etc., o banco recusa (erro 547) e
// devolvemos 409 explicando.
app.delete("/animais/:id", async (req, resp) => {
    const id = parseInt(req.params.id);
    const cn = await conectar();
    const tr = new sql.Transaction(cn);
    try {
        await tr.begin();
        await new sql.Request(tr).input("id", sql.Int, id)
            .query("DELETE FROM FOTO WHERE id_animal = @id");
        const r = await new sql.Request(tr).input("id", sql.Int, id)
            .query("DELETE FROM ANIMAL OUTPUT DELETED.id_animal WHERE id_animal = @id");
        if (r.recordset.length === 0) {
            await tr.rollback();
            return resp.status(404).json({ erro: "Animal não encontrado" });
        }
        await tr.commit();
        resp.json({ mensagem: "Animal excluído com sucesso!" });
    } catch (e) {
        try { await tr.rollback(); } catch (_) { }
        if (e.number === 547) {
            return resp.status(409).json({ erro: "Este animal possui prontuário, adoção ou outros registros vinculados e não pode ser excluído." });
        }
        console.error(e);
        resp.status(500).json({ erro: e.message });
    }
});

//========== VACINA: ALTERAR (UPDATE) ====================================
// Altera o cabeçalho (VACINA) e o lote mais recente (LOTE_VACINA), que é o
// mesmo lote que a lista mostra.
async function achaOuCria(cn, tabela, colunaId, nome) {
    if (!nome || String(nome).trim() === "") return null;
    const achou = await cn.request().input("nome", sql.NVarChar(100), nome)
        .query(`SELECT ${colunaId} AS id FROM ${tabela} WHERE nome = @nome`);
    if (achou.recordset.length > 0) return achou.recordset[0].id;
    const criou = await cn.request().input("nome", sql.NVarChar(100), nome)
        .query(`INSERT INTO ${tabela} (nome) OUTPUT INSERTED.${colunaId} AS id VALUES (@nome)`);
    return criou.recordset[0].id;
}

app.put("/vacinas/:id", async (req, resp) => {
    try {
        const id = parseInt(req.params.id);
        const {
            nome, descricao, especie, tipo, fabricante, lote, dataFabricacao,
            dataValidade, quantidadeRecebida, dataEntrada, responsavel,
            fornecedor, notaFiscal, valorUnitario, valorTotal, temperatura,
            localArmazenamento
        } = req.body;

        const cn = await conectar();

        const lt = await cn.request().input("id", sql.Int, id)
            .query(`SELECT TOP 1 id_lote_vacina, id_entrada FROM LOTE_VACINA
                    WHERE id_vacina = @id ORDER BY id_lote_vacina DESC`);
        if (lt.recordset.length === 0) {
            return resp.status(404).json({ erro: "Vacina não encontrada" });
        }
        const { id_lote_vacina } = lt.recordset[0];
        let id_entrada = lt.recordset[0].id_entrada;

        const id_fabricante = await achaOuCria(cn, "FABRICANTE", "id_fabricante", fabricante);
        const id_fornecedor = await achaOuCria(cn, "FORNECEDOR", "id_fornecedor", fornecedor);

        // ENTRADA_ESTOQUE: atualiza se já existe, cria se ainda não existia
        if (id_fornecedor && dataEntrada) {
            const req2 = cn.request()
                .input("id_entrada", sql.Int, id_entrada)
                .input("id_fornecedor", sql.Int, id_fornecedor)
                .input("dataEntrada", sql.Date, dataEntrada)
                .input("notaFiscal", sql.VarChar(50), notaFiscal || null)
                .input("valorTotal", sql.Decimal(10, 2), Number(valorTotal) || 0);
            if (id_entrada) {
                await req2.query(`UPDATE ENTRADA_ESTOQUE
                    SET id_fornecedor = @id_fornecedor, data_entrada = @dataEntrada,
                        nota_fiscal = @notaFiscal, valor_total = @valorTotal
                    WHERE id_entrada = @id_entrada`);
            } else {
                const nova = await req2.query(`INSERT INTO ENTRADA_ESTOQUE
                    (id_fornecedor, data_entrada, nota_fiscal, valor_total)
                    OUTPUT INSERTED.id_entrada
                    VALUES (@id_fornecedor, @dataEntrada, @notaFiscal, @valorTotal)`);
                id_entrada = nova.recordset[0].id_entrada;
            }
        }

        await cn.request()
            .input("id", sql.Int, id)
            .input("nome", sql.NVarChar(100), nome)
            .input("descricao", sql.NVarChar(250), descricao)
            .input("especie", sql.NVarChar(100), especie)
            .input("tipo", sql.NVarChar(100), tipo)
            .query(`UPDATE VACINA SET nome = @nome, descricao = @descricao,
                           especie = @especie, tipo = @tipo
                    WHERE id_vacina = @id`);

        // Ao mudar a quantidade recebida, a disponível acompanha a diferença
        // (o que já foi aplicado continua descontado).
        await cn.request()
            .input("id_lote", sql.Int, id_lote_vacina)
            .input("id_fabricante", sql.Int, id_fabricante)
            .input("id_entrada", sql.Int, id_entrada)
            .input("lote", sql.VarChar(30), lote)
            .input("dataFabricacao", sql.Date, dataFabricacao)
            .input("dataValidade", sql.Date, dataValidade)
            .input("quantidade", sql.Int, quantidadeRecebida)
            .input("valorUnitario", sql.Decimal(10, 2), valorUnitario ? Number(valorUnitario) : null)
            .input("responsavel", sql.NVarChar(100), responsavel || null)
            .input("temperatura", sql.NVarChar(50), temperatura || null)
            .input("localArmazenamento", sql.NVarChar(100), localArmazenamento || null)
            .query(`UPDATE LOTE_VACINA SET
                        id_fabricante = @id_fabricante,
                        id_entrada = @id_entrada,
                        numero_lote = @lote,
                        data_fabricacao = @dataFabricacao,
                        data_validade = @dataValidade,
                        quantidade_disponivel = CASE WHEN quantidade_disponivel + (@quantidade - quantidade_total) < 0
                                                     THEN 0
                                                     ELSE quantidade_disponivel + (@quantidade - quantidade_total) END,
                        quantidade_total = @quantidade,
                        valor_unitario = @valorUnitario,
                        responsavel = @responsavel,
                        temperatura = @temperatura,
                        local_armazenamento = @localArmazenamento
                    WHERE id_lote_vacina = @id_lote`);

        resp.json({ mensagem: "Vacina atualizada com sucesso!" });
    } catch (e) {
        console.error(e);
        // 2627/2601 = nome de vacina repetido (VACINA.nome é UNIQUE)
        if (e.number === 2627 || e.number === 2601) {
            return resp.status(409).json({ erro: "Já existe outra vacina com esse nome." });
        }
        resp.status(500).json({ erro: e.message });
    }
});

//========== VACINA: EXCLUIR (DELETE) ====================================
// Apaga os lotes da vacina e depois a vacina. Se algum lote já foi usado em
// uma vacinação (VACINA_APLICADA), o banco recusa e devolvemos 409.
app.delete("/vacinas/:id", async (req, resp) => {
    const id = parseInt(req.params.id);
    const cn = await conectar();
    const tr = new sql.Transaction(cn);
    try {
        await tr.begin();
        await new sql.Request(tr).input("id", sql.Int, id)
            .query("DELETE FROM LOTE_VACINA WHERE id_vacina = @id");
        const r = await new sql.Request(tr).input("id", sql.Int, id)
            .query("DELETE FROM VACINA OUTPUT DELETED.id_vacina WHERE id_vacina = @id");
        if (r.recordset.length === 0) {
            await tr.rollback();
            return resp.status(404).json({ erro: "Vacina não encontrada" });
        }
        await tr.commit();
        resp.json({ mensagem: "Vacina excluída com sucesso!" });
    } catch (e) {
        try { await tr.rollback(); } catch (_) { }
        if (e.number === 547) {
            return resp.status(409).json({ erro: "Esta vacina já foi aplicada em animais e não pode ser excluída." });
        }
        console.error(e);
        resp.status(500).json({ erro: e.message });
    }
});


// DELETE
app.delete('/usuarios/:id', async (req, res) => {

    try {

        // Pegar o ID da URL
        const id = parseInt(req.params.id);

        // Conectar ao SQL Server
        const cn = await conectar();

        // Executar DELETE
        const result = await cn
            .request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM USUARIO
                OUTPUT DELETED.*
            WHERE id_usuario = @id
                `);

        // Verificar se encontrou o usuário
        if (result.recordset.length === 0) {

            return res.status(404).json({
                mensagem: 'Usuário não encontrado'
            });

        }

        // Retornar confirmação
        res.status(200).json({
            mensagem: 'Usuário excluído com sucesso!',
            usuario: result.recordset[0]
        });

    } catch (erro) {

        console.error('Erro:', erro);

        res.status(500).json({
            erro: 'Erro ao excluir usuário',
            detalhe: erro.message
        });

    }

});


// ALTERAR
app.put('/usuarios/:id', async (req, res) => {

    // testa a os dados indo -----------

    // console.log("ID:", req.params.id);
    // console.log("BODY:", req.body);

    // res.json({
    //     id: req.params.id,
    //     dados: req.body
    // });
    //-----------------------------------

    try {

        // Pegar o ID da URL
        const id = parseInt(req.params.id);
        console.log(req.body);
        // Pegar os dados do corpo da requisição
        const {
            nome,
            email,
            telefone,
            senha,
            cpf_cnpj,
            tipo_pessoa,
            data_nasc,
            status } = req.body;



        // //     // Atualizar usuário
        const cn = await conectar();
        const result = await cn
            .request()
            .input('id', sql.Int, id)
            .input('nome', sql.VarChar(100), nome)
            .input('email', sql.VarChar(100), email)
            .input('telefone', sql.VarChar(20), telefone)
            .input('senha', sql.VarChar(255), senha)
            .input('cpf_cnpj', sql.VarChar(18), cpf_cnpj)
            .input('tipo_pessoa', sql.Char(1), tipo_pessoa)
            .input('data_nasc', sql.Date, data_nasc)
            .input('status', sql.Char(1), status)
            .query(`
                UPDATE USUARIO
        SET
        nome = @nome,
            email = @email,
            telefone = @telefone,
            senha = @senha,
            cpf_cnpj = @cpf_cnpj,
            tipo_pessoa = @tipo_pessoa,
            data_nasc = @data_nasc,
            status = @status
                OUTPUT INSERTED.*
            WHERE id_usuario = @id
                `);
        // Verificar se o usuário existe
        if (result.recordset.length === 0) {

            return res.status(404).json({
                mensagem: 'Usuário não encontrado'
            });

        }

        // Retornar usuário atualizado
        res.status(200).json({
            mensagem: 'Usuário atualizado com sucesso!',
            usuario: result.recordset[0]
        });

    } catch (erro) {

        console.error('Erro:', erro);

        res.status(500).json({
            erro: 'Erro ao atualizar usuário',
            detalhe: erro.message
        });

    }

});




// Local: sobe o servidor normalmente. Na Vercel: exporta o app (ela cuida da porta).
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Servidor http://localhost:${port}`);
    });
}

module.exports = app; 