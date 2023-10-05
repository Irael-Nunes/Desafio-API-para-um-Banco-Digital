// bancodedados.js

const bancoDeDados = {
    banco: {
        nome: "Cubos Bank",
        numero: "123",
        agencia: "0001",
        senha: "Cubos123Bank",
    },
    contas: [
        {
            numero: "1",
            saldo: 100000,
            usuario: {
                nome: "Irael Alves Nunes",
                cpf: "004322851890",
                data_nascimento: "1983-10-08",
                telefone: "63984163962",
                email: "ira.nunes21@gmail.com",
                senha: "senha123",
            },
        },
        // Outras contas aqui...
    ],
    saques: [
        // Registros de saques aqui...
    ],
    depositos: [
        // Registros de depósitos aqui...
    ],
    transferencias: [
        // Registros de transferências aqui...
    ],
};

module.exports = bancoDeDados;
