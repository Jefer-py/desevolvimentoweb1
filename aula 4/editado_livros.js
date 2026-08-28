const mysql = require("mysql2/promise");
const readline = require("readline-sync");

const conexao = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "atividade4"
});

async function cadastrar() {
    console.log("\n===== CADASTRO DE LIVRO =====");

    const nome = readline.question("Nome do livro: ");

    const sql = `
        INSERT INTO lvros  
        (titulo,autor)
        VALUES (?, ?)
    `;

    if (nome.trim() === "") {
        console.log("\nNome do livro é obrigatório.");
        return;
    }

    const autor = readline.question("Autor do livro: ");

    if (autor.trim() === "") {
        console.log("\nAutor do livro é obrigatório.");
        return;
    }

    try {
        await conexao.execute(sql, [
            nome,
            autor
        ]);

        console.log("\nLivro cadastrado com sucesso!");
    } catch (erro) {
        console.log("\nErro ao cadastrar livro:", erro.message);
    }
}

async function listar() {
    const sql = "SELECT * FROM lvros";

    try {
        const [livros] = await conexao.execute(sql);

        if (livros.length === 0) {
            console.log("\nNenhum livro cadastrado.");
            return;
        }

        console.log("\n===== LISTA DE LIVROS =====");

        livros.forEach((livro) => {
            console.log(
                `${livro.id} - ${livro.titulo} - ${livro.autor}`
            );
        });
    } catch (erro) {
        console.log("\nErro ao listar livros:", erro.message);
    }
}


async function editar() {
    console.log("\n===== EDITAR LIVRO =====");

    const id = readline.questionInt("Digite o ID do livro: ");

    try {
        const sqlConsulta = "SELECT * FROM lvros WHERE id = ?";
        const [registros] = await conexao.execute(sqlConsulta, [id]);

        if (registros.length === 0) {
            console.log("\nLivro não encontrado.");
            return;
        }

        const registro = registros[0];

        console.log("\nRegistro encontrado:");
        console.log(`Título do livro atual: ${registro.titulo}`);
        console.log(`Autor do livro atual: ${registro.autor}`);

        const titulo = readline.question("\nNovo titulo: ");
        const autor = readline.question("Novo autor: ");

        if (titulo.trim() === "" || autor.trim() === "") {
            console.log("\nOs campos são obrigatórios.");
            return;
        }

        const sqlUpdate = `
            UPDATE lvros
            SET titulo = ?,
                autor = ?
            WHERE id = ?
        `;

        const [resultado] = await conexao.execute(sqlUpdate, [
            titulo,
            autor,
            id
        ]);

        if (resultado.affectedRows > 0) {
            console.log("\nLivro atualizado com sucesso!");
        } else {
            console.log("\nNão foi possível atualizar o livro.");
        }

    } catch (erro) {
        console.log("\nErro ao editar livro:", erro.message);
    }
}

async function excluir() {
    const id = readline.questionInt("\nDigite o ID do livro: ");

    try {
        const sqlConsulta = "SELECT * FROM lvros WHERE id = ?";
        const [livros] = await conexao.execute(sqlConsulta, [id]);

        if (livros.length === 0) {
            console.log("\nLivro não encontrado.");
            return;
        }

        const livro = livros[0];

        console.log("\n===== REGISTRO ENCONTRADO =====");
        console.log(`Título: ${livro.titulo}`);
        console.log(`Autor: ${livro.autor}`);

        const confirmacao = readline
            .question("\nDeseja excluir? (S/N): ")
            .toUpperCase();

        if (confirmacao !== "S") {
            console.log("\nExclusão cancelada.");
            return;
        }

        const sqlDelete = "DELETE FROM lvros WHERE id = ?";
        const [resultado] = await conexao.execute(sqlDelete, [id]);

        if (resultado.affectedRows > 0) {
            console.log("\nLivro excluído com sucesso!");
        } else {
            console.log("\nNão foi possível excluir o livro.");
        }
    } catch (erro) {
        console.log("\nErro ao excluir livro:", erro.message);
    }
}

async function menu() {
    let opcao;

    do {
        console.log(`
===== LIVROS =====

1 - Cadastrar livro
2 - Listar livros
3 - Excluir livro

4 - Editar livro0 - Sair
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
