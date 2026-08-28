const mysql = require("mysql2/promise");
const readline = require("readline-sync");

const conexao = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "atividade4"
});

async function cadastrar() {
    console.log("\n===== CADASTRO DE CURSOS =====");

    const nome = readline.question("Nome do curso: ");

    const sql = `
        INSERT INTO cursos  
        (nome,genero)
        VALUES (?, ?)
    `;

    if (nome.trim() === "") {
        console.log("\nNome do curso é obrigatório.");
        return;
    }

    const genero = readline.question("Gênero do curso: ");

    if (genero.trim() === "") {
        console.log("\nGênero do curso é obrigatório.");
        return;
    }

    try {
        await conexao.execute(sql, [
            nome,
            genero
        ]);

        console.log("\nCurso cadastrado com sucesso!");
    } catch (erro) {
        console.log("\nErro ao cadastrar curso:", erro.message);
    }
}

async function listar() {
    const sql = "SELECT * FROM cursos";

    try {
        const [cursos] = await conexao.execute(sql);

        if (cursos.length === 0) {
            console.log("\nNenhum curso cadastrado.");
            return;
        }

        console.log("\n===== LISTA DE CURSOS =====");

        cursos.forEach((curso) => {
            console.log(
                `${curso.id} - ${curso.nome} - ${curso.genero}`
            );
        });
    } catch (erro) {
        console.log("\nErro ao listar cursos:", erro.message);
    }
}


async function editar() {
    console.log("\n===== EDITAR CURSO =====");

    const id = readline.questionInt("Digite o ID do curso: ");

    try {
        const sqlConsulta = "SELECT * FROM cursos WHERE id = ?";
        const [registros] = await conexao.execute(sqlConsulta, [id]);

        if (registros.length === 0) {
            console.log("\nCurso não encontrado.");
            return;
        }

        const registro = registros[0];

        console.log("\nRegistro encontrado:");
        console.log(`Nome do curso atual: ${registro.nome}`);
        console.log(`Gênero do curso atual: ${registro.genero}`);

        const nome = readline.question("\nNovo nome: ");
        const genero = readline.question("Novo genero: ");

        if (nome.trim() === "" || genero.trim() === "") {
            console.log("\nOs campos são obrigatórios.");
            return;
        }

        const sqlUpdate = `
            UPDATE cursos
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
            console.log("\nCurso atualizado com sucesso!");
        } else {
            console.log("\nNão foi possível atualizar o curso.");
        }

    } catch (erro) {
        console.log("\nErro ao editar curso:", erro.message);
    }
}

async function excluir() {
    const id = readline.questionInt("\nDigite o ID do curso: ");

    try {
        const sqlConsulta = "SELECT * FROM cursos WHERE id = ?";
        const [cursos] = await conexao.execute(sqlConsulta, [id]);

        if (cursos.length === 0) {
            console.log("\nCurso não encontrado.");
            return;
        }

        const curso = cursos[0];

        console.log("\n===== REGISTRO ENCONTRADO =====");
        console.log(`Nome: ${curso.nome}`);
        console.log(`Gênero: ${curso.genero}`);

        const confirmacao = readline
            .question("\nDeseja excluir? (S/N): ")
            .toUpperCase();

        if (confirmacao !== "S") {
            console.log("\nExclusão cancelada.");
            return;
        }

        const sqlDelete = "DELETE FROM cursos WHERE id = ?";
        const [resultado] = await conexao.execute(sqlDelete, [id]);

        if (resultado.affectedRows > 0) {
            console.log("\nCurso excluído com sucesso!");
        } else {
            console.log("\nNão foi possível excluir o curso.");
        }
    } catch (erro) {
        console.log("\nErro ao excluir curso:", erro.message);
    }
}

async function menu() {
    let opcao;

    do {
        console.log(`
===== CURSOS =====

1 - Cadastrar curso
2 - Listar cursos
3 - Excluir curso

4 - Editar curso0 - Sair
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
