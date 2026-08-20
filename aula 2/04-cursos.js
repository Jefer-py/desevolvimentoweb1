const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'cursos'
});

conexao.query(
    "INSERT INTO cursos (nome, carga_horaria) VALUES (?, ?)",
    ["Desenvolvimento de Sistemas", 1200],
    (erro) => {
        if (erro) {
            console.log(erro);
            return;
        }

        conexao.query(
            "INSERT INTO cursos (nome, carga_horaria) VALUES (?, ?)",
            ["Informática", 1000],
            (erro) => {
                if (erro) {
                    console.log(erro);
                    return;
                }

                conexao.query(
                    "INSERT INTO cursos (nome, carga_horaria) VALUES (?, ?)",
                    ["Administração", 800],
                    (erro) => {
                        if (erro) {
                            console.log(erro);
                            return;
                        }

                        console.log("Cursos cadastrados!");

                        // Excluir curso de ID 3
                        conexao.query(
                            "DELETE FROM cursos WHERE id = ?",
                            [3],
                            (erro) => {
                                if (erro) {
                                    console.log(erro);
                                    return;
                                }

                                console.log("Curso de ID 3 excluído!");

                                // Cadastrar novo curso
                                conexao.query(
                                    "INSERT INTO cursos (nome, carga_horaria) VALUES (?, ?)",
                                    ["Programação", 600],
                                    (erro) => {
                                        if (erro) {
                                            console.log(erro);
                                            return;
                                        }

                                        console.log("Novo curso cadastrado!");

                                        // Consultar
                                        conexao.query(
                                            "SELECT * FROM cursos",
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