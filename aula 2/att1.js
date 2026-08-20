const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'ecommerce'
});


/*const nome = "mouse";
const insert = "INSERT INTO produtos (nome, preco) VALUES (?, ?)";

conexao.query(insert, [nome, preco], function (erro) {
        if (erro) {
            console.log(erro);
        } else {
            console.log("Teclado cadastrado!");
        }
         conexao.end();


    });

    */const id = 1;
    const deletar = "DELETE FROM produtos WHERE id = ?";
    conexao.query(deletar, [id], (erro, resultado) => {
        if (erro) {
            console.log(erro);
        } else if (resultado.affectedRows === 0) {
            console.log("Produto não encontrado!");
        } else {
            console.log("Produto excluído!");
        }
    });
