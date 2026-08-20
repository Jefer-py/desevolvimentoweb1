const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'disciplinas'
});

// Cadastrar Banco de Dados
conexao.query(
    "INSERT INTO disciplinas (nome, professor, aulas_semanais) VALUES (?, ?, ?)",
    ["Banco de Dados", "Carlos", 4],
    (erro) => {
        if (erro) {
            console.log(erro);
            return;
        }

        // Cadastrar Programação
        conexao.query(
            "INSERT INTO disciplinas (nome, professor, aulas_semanais) VALUES (?, ?, ?)",
            ["Programação", "Fernanda", 5],
            (erro) => {
                if (erro) {
                    console.log(erro);
                    return;
                }

                // Cadastrar Análise de Dados
                conexao.query(
                    "INSERT INTO disciplinas (nome, professor, aulas_semanais) VALUES (?, ?, ?)",
                    ["Análise de Dados", "Maria", 3],
                    (erro) => {
                        if (erro) {
                            console.log(erro);
                            return;
                        }

                        console.log("Disciplinas cadastradas!");

                        // Excluir disciplina de ID 2
                        conexao.query(
                            "DELETE FROM disciplinas WHERE id = ?",
                            [2],
                            (erro, resultado) => {
                                if (erro) {
                                    console.log(erro);
                                    return;
                                }

                                if (resultado.affectedRows > 0) {
                                    console.log("Disciplina de ID 2 excluída!");
                                }

                                // Cadastrar nova disciplina
                                conexao.query(
                                    "INSERT INTO disciplinas (nome, professor, aulas_semanais) VALUES (?, ?, ?)",
                                    ["Matemática", "João", 4],
                                    (erro) => {
                                        if (erro) {
                                            console.log(erro);
                                            return;
                                        }

                                        console.log("Nova disciplina cadastrada!");

                                        // Consultar todos os registros
                                        conexao.query(
                                            "SELECT * FROM disciplinas",
                                            (erro, resultados) => {
                                                if (erro) {
                                                    console.log(erro);
                                                    return;
                                                }

                                                console.log(resultados);

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