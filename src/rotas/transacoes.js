const express = require('express');
const rota = express();
const contoladorTransacoes = require('../controladores/controladorTransacoes');

rota.post('/depositar', contoladorTransacoes.depositar);
rota.post('/sacar', contoladorTransacoes.sacar);
rota.post('/transferir', contoladorTransacoes.transferir);

module.exports = rota;
