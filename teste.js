const mysql = require('mysql2');
const readline = require('readline-sync');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'laboratorio_avaliacao'
});

function menu() {
    console.log('=== Menu ===');
    console.log('1. Cadastrar computador');
    console.log('2. Listar computadores');
    console.log('3. atualizar computador');
    console.log('4. Excluir computador');
    console.log('5. Sair');
    return readline.question('Escolha uma opção: ');
}

async function cadastrar() {
    const patrimonio = readline.question('Digite o patrimônio do computador: ');
    const localizacao = readline.question('Digite a localização do computador: ');
    const responsavel = readline.question('Digite o responsável pelo computador: ');
    const status = readline.question('Digite o status do computador: ');

    try {
        await connection.promise().execute(
            'INSERT INTO computadores (patrimonio, localizacao, responsavel, status) VALUES (?, ?, ?, ?)',
            [patrimonio, localizacao, responsavel, status]
        );
        console.log("\ncomputador cadastrado com sucesso!");
    } catch (erro) {
        console.log("\nErro ao cadastrar computador:", erro.message);
     }
 }

 async function listar() {
    try {
        const [rows] = await connection.promise().execute('SELECT * FROM computadores');
        console.log("\nComputadores cadastrados:");
        rows.forEach(row => {
            console.log(`Patrimônio: ${row.patrimonio}, Localização: ${row.localizacao}, Responsável: ${row.responsavel}, Status: ${row.status}`);
        });
    } catch (erro) {
        console.log("\nErro ao listar computadores:", erro.message);
    }
 }

 async function atualizar() {
     console.log("\n===== ATUALIZAR COMPUTADOR =====");
 
     const patrimonio = readline.question("Digite o patrimônio do computador: ");
 
     try {
         const sqlConsulta = "SELECT * FROM computadores WHERE patrimonio = ?";
         const [computadores] = await connection.promise().execute(sqlConsulta, [patrimonio]);
 
         if (computadores.length === 0) {
             console.log("\nComputador não encontrado.");
             return;
         }
 
         const computador = computadores[0];
 
         console.log("\nComputador encontrado:");
         console.log(`Patrimônio: ${computador.patrimonio}`);
         console.log(`Localização: ${computador.localizacao}`);
         console.log(`Responsável: ${computador.responsavel}`);
         console.log(`Status: ${computador.status}`);
 
         const localizacao = readline.question("\nNova localização: ");
         const responsavel = readline.question("Novo responsável: ");
         const status = readline.question("Novo status: ");
 
         const sqlUpdate = `
             UPDATE computadores
             SET localizacao = ?,
                 responsavel = ?,
                 status = ?
             WHERE patrimonio = ?
         `;
 
         const [resultado] = await connection.promise().execute(sqlUpdate, [
             localizacao,
             responsavel,
             status,
             patrimonio
         ]);
 
         if (resultado.affectedRows > 0) {
             console.log("\nComputador atualizado com sucesso!");
         } else {
             console.log("\nNão foi possível atualizar o computador.");
         }
 
     } catch (erro) {
         console.log("Erro ao atualizar computador:", erro.message);
     }
 }

async function excluir() {
    const patrimonio = readline.question('Digite o patrimônio do computador que deseja excluir: ');

    try {
        const [result] = await connection.promise().execute(
            'DELETE FROM computadores WHERE patrimonio = ?',
            [patrimonio]
        );
        console.log("\ncomputador excluído com sucesso!");
    } catch (erro) {
        console.log("\nErro ao excluir computador:", erro.message);
    }
}async function sair() {
    console.log("\nSaindo do programa...");
    connection.end();
    process.exit(0);
}
