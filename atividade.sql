CREATE DATABASE laboratorio_avaliacao;
USE laboratorio_avaliacao;
CREATE TABLE computadores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patrimonio VARCHAR(50),
    localizacao VARCHAR(100),
    responsavel VARCHAR(100),
    status VARCHAR(50)
)