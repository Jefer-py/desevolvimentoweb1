const mysql = require("mysql2/promise");
const readline = require("readline-sync");

const conexao = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "atividade4"
});

async function cadastrar() {
    console.log("\n===== CADASTRO DE FILMES =====");

    const nome = readline.question("Nome do filme: ");

    const sql = `
        INSERT INTO filmes  
        (nome,genero)
        VALUES (?, ?)
    `;

    if (nome.trim() === "") {
        console.log("\nNome do filme é obrigatório.");
        return;
    }

    const genero = readline.question("Gênero do filme: ");

    if (genero.trim() === "") {
        console.log("\nGênero do filme é obrigatório.");
        return;
    }

    try {
        await conexao.execute(sql, [
            nome,
            genero
        ]);

        console.log("\nFilme cadastrado com sucesso!");
    } catch (erro) {
        console.log("\nErro ao cadastrar filme:", erro.message);
    }
}

async function listar() {
    const sql = "SELECT * FROM filmes";

    try {
        const [filmes] = await conexao.execute(sql);

        if (filmes.length === 0) {
            console.log("\nNenhum filme cadastrado.");
            return;
        }

        console.log("\n===== LISTA DE FILMES =====");

        filmes.forEach((filme) => {
            console.log(
                `${filme.id} - ${filme.nome} - ${filme.genero}`
            );
        });
    } catch (erro) {
        console.log("\nErro ao listar filmes:", erro.message);
    }
}


async function editar() {
    console.log("\n===== EDITAR FILME =====");

    const id = readline.questionInt("Digite o ID do filme: ");

    try {
        const sqlConsulta = "SELECT * FROM filmes WHERE id = ?";
        const [registros] = await conexao.execute(sqlConsulta, [id]);

        if (registros.length === 0) {
            console.log("\nFilme não encontrado.");
            return;
        }

        const registro = registros[0];

        console.log("\nRegistro encontrado:");
        console.log(`Nome do filme atual: ${registro.nome}`);
        console.log(`Gênero do filme atual: ${registro.genero}`);

        const nome = readline.question("\nNovo nome: ");
        const genero = readline.question("Novo genero: ");

        if (nome.trim() === "" || genero.trim() === "") {
            console.log("\nOs campos são obrigatórios.");
            return;
        }

        const sqlUpdate = `
            UPDATE filmes
            SET nome = ?,
                genero = ?
            WHERE id = ?
        `;

        const [resultado] = await conexao.execute(sqlUpdate, [
            nome,
            genero,
            id
        ]);

        if (resultado.affectedRows > 0) {
            console.log("\nFilme atualizado com sucesso!");
        } else {
            console.log("\nNão foi possível atualizar o filme.");
        }

    } catch (erro) {
        console.log("\nErro ao editar filme:", erro.message);
    }
}

async function excluir() {
    const id = readline.questionInt("\nDigite o ID do filme: ");

    try {
        const sqlConsulta = "SELECT * FROM filmes WHERE id = ?";
        const [filmes] = await conexao.execute(sqlConsulta, [id]);

        if (filmes.length === 0) {
            console.log("\nFilme não encontrado.");
            return;
        }

        const filme = filmes[0];

        console.log("\n===== REGISTRO ENCONTRADO =====");
        console.log(`Nome: ${filme.nome}`);
        console.log(`Gênero: ${filme.genero}`);

        const confirmacao = readline
            .question("\nDeseja excluir? (S/N): ")
            .toUpperCase();

        if (confirmacao !== "S") {
            console.log("\nExclusão cancelada.");
            return;
        }

        const sqlDelete = "DELETE FROM filmes WHERE id = ?";
        const [resultado] = await conexao.execute(sqlDelete, [id]);

        if (resultado.affectedRows > 0) {
            console.log("\nFilme excluído com sucesso!");
        } else {
            console.log("\nNão foi possível excluir o filme.");
        }
    } catch (erro) {
        console.log("\nErro ao excluir filme:", erro.message);
    }
}

async function menu() {
    let opcao;

    do {
        console.log(`
===== FILMES =====

1 - Cadastrar filme
2 - Listar filmes
3 - Excluir filme

4 - Editar filme0 - Sair
`);

        opcao = readline.question("Escolha uma opção: ");

        switch (opcao) {
            case "1":
                await cadastrar();
                break;

            case "2":
                await listar();
                break;

            case "3":
                await excluir();
                break;

            case "4":
                await editar();
                break;

            case "0":
                console.log("\nPrograma encerrado.");
                await conexao.end();
                break;

            default:
                console.log("\nOpção inválida.");
        }
    } while (opcao !== "0");
}

menu();
