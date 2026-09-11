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
    const patrimonio = readline.question('Digite o patrimônio do computador que deseja atualizar: ');
    const localizacao = readline.question('Digite a nova localização do computador: ');
    const responsavel = readline.question('Digite o novo responsável pelo computador: ');
    const status = readline.question('Digite o novo status do computador: ');

    try {
        const [result] = await connection.promise().execute(
            'UPDATE computadores SET localizacao = ?, responsavel = ?, status = ? WHERE patrimonio = ?',
            [localizacao, responsavel, status, patrimonio]
        );
        console.log("\ncomputador atualizado com sucesso!");
    } catch (erro) {
        console.log("\nErro ao atualizar computador:", erro.message);
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
