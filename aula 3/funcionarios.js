const mysql = require("mysql2/promise");
const readline = require("readline-sync");

const conexao = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "atividade03"
});

async function cadastrar() {
    console.log("\n===== CADASTRO DE FUNCIONÁRIOS =====");

    const nome = readline.question("Nome do funcionário: ");

    const sql = `
        INSERT INTO funcionarios  
        (nome,genero)
        VALUES (?, ?)
    `;

    if (nome.trim() === "") {
        console.log("\nNome do funcionário é obrigatório.");
        return;
    }

    const genero = readline.question("Gênero do funcionário: ");

    if (genero.trim() === "") {
        console.log("\nGênero do funcionário é obrigatório.");
        return;
    }

    try {
        await conexao.execute(sql, [
            nome,
            genero
        ]);

        console.log("\nFuncionário cadastrado com sucesso!");
    } catch (erro) {
        console.log("\nErro ao cadastrar funcionário:", erro.message);
    }
}

async function listar() {
    const sql = "SELECT * FROM funcionarios";

    try {
        const [funcionarios] = await conexao.execute(sql);

        if (funcionarios.length === 0) {
            console.log("\nNenhum funcionário cadastrado.");
            return;
        }

        console.log("\n===== LISTA DE FUNCIONÁRIOS =====");

        funcionarios.forEach((funcionario) => {
            console.log(
                `${funcionario.id} - ${funcionario.nome} - ${funcionario.genero}`
            );
        });
    } catch (erro) {
        console.log("\nErro ao listar funcionários:", erro.message);
    }
}

async function excluir() {
    const id = readline.questionInt("\nDigite o ID do funcionário: ");

    try {
        const sqlConsulta = "SELECT * FROM funcionarios WHERE id = ?";
        const [funcionarios] = await conexao.execute(sqlConsulta, [id]);

        if (funcionarios.length === 0) {
            console.log("\nFuncionário não encontrado.");
            return;
        }

        const funcionario = funcionarios[0];

        console.log("\n===== REGISTRO ENCONTRADO =====");
        console.log(`Nome: ${funcionario.nome}`);
        console.log(`Gênero: ${funcionario.genero}`);

        const confirmacao = readline
            .question("\nDeseja excluir? (S/N): ")
            .toUpperCase();

        if (confirmacao !== "S") {
            console.log("\nExclusão cancelada.");
            return;
        }

        const sqlDelete = "DELETE FROM funcionarios WHERE id = ?";
        const [resultado] = await conexao.execute(sqlDelete, [id]);

        if (resultado.affectedRows > 0) {
            console.log("\nFuncionário excluído com sucesso!");
        } else {
            console.log("\nNão foi possível excluir o funcionário.");
        }
    } catch (erro) {
        console.log("\nErro ao excluir funcionário:", erro.message);
    }
}

async function menu() {
    let opcao;

    do {
        console.log(`
===== FUNCIONÁRIOS =====

1 - Cadastrar funcionário
2 - Listar funcionário
3 - Excluir funcionário
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
