const mysql = require("mysql2");
 
const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "SUA_SENHA",
    database: "escola"
});
 
// Novos dados
const nome = "Maria da Silva";
const email = "maria.silva@email.com";
 
// ID do aluno que será atualizado
const id = 1;
 
const update = `
    UPDATE alunos
    SET nome = ?, email = ?
    WHERE id = ?
`;
conexao.query(update, [nome, email, id], function (erro, resultado) {
 
    if (erro) {
        console.log("Erro ao atualizar o aluno.");
        console.log(erro);
    } else if (resultado.affectedRows === 0) {
        console.log("Aluno não encontrado.");
    } else {
        console.log("Aluno atualizado com sucesso!");
    }
 
    conexao.end();
});