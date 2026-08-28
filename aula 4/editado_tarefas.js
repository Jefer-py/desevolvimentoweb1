const mysql = require("mysql2/promise");
const readline = require("readline-sync");

const conexao = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "atividade4"
});

async function cadastrar() {
    console.log("\n===== CADASTRO DE TAREFAS =====");

    const nome = readline.question("Nome da tarefa: ");

    const sql = `
        INSERT INTO tarefas  
        (nome,genero)
        VALUES (?, ?)
    `;

    if (nome.trim() === "") {
        console.log("\nNome da tarefa é obrigatório.");
        return;
    }

    const genero = readline.question("Gênero da tarefa: ");

    if (genero.trim() === "") {
        console.log("\nGênero da tarefa é obrigatório.");
        return;
    }

    try {
        await conexao.execute(sql, [
            nome,
            genero
        ]);

        console.log("\nTarefa cadastrada com sucesso!");
    } catch (erro) {
        console.log("\nErro ao cadastrar tarefa:", erro.message);
    }
}

async function listar() {
    const sql = "SELECT * FROM tarefas";

    try {
        const [tarefas] = await conexao.execute(sql);

        if (tarefas.length === 0) {
            console.log("\nNenhuma tarefa cadastrada.");
            return;
        }

        console.log("\n===== LISTA DE TAREFAS =====");

        tarefas.forEach((tarefa) => {
            console.log(
                `${tarefa.id} - ${tarefa.nome} - ${tarefa.genero}`
            );
        });
    } catch (erro) {
        console.log("\nErro ao listar tarefas:", erro.message);
    }
}


async function editar() {
    console.log("\n===== EDITAR TAREFA =====");

    const id = readline.questionInt("Digite o ID do tarefa: ");

    try {
        const sqlConsulta = "SELECT * FROM tarefas WHERE id = ?";
        const [registros] = await conexao.execute(sqlConsulta, [id]);

        if (registros.length === 0) {
            console.log("\nTarefa não encontrado.");
            return;
        }

        const registro = registros[0];

        console.log("\nRegistro encontrado:");
        console.log(`Nome da tarefa atual: ${registro.nome}`);
        console.log(`Gênero da tarefa atual: ${registro.genero}`);

        const nome = readline.question("\nNovo nome: ");
        const genero = readline.question("Novo genero: ");

        if (nome.trim() === "" || genero.trim() === "") {
            console.log("\nOs campos são obrigatórios.");
            return;
        }

        const sqlUpdate = `
            UPDATE tarefas
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
            console.log("\nTarefa atualizado com sucesso!");
        } else {
            console.log("\nNão foi possível atualizar o tarefa.");
        }

    } catch (erro) {
        console.log("\nErro ao editar tarefa:", erro.message);
    }
}

async function excluir() {
    const id = readline.questionInt("\nDigite o ID da tarefa: ");

    try {
        const sqlConsulta = "SELECT * FROM tarefas WHERE id = ?";
        const [tarefas] = await conexao.execute(sqlConsulta, [id]);

        if (tarefas.length === 0) {
            console.log("\nTarefa não encontrada.");
            return;
        }

        const tarefa = tarefas[0];

        console.log("\n===== REGISTRO ENCONTRADO =====");
        console.log(`Nome: ${tarefa.nome}`);
        console.log(`Gênero: ${tarefa.genero}`);

        const confirmacao = readline
            .question("\nDeseja excluir? (S/N): ")
            .toUpperCase();

        if (confirmacao !== "S") {
            console.log("\nExclusão cancelada.");
            return;
        }

        const sqlDelete = "DELETE FROM tarefas WHERE id = ?";
        const [resultado] = await conexao.execute(sqlDelete, [id]);

        if (resultado.affectedRows > 0) {
            console.log("\nTarefa excluída com sucesso!");
        } else {
            console.log("\nNão foi possível excluir a tarefa.");
        }
    } catch (erro) {
        console.log("\nErro ao excluir tarefa:", erro.message);
    }
}

async function menu() {
    let opcao;

    do {
        console.log(`
===== TAREFAS =====

1 - Cadastrar tarefa
2 - Listar tarefas
3 - Excluir tarefa

4 - Editar tarefa0 - Sair
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
