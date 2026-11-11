# Servidor (API) do Bem-Estar Animal

API em Express que conecta o site ao banco de dados (Azure SQL).
As credenciais do banco ficam nas variaveis de ambiente da Vercel (DB_USER, DB_PASSWORD, DB_SERVER, DB_PORT, DB_NAME, DB_ENCRYPT, DB_TRUST_CERT).

As fotos dos animais enviadas pelo Admin ficam no **Vercel Blob**. Para isso, crie um Blob Store (acesso publico) em *Storage* e conecte ao projeto do servidor: a variavel `BLOB_READ_WRITE_TOKEN` e criada automaticamente. Sem ela, a foto vai para uma pasta temporaria e se perde.
