const mysql = require("mysql2/promise");
const readline = require("readline-sync");

const conexao = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "atividade4"
});

async function cadastrar() {
    console.log("\n===== CADASTRO DE CLIENTES =====");

    const nome = readline.question("Nome do cliente: ");

    const sql = `
        INSERT INTO cliente  
        (nome)
        VALUES (?)
    `;

    if (nome.trim() === "") {
        console.log("\nNome do cliente é obrigatório.");
        return;
    }
    
    try {
        await conexao.execute(sql, [
            nome
        ]);

        console.log("\nCliente cadastrado com sucesso!");
    } catch (erro) {
        console.log("\nErro ao cadastrar cliente:", erro.message);
    }
}

async function listar() {
    const sql = "SELECT * FROM cliente";

    try {
        const [clientes] = await conexao.execute(sql);

        if (clientes.length === 0) {
            console.log("\nNenhum cliente cadastrado.");
            return;
        }

        console.log("\n===== LISTA DE CLIENTES =====");

        clientes.forEach((cliente) => {
            console.log(
                `${cliente.id} - ${cliente.nome}`
            );
        });
    } catch (erro) {
        console.log("\nErro ao listar clientes:", erro.message);
    }
}

async function atualizar() {
    console.log("\n===== ATUALIZAR CLIENTE =====");

    const id = readline.questionInt("Digite o ID do cliente: ");

    try {
        // Procura o cliente pelo ID
        const sqlConsulta = "SELECT * FROM cliente WHERE id = ?";
        const [clientes] = await conexao.execute(sqlConsulta, [id]);

        if (clientes.length === 0) {
            console.log("\nCliente não encontrado.");
            return;
        }

        const cliente = clientes[0];

        console.log("\nCliente encontrado:");
        console.log(`Nome atual: ${cliente.nome}`);
        // console.log(`Gênero: ${cliente.genero}`);

        // Novos dados
        const nome = readline.question("\nNovo nome: ");
        const email = readline.question("Novo e-mail: ");
        const endereco = readline.question("Novo endereco: ");
        const matricula = readline.question("Nova matricula: ");
        const curso = readline.question("Novo curso: ");
        const serie = readline.question("Nova serie: ");

        const sqlUpdate = `
            UPDATE cliente
            SET nome = ?,
                email = ?,
                endereco = ?,
            WHERE id = ?
        `;

        const [resultado] = await conexao.execute(sqlUpdate, [
            nome,
            email,
            endereco,
            id
        ]);

        if (resultado.affectedRows > 0) {
            console.log("\nCliente atualizado com sucesso!");
        } else {
            console.log("\nNão foi possível atualizar o cliente.");
        }

    } catch (erro) {
        console.log("Erro ao atualizar cliente:", erro.message);
    }
}

async function excluir() {
    const id = readline.questionInt("\nDigite o ID do cliente: ");

    try {
        const sqlConsulta = "SELECT * FROM cliente WHERE id = ?";
        const [clientes] = await conexao.execute(sqlConsulta, [id]);

        if (clientes.length === 0) {
            console.log("\nCliente não encontrado.");
            return;
        }

        const cliente = clientes[0];

        console.log("\n===== REGISTRO ENCONTRADO =====");
        console.log(`Nome: ${cliente.nome}`);
        // console.log(`Gênero: ${cliente.genero}`);

        const confirmacao = readline
            .question("\nDeseja excluir? (S/N): ")
            .toUpperCase();

        if (confirmacao !== "S") {
            console.log("\nExclusão cancelada.");
            return;
        }

        const sqlDelete = "DELETE FROM cliente WHERE id = ?";
        const [resultado] = await conexao.execute(sqlDelete, [id]);

        if (resultado.affectedRows > 0) {
            console.log("\nCliente excluído com sucesso!");
        } else {
            console.log("\nNão foi possível excluir o cliente.");
        }
    } catch (erro) {
        console.log("\nErro ao excluir cliente:", erro.message);
    }
}

async function menu() {
    let opcao;

    do {
        console.log(`
===== CLIENTES =====

1 - Cadastrar clientes
2 - Listar clientes
3 - Excluir clientes
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
