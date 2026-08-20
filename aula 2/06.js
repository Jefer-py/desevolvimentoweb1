const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'filmes'
});

// Cadastrar Interestelar
conexao.query(
    "INSERT INTO filmes (titulo, ano) VALUES (?, ?)",
    ["Interestelar", 2014],
    (erro) => {
        if (erro) {
            console.log(erro);
            return;
        }

        // Cadastrar Avatar
        conexao.query(
            "INSERT INTO filmes (titulo, ano) VALUES (?, ?)",
            ["Avatar", 2009],
            (erro) => {
                if (erro) {
                    console.log(erro);
                    return;
                }

                // Cadastrar Toy Story
                conexao.query(
                    "INSERT INTO filmes (titulo, ano) VALUES (?, ?)",
                    ["Toy Story", 1995],
                    (erro) => {
                        if (erro) {
                            console.log(erro);
                            return;
                        }

                        console.log("Filmes cadastrados!");

                        // Procurar o Avatar e descobrir o ID
                        conexao.query(
                            "SELECT * FROM filmes WHERE titulo = ?",
                            ["Avatar"],
                            (erro, resultados) => {
                                if (erro) {
                                    console.log(erro);
                                    return;
                                }

                                const idAvatar = resultados[0].id;

                                console.log("ID do Avatar:", idAvatar);

                                // Excluir o Avatar
                                conexao.query(
                                    "DELETE FROM filmes WHERE id = ?",
                                    [idAvatar],
                                    (erro) => {
                                        if (erro) {
                                            console.log(erro);
                                            return;
                                        }

                                        console.log("Avatar excluído!");

                                        // Cadastrar outro filme
                                        conexao.query(
                                            "INSERT INTO filmes (titulo, ano) VALUES (?, ?)",
                                            ["Vingadores", 2012],
                                            (erro) => {
                                                if (erro) {
                                                    console.log(erro);
                                                    return;
                                                }

                                                console.log("Novo filme cadastrado!");

                                                // Consultar todos os filmes
                                                conexao.query(
                                                    "SELECT * FROM filmes",
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
    }
);
