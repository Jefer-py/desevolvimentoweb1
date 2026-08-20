const mysql = require('mysql');
const readline = require('readline-sync');

//connection com o mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'escola'
});

//função para criar a tabela de aluno
function criarTabelaAluno() {

    const nome = readline.question("Digite o nome do aluno: ");
    const email = readline.question("Digite o email do aluno: ");

    const sql = `INSERT INTO aluno (nome, email) VALUES ('?, ?')`;

    conection.query(insert, [nome, email], function (erro) {
       
        if (erro) {
            console.error("Erro ao cadastrar.", erro);
        } else {
            console.log("Aluno cadastrado com sucesso!");
        }
        // menu();
    })
}
cadastrarAluno();