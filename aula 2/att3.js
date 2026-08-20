const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'escola'
});

conexao.connect((erro) => {
    if (erro) {
        console.log('Erro ao conectar:', erro);
        return;
    }

    console.log('Conectado ao banco de dados!');

    const sql = `
        INSERT INTO professores (nome, disciplina)
        VALUES
        ('Maria', 'Matemática'),
        ('Carlos', 'Banco de Dados'),
        ('Fernanda', 'Programação')
    `;

    conexao.query(sql, (erro) => {
        if (erro) {
            console.log('Erro ao cadastrar:', erro);
            return;
        }

        console.log('Professores cadastrados!');

        excluirProfessor(2);
    });
});

function excluirProfessor(id) {
    const sql = 'DELETE FROM professores WHERE id = ?';

    conexao.query(sql, [id], (erro, resultado) => {
        if (erro) {
            console.log('Erro ao excluir:', erro);
            return;
        }

        if (resultado.affectedRows === 0) {
            console.log('Professor não encontrado.');
        } else {
            console.log('Professor excluído com sucesso!');
        }

        excluirProfessor(20);
    });
}