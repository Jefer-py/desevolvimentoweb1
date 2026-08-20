const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'clientes'
});

conexao.query(
    "INSERT INTO clientes (nome, telefone) VALUES (?, ?)",
    ["Ana Souza", "47999990000"],
    (erro) => {
        if (erro) {
            console.log(erro);
            return;
        }

        conexao.query(
            "INSERT INTO clientes (nome, telefone) VALUES (?, ?)",
            ["Pedro Lima", "47988880000"],
            (erro) => {
                if (erro) {
                    console.log(erro);
                    return;
                }

                conexao.query(
                    "INSERT INTO clientes (nome, telefone) VALUES (?, ?)",
                    ["Juliana Costa", "47977770000"],
                    (erro) => {
                        if (erro) {
                            console.log(erro);
                            return;
                        }

                        console.log("Clientes cadastrados!");

                        // Procurar Pedro Lima
                        conexao.query(
                            "SELECT * FROM clientes WHERE nome = ?",
                            ["Pedro Lima"],
                            (erro, resultados) => {
                                if (erro) {
                                    console.log(erro);
                                    return;
                                }

                                if (resultados.length === 0) {
                                    console.log("Cliente não encontrado.");
                                    return;
                                }

                                const idPedro = resultados[0].id;

                                console.log("ID do Pedro:", idPedro);

                                // Excluir Pedro
                                conexao.query(
                                    "DELETE FROM clientes WHERE id = ?",
                                    [idPedro],
                                    (erro, resultado) => {
                                        if (erro) {
                                            console.log(erro);
                                            return;
                                        }

                                        if (resultado.affectedRows === 0) {
                                            console.log("Cliente não encontrado.");
                                            return;
                                        }

                                        console.log("Pedro excluído!");

                                        // Tentar excluir novamente
                                        conexao.query(
                                            "DELETE FROM clientes WHERE id = ?",
                                            [idPedro],
                                            (erro, resultado) => {
                                                if (erro) {
                                                    console.log(erro);
                                                    return;
                                                }

                                                if (resultado.affectedRows === 0) {
                                                    console.log("Cliente não encontrado.");
                                                }

                                                conexao.end();
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    }
);