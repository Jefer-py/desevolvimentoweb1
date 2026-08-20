const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'funcionarios'
});

// Cadastrar João
conexao.query(
    "INSERT INTO funcionarios (nome, cargo, salario) VALUES (?, ?, ?)",
    ["João", "Vendedor", 2500],
    (erro) => {
        if (erro) {
            console.log(erro);
            return;
        }

        // Cadastrar Mariana
        conexao.query(
            "INSERT INTO funcionarios (nome, cargo, salario) VALUES (?, ?, ?)",
            ["Mariana", "Gerente", 4500],
            (erro) => {
                if (erro) {
                    console.log(erro);
                    return;
                }

                // Cadastrar Lucas
                conexao.query(
                    "INSERT INTO funcionarios (nome, cargo, salario) VALUES (?, ?, ?)",
                    ["Lucas", "Atendente", 2200],
                    (erro) => {
                        if (erro) {
                            console.log(erro);
                            return;
                        }

                        console.log("Funcionários cadastrados!");

                        // Excluir funcionário de ID 3
                        conexao.query(
                            "DELETE FROM funcionarios WHERE id = ?",
                            [3],
                            (erro, resultado) => {
                                if (erro) {
                                    console.log(erro);
                                    return;
                                }

                                if (resultado.affectedRows > 0) {
                                    console.log("Funcionário de ID 3 excluído!");
                                }

                                // Tentar excluir funcionário de ID 50
                                conexao.query(
                                    "DELETE FROM funcionarios WHERE id = ?",
                                    [50],
                                    (erro, resultado) => {
                                        if (erro) {
                                            console.log(erro);
                                            return;
                                        }

                                        if (resultado.affectedRows === 0) {
                                            console.log("Funcionário não encontrado.");
                                        }

                                        // Cadastrar novo funcionário
                                        conexao.query(
                                            "INSERT INTO funcionarios (nome, cargo, salario) VALUES (?, ?, ?)",
                                            ["Carlos", "Programador", 3500],
                                            (erro) => {
                                                if (erro) {
                                                    console.log(erro);
                                                    return;
                                                }

                                                console.log("Novo funcionário cadastrado!");

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