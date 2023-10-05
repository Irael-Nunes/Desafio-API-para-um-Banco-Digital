const express = require('express');
const nunes = express();
const porta = 3000;

nunes.use(express.json()); // O Express já inclui o body-parser

const RotasContas = require('./rotas/contas');
const RotasTransacoes = require('./rotas/transacoes');

nunes.use('/contas', RotasContas);
nunes.use('/transacoes', RotasTransacoes);

nunes.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
