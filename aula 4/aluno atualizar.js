const mysql = require("mysql2/promise");
const readline = require("readline-sync");

const conexao = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "atividade03"
});

async function cadastrar() {
    console.log("\n===== CADASTRO DE ALUNO =====");

    const nome = readline.question("Nome: ");
    const email = readline.question("E-mail: ");
    const endereco = readline.question("Endereco: ");
    const matricula = readline.question("Matricula: ");
    const curso = readline.question("Curso: ");
    const serie = readline.question("Serie: ");

    const sql = `
        INSERT INTO alunos
        (nome, email, endereco, matricula, curso, serie)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
        await conexao.execute(sql, [
            nome,
            email,
            endereco,
            matricula,
            curso,
            serie
        ]);

        console.log("\nAluno cadastrado com sucesso!");
    } catch (erro) {
        console.log("Erro ao cadastrar aluno:", erro.message);
    }
}

async function listar() {
    const sql = "SELECT * FROM alunos";

    try {
        const [alunos] = await conexao.execute(sql);

        if (alunos.length === 0) {
            console.log("\nNenhum aluno cadastrado.");
            return;
        }

        console.log("\n===== LISTA DE ALUNOS =====");

        alunos.forEach((aluno) => {
            console.log(
                `${aluno.id} - ${aluno.nome} - ${aluno.email}`
            );
        });
    } catch (erro) {
        console.log("Erro ao listar alunos:", erro.message);
    }
}

async function atualizar() {
    console.log("\n===== ATUALIZAR ALUNO =====");

    const id = readline.questionInt("Digite o ID do aluno: ");

    try {
        // Procura o aluno pelo ID
        const sqlConsulta = "SELECT * FROM alunos WHERE id = ?";
        const [alunos] = await conexao.execute(sqlConsulta, [id]);

        if (alunos.length === 0) {
            console.log("\nAluno não encontrado.");
            return;
        }

        const aluno = alunos[0];

        console.log("\nAluno encontrado:");
        console.log(`Nome atual: ${aluno.nome}`);
        console.log(`E-mail atual: ${aluno.email}`);
        console.log(`Endereco atual: ${aluno.endereco}`);
        console.log(`Matricula atual: ${aluno.matricula}`);
        console.log(`Curso atual: ${aluno.curso}`);
        console.log(`Serie atual: ${aluno.serie}`);

        // Novos dados
        const nome = readline.question("\nNovo nome: ");
        const email = readline.question("Novo e-mail: ");
        const endereco = readline.question("Novo endereco: ");
        const matricula = readline.question("Nova matricula: ");
        const curso = readline.question("Novo curso: ");
        const serie = readline.question("Nova serie: ");

        const sqlUpdate = `
            UPDATE alunos
            SET nome = ?,
                email = ?,
                endereco = ?,
                matricula = ?,
                curso = ?,
                serie = ?
            WHERE id = ?
        `;

        const [resultado] = await conexao.execute(sqlUpdate, [
            nome,
            email,
            endereco,
            matricula,
            curso,
            serie,
            id
        ]);

        if (resultado.affectedRows > 0) {
            console.log("\nAluno atualizado com sucesso!");
        } else {
            console.log("\nNão foi possível atualizar o aluno.");
        }

    } catch (erro) {
        console.log("Erro ao atualizar aluno:", erro.message);
    }
}

async function excluir() {
    const id = readline.questionInt("\nDigite o ID do aluno: ");

    try {
        const sqlConsulta = "SELECT * FROM alunos WHERE id = ?";
        const [alunos] = await conexao.execute(sqlConsulta, [id]);

        if (alunos.length === 0) {
            console.log("\nAluno não encontrado.");
            return;
        }

        const aluno = alunos[0];

        console.log("\nRegistro encontrado:");
        console.log(`Nome: ${aluno.nome}`);
        console.log(`E-mail: ${aluno.email}`);

        const confirmacao = readline
            .question("Deseja excluir? (S/N): ")
            .toUpperCase();

        if (confirmacao !== "S") {
            console.log("\nExclusão cancelada.");
            return;
        }

        const sqlDelete = "DELETE FROM alunos WHERE id = ?";
        const [resultado] = await conexao.execute(sqlDelete, [id]);

        if (resultado.affectedRows > 0) {
            console.log("\nAluno excluído com sucesso!");
        } else {
            console.log("\nNão foi possível excluir o aluno.");
        }
    } catch (erro) {
        console.log("Erro ao excluir aluno:", erro.message);
    }
}

async function menu() {
    let opcao;

    do {
        console.log(`
===== ALUNOS =====

1 - Cadastrar aluno
2 - Listar alunos
3 - Excluir aluno
4 - Atualizar aluno
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

            case "4":
                await atualizar();
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