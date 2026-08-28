    const mysql = require("mysql2/promise");
    const readline = require("readline-sync");
    
    const conexao = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "root",
        database: "atividade4"
    });
    
    async function cadastrar() {
        console.log("\n===== CADASTRO DE COMPUTADORES =====");
    
        const nome = readline.question("Nome do computador: ");
    
        const sql = `
            INSERT INTO computadores  
            (nome,genero)
            VALUES (?, ?)
        `;
    
        if (nome.trim() === "") {
            console.log("\nNome do computador é obrigatório.");
            return;
        }
    
        const genero = readline.question("Gênero do computador: ");
    
        if (genero.trim() === "") {
            console.log("\nGênero do computador é obrigatório.");
            return;
        }
    
        try {
            await conexao.execute(sql, [
                nome,
                genero
            ]);
    
            console.log("\nComputador cadastrado com sucesso!");
        } catch (erro) {
            console.log("\nErro ao cadastrar computador:", erro.message);
        }
    }
    
    async function listar() {
        const sql = "SELECT * FROM computadores";
    
        try {
            const [computadores] = await conexao.execute(sql);
    
            if (computadores.length === 0) {
                console.log("\nNenhum computador cadastrado.");
                return;
            }
    
            console.log("\n===== LISTA DE COMPUTADORES =====");
    
            computadores.forEach((computador) => {
                console.log(
                    `${computador.id} - ${computador.nome} - ${computador.genero}`
                );
            });
        } catch (erro) {
            console.log("\nErro ao listar computadores:", erro.message);
        }
    }
    
    
async function editar() {
    console.log("\n===== EDITAR COMPUTADOR =====");

    const id = readline.questionInt("Digite o ID do computador: ");

    try {
        const sqlConsulta = "SELECT * FROM computadores WHERE id = ?";
        const [registros] = await conexao.execute(sqlConsulta, [id]);

        if (registros.length === 0) {
            console.log("\nComputador não encontrado.");
            return;
        }

        const registro = registros[0];

        console.log("\nRegistro encontrado:");
        console.log(`Nome do computador atual: ${registro.nome}`);
        console.log(`Gênero do computador atual: ${registro.genero}`);

        const nome = readline.question("\nNovo nome: ");
        const genero = readline.question("Novo genero: ");

        if (nome.trim() === "" || genero.trim() === "") {
            console.log("\nOs campos são obrigatórios.");
            return;
        }

        const sqlUpdate = `
            UPDATE computadores
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
            console.log("\nComputador atualizado com sucesso!");
        } else {
            console.log("\nNão foi possível atualizar o computador.");
        }

    } catch (erro) {
        console.log("\nErro ao editar computador:", erro.message);
    }
}

async function excluir() {
        const id = readline.questionInt("\nDigite o ID do computador: ");
    
        try {
            const sqlConsulta = "SELECT * FROM computadores WHERE id = ?";
            const [computadores] = await conexao.execute(sqlConsulta, [id]);
    
            if (computadores.length === 0) {
                console.log("\nComputador não encontrado.");
                return;
            }
    
            const computador = computadores[0];
    
            console.log("\n===== REGISTRO ENCONTRADO =====");
            console.log(`Nome: ${computador.nome}`);
            console.log(`Gênero: ${computador.genero}`);
    
            const confirmacao = readline
                .question("\nDeseja excluir? (S/N): ")
                .toUpperCase();
    
            if (confirmacao !== "S") {
                console.log("\nExclusão cancelada.");
                return;
            }
    
            const sqlDelete = "DELETE FROM computadores WHERE id = ?";
            const [resultado] = await conexao.execute(sqlDelete, [id]);
    
            if (resultado.affectedRows > 0) {
                console.log("\nComputador excluído com sucesso!");
            } else {
                console.log("\nNão foi possível excluir o computador.");
            }
        } catch (erro) {
            console.log("\nErro ao excluir computador:", erro.message);
        }
    }
    
    async function menu() {
        let opcao;
    
        do {
            console.log(`
    ===== COMPUTADORES =====
    
    1 - Cadastrar computador
    2 - Listar computadores
    3 - Excluir computador
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
    