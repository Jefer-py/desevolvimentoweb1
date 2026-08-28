const mysql = require("mysql2/promise");
const readline = require("readline-sync");

const conexao = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "atividade4"
});

async function cadastrar() {
    console.log("\n===== CADASTRO DE EVENTOS =====");

    const nome = readline.question("Nome do evento: ");

    const sql = `
        INSERT INTO eventos  
        (nome,genero)
        VALUES (?, ?)
    `;

    if (nome.trim() === "") {
        console.log("\nNome do evento é obrigatório.");
        return;
    }

    const genero = readline.question("Gênero do evento: ");

    if (genero.trim() === "") {
        console.log("\nGênero do evento é obrigatório.");
        return;
    }

    try {
        await conexao.execute(sql, [
            nome,
            genero
        ]);

        console.log("\nEvento cadastrado com sucesso!");
    } catch (erro) {
        console.log("\nErro ao cadastrar evento:", erro.message);
    }
}

async function listar() {
    const sql = "SELECT * FROM eventos";

    try {
        const [eventos] = await conexao.execute(sql);

        if (eventos.length === 0) {
            console.log("\nNenhum evento cadastrado.");
            return;
        }

        console.log("\n===== LISTA DE EVENTOS =====");

        eventos.forEach((evento) => {
            console.log(
                `${evento.id} - ${evento.nome} - ${evento.genero}`
            );
        });
    } catch (erro) {
        console.log("\nErro ao listar eventos:", erro.message);
    }
}


async function editar() {
    console.log("\n===== EDITAR EVENTO =====");

    const id = readline.questionInt("Digite o ID do evento: ");

    try {
        const sqlConsulta = "SELECT * FROM eventos WHERE id = ?";
        const [registros] = await conexao.execute(sqlConsulta, [id]);

        if (registros.length === 0) {
            console.log("\nEvento não encontrado.");
            return;
        }

        const registro = registros[0];

        console.log("\nRegistro encontrado:");
        console.log(`Nome do evento atual: ${registro.nome}`);
        console.log(`Gênero do evento atual: ${registro.genero}`);

        const nome = readline.question("\nNovo nome: ");
        const genero = readline.question("Novo genero: ");

        if (nome.trim() === "" || genero.trim() === "") {
            console.log("\nOs campos são obrigatórios.");
            return;
        }

        const sqlUpdate = `
            UPDATE eventos
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
            console.log("\nEvento atualizado com sucesso!");
        } else {
            console.log("\nNão foi possível atualizar o evento.");
        }

    } catch (erro) {
        console.log("\nErro ao editar evento:", erro.message);
    }
}

async function excluir() {
    const id = readline.questionInt("\nDigite o ID do evento: ");

    try {
        const sqlConsulta = "SELECT * FROM eventos WHERE id = ?";
        const [eventos] = await conexao.execute(sqlConsulta, [id]);

        if (eventos.length === 0) {
            console.log("\nEvento não encontrado.");
            return;
        }

        const evento = eventos[0];

        console.log("\n===== REGISTRO ENCONTRADO =====");
        console.log(`Nome: ${evento.nome}`);
        console.log(`Gênero: ${evento.genero}`);

        const confirmacao = readline
            .question("\nDeseja excluir? (S/N): ")
            .toUpperCase();

        if (confirmacao !== "S") {
            console.log("\nExclusão cancelada.");
            return;
        }

        const sqlDelete = "DELETE FROM eventos WHERE id = ?";
        const [resultado] = await conexao.execute(sqlDelete, [id]);

        if (resultado.affectedRows > 0) {
            console.log("\nEvento excluído com sucesso!");
        } else {
            console.log("\nNão foi possível excluir o evento.");
        }
    } catch (erro) {
        console.log("\nErro ao excluir evento:", erro.message);
    }
}

async function menu() {
    let opcao;

    do {
        console.log(`
===== EVENTOS =====

1 - Cadastrar evento
2 - Listar eventos
3 - Excluir evento

4 - Editar evento0 - Sair
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
