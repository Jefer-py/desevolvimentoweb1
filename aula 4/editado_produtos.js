const mysql = require("mysql2/promise");
const readline = require("readline-sync");

const conexao = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "atividade4"
});

async function cadastrar() {
    console.log("\n===== CADASTRO DE PRODUTOS =====");

    const nome = readline.question("Nome do produto: ");

    const sql = `
        INSERT INTO produtos  

        (nome)
        VALUES (?)
    `;

    if (nome.trim() === "") {
        console.log("\nNome do produto é obrigatório.");
        return;
    }

    const preco = readline.question("Preço do produto: ");

    if (preco.trim() === "") {
        console.log("\nPreço do produto é obrigatório.");
        return;
    }

    try {
        await conexao.execute(sql, [
            nome,
            preco,
        ]);

        console.log("\nProduto cadastrado com sucesso!");
    } catch (erro) {
        console.log("\nErro ao cadastrar produto:", erro.message);
    }
}

async function listar() {
    const sql = "SELECT * FROM produtos";

    try {
        const [produtos] = await conexao.execute(sql);

        if (produtos.length === 0) {
            console.log("\nNenhum produto cadastrado.");
            return;
        }

        console.log("\n===== LISTA DE PRODUTOS =====");

        produtos.forEach((produto) => {
            console.log(
                `${produto.id} - ${produto.nome}`
            );
        });
    } catch (erro) {
        console.log("\nErro ao listar produtos:", erro.message);
    }
}


async function editar() {
    console.log("\n===== EDITAR PRODUTO =====");

    const id = readline.questionInt("Digite o ID do produto: ");

    try {
        const sqlConsulta = "SELECT * FROM produtos WHERE id = ?";
        const [registros] = await conexao.execute(sqlConsulta, [id]);

        if (registros.length === 0) {
            console.log("\nProduto não encontrado.");
            return;
        }

        const registro = registros[0];

        console.log("\nRegistro encontrado:");
        console.log(`Nome atual: ${registro.nome}`);

        const nome = readline.question("\nNovo nome: ");

        if (nome.trim() === "") {
            console.log("\nNome é obrigatório.");
            return;
        }

        const sqlUpdate = `
            UPDATE produtos
            SET nome = ?
            WHERE id = ?
        `;

        const [resultado] = await conexao.execute(sqlUpdate, [
            nome,
            id
        ]);

        if (resultado.affectedRows > 0) {
            console.log("\nProduto atualizado com sucesso!");
        } else {
            console.log("\nNão foi possível atualizar o produto.");
        }

    } catch (erro) {
        console.log("\nErro ao editar produto:", erro.message);
    }
}

async function excluir() {
    const id = readline.questionInt("\nDigite o ID do produto: ");

    try {
        const sqlConsulta = "SELECT * FROM produtos WHERE id = ?";
        const [produtos] = await conexao.execute(sqlConsulta, [id]);

        if (produtos.length === 0) {
            console.log("\nProduto não encontrado.");
            return;
        }

        const produto = produtos[0];

        console.log("\n===== REGISTRO ENCONTRADO =====");
        console.log(`Nome: ${produto.nome}`);
        console.log(`Autor: ${produto.autor}`);

        const confirmacao = readline
            .question("\nDeseja excluir? (S/N): ")
            .toUpperCase();

        if (confirmacao !== "S") {
            console.log("\nExclusão cancelada.");
            return;
        }

        const sqlDelete = "DELETE FROM produtos WHERE id = ?";
        const [resultado] = await conexao.execute(sqlDelete, [id]);

        if (resultado.affectedRows > 0) {
            console.log("\nProduto excluído com sucesso!");
        } else {
            console.log("\nNão foi possível excluir o produto.");
        }
    } catch (erro) {
        console.log("\nErro ao excluir produto:", erro.message);
    }
}

async function menu() {
    let opcao;

    do {
        console.log(`
===== PRODUTOS =====

1 - Cadastrar produtos
2 - Listar produtos
3 - Excluir produtos

4 - Editar produto0 - Sair
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
