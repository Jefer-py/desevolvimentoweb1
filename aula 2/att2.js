/*const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'biblioteca'
});


const nome = "Dom Casmurro";
const titulo = " — Machado de Assis";
const insert = "INSERT INTO livros (titulo, autor) VALUES (?, ?)";

conexao.query(insert, [titulo, autor], function (erro) {
        if (erro) {
            console.log(erro);
        } else {
            console.log("Livro cadastrado!");
        }
         conexao.end();


    });

    */const id = 2;
    const deletar = "DELETE FROM livros WHERE id = 2";
    conexao.query(deletar, [id], (erro, resultado) => {
        if (erro) {
            console.log(erro);
        } else if (resultado.affectedRows === 0) {
            console.log("Livro não encontrado!");
        } else {
            console.log("Livro excluído!");
        }
    });
