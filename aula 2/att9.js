const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'loja'
});

const sql = `
    INSERT INTO vendas (produto, quantidade, valor)
    VALUES (?, ?, ?)
`;

const valores = ['Notebook', 2, 3500.00];

conexao.query(sql, valores, (erro, resultado) => {
    if (erro) {
        console.log('Erro ao cadastrar venda:', erro);
    } else {
        console.log('Venda cadastrada com sucesso!');
    }

    conexao.end();
});