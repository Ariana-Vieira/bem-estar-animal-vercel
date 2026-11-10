// importar o módulo do SQL Server
//
// *(conexão com o banco, usada tanto por animais quanto por vacinas)
// ATENÇÃO: este arquivo é compartilhado por TUDO (cadastro de animais e
// cadastro de vacinas usam a mesma conexão). Se mexer aqui, mexe nos dois.
//
// O professor usava "mssql/msnodesqlv8" (driver ODBC) com login do Windows
// (trustedConnection). Nesta máquina a conexão é por usuário/senha do
// próprio SQL Server (sa / P@ssw0rd em localhost\SQLEXPRESS, porta 1433),
// então trocamos para o driver padrão "mssql", que não depende de
// nenhum driver ODBC instalado e já suporta usuário/senha nativamente.
//
// const sql = require("mssql/msnodesqlv8"); // *(driver antigo - login do Windows via ODBC, usado pelo professor)
const sql = require("mssql");

require("dotenv").config();

// Conexão configurável por .env (Azure SQL na nuvem). Sem .env, cai no
// SQL Server local de antes (sa / localhost).
const database = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'P@ssw0rd',
    server: process.env.DB_SERVER || 'localhost',
    port: Number(process.env.DB_PORT || 1433),
    database: process.env.DB_NAME || 'GESTAO_ANIMAL',
    connectionTimeout: 60000, // banco serverless pode demorar a "acordar"
    options: {
        encrypt: process.env.DB_ENCRYPT ? process.env.DB_ENCRYPT === 'true' : true,
        trustServerCertificate: process.env.DB_TRUST_CERT ? process.env.DB_TRUST_CERT === 'true' : true
    }
}

async function conectar() {

    try {

        const db = await sql.connect(database);
        console.log("✅ SQL Server conectado!");
        console.log("📊 Banco: GESTAO_ANIMAL");
        return db;

    } catch (error) {

        console.error("❌ Erro ao conectar:");
        console.error(error.message);
        // *(ALUNA) Era "throw erro" (variável que não existe) - corrigido
        // para "throw error", que é o erro realmente capturado no catch.
        throw error;

    }
}

module.exports = {sql,conectar };
