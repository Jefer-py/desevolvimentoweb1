const mysql = require("mysql2/promise");
const readline = require("readline-sync");

const conexao = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "atividade03"
});

async function cadastrar() {
    console.log("\n===== CADASTRO DE JOGOS =====");

    const nome = readline.question("Nome do jogo: ");

    const sql = `
        INSERT INTO jogos  
        (nome,genero)
        VALUES (?, ?)
    `;

    if (nome.trim() === "") {
        console.log("\nNome do jogo é obrigatório.");
        return;
    }

    const genero = readline.question("Gênero do jogo: ");

    if (genero.trim() === "") {
        console.log("\nGênero do jogo é obrigatório.");
        return;
    }

    try {
        await conexao.execute(sql, [
            nome,
            genero
        ]);

        console.log("\nJogo cadastrado com sucesso!");
    } catch (erro) {
        console.log("\nErro ao cadastrar jogo:", erro.message);
    }
}

async function listar() {
    const sql = "SELECT * FROM jogos";

    try {
        const [jogos] = await conexao.execute(sql);

        if (jogos.length === 0) {
            console.log("\nNenhum jogo cadastrado.");
            return;
        }

        console.log("\n===== LISTA DE JOGOS =====");

        jogos.forEach((jogo) => {
            console.log(
                `${jogo.id} - ${jogo.nome} - ${jogo.genero}`
            );
        });
    } catch (erro) {
        console.log("\nErro ao listar jogos:", erro.message);
    }
}

async function excluir() {
    const id = readline.questionInt("\nDigite o ID do jogo: ");

    try {
        const sqlConsulta = "SELECT * FROM jogos WHERE id = ?";
        const [jogos] = await conexao.execute(sqlConsulta, [id]);

        if (jogos.length === 0) {
            console.log("\nJogo não encontrado.");
            return;
        }

        const jogo = jogos[0];

        console.log("\n===== REGISTRO ENCONTRADO =====");
        console.log(`Nome: ${jogo.nome}`);
        console.log(`Gênero: ${jogo.genero}`);

        const confirmacao = readline
            .question("\nDeseja excluir? (S/N): ")
            .toUpperCase();

        if (confirmacao !== "S") {
            console.log("\nExclusão cancelada.");
            return;
        }

        const sqlDelete = "DELETE FROM jogos WHERE id = ?";
        const [resultado] = await conexao.execute(sqlDelete, [id]);

        if (resultado.affectedRows > 0) {
            console.log("\nJogo excluído com sucesso!");
        } else {
            console.log("\nNão foi possível excluir o jogo.");
        }
    } catch (erro) {
        console.log("\nErro ao excluir jogo:", erro.message);
    }
}

async function menu() {
    let opcao;

    do {
        console.log(`
===== JOGOS =====

1 - Cadastrar jogo
2 - Listar jogos
3 - Excluir jogo
0 - Sair
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
