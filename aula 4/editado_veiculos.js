const mysql = require("mysql2/promise");
const readline = require("readline-sync");

const conexao = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "atividade4"
});

async function cadastrar() {
    console.log("\n===== CADASTRO DE VEICULOS =====");

    const nome = readline.question("Nome do veículo: ");

    const sql = `
        INSERT INTO veiculos     
        (nome,genero)
        VALUES (?, ?)
    `;

    if (nome.trim() === "") {
        console.log("\nNome do veículo é obrigatório.");
        return;
    }

    const genero = readline.question("Gênero do veículo: ");

    if (genero.trim() === "") {
        console.log("\nGênero do veículo é obrigatório.");
        return;
    }

    try {
        await conexao.execute(sql, [
            nome,
            genero
        ]);

        console.log("\nVeículo cadastrado com sucesso!");
    } catch (erro) {
        console.log("\nErro ao cadastrar veículo:", erro.message);
    }
}

async function listar() {
    const sql = "SELECT * FROM veiculos";

    try {
        const [veiculos] = await conexao.execute(sql);

        if (veiculos.length === 0) {
            console.log("\nNenhum veículo cadastrado.");
            return;
        }

        console.log("\n===== LISTA DE VEÍCULOS =====");

        veiculos.forEach((veiculo) => {
            console.log(
                `${veiculo.id} - ${veiculo.nome} - ${veiculo.genero}`
            );
        });
    } catch (erro) {
        console.log("\nErro ao listar veículos:", erro.message);
    }
}


async function editar() {
    console.log("\n===== EDITAR VEÍCULO =====");

    const id = readline.questionInt("Digite o ID do veículo: ");

    try {
        const sqlConsulta = "SELECT * FROM veiculos WHERE id = ?";
        const [registros] = await conexao.execute(sqlConsulta, [id]);

        if (registros.length === 0) {
            console.log("\nVeículo não encontrado.");
            return;
        }

        const registro = registros[0];

        console.log("\nRegistro encontrado:");
        console.log(`Nome do veículo atual: ${registro.nome}`);
        console.log(`Gênero do veículo atual: ${registro.genero}`);

        const nome = readline.question("\nNovo nome: ");
        const genero = readline.question("Novo genero: ");

        if (nome.trim() === "" || genero.trim() === "") {
            console.log("\nOs campos são obrigatórios.");
            return;
        }

        const sqlUpdate = `
            UPDATE veiculos
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
            console.log("\nVeículo atualizado com sucesso!");
        } else {
            console.log("\nNão foi possível atualizar o veículo.");
        }

    } catch (erro) {
        console.log("\nErro ao editar veículo:", erro.message);
    }
}

async function excluir() {
    const id = readline.questionInt("\nDigite o ID do veículo: ");

    try {
        const sqlConsulta = "SELECT * FROM veiculos WHERE id = ?";
        const [veiculos] = await conexao.execute(sqlConsulta, [id]);

        if (veiculos.length === 0) {
            console.log("\nVeículo não encontrado.");
            return;
        }

        const veiculo = veiculos[0];

        console.log("\n===== REGISTRO ENCONTRADO =====");
        console.log(`Nome: ${veiculo.nome}`);
        console.log(`Gênero: ${veiculo.genero}`);

        const confirmacao = readline
            .question("\nDeseja excluir? (S/N): ")
            .toUpperCase();

        if (confirmacao !== "S") {
            console.log("\nExclusão cancelada.");
            return;
        }

        const sqlDelete = "DELETE FROM veiculos WHERE id = ?";
        const [resultado] = await conexao.execute(sqlDelete, [id]);

        if (resultado.affectedRows > 0) {
            console.log("\nVeículo excluído com sucesso!");
        } else {
            console.log("\nNão foi possível excluir o veículo.");
        }
    } catch (erro) {
        console.log("\nErro ao excluir veículo:", erro.message);
    }
}

async function menu() {
    let opcao;

    do {
        console.log(`
===== VEÍCULOS =====

1 - Cadastrar veículo
2 - Listar veículos
3 - Excluir veículo

4 - Editar veículo0 - Sair
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
