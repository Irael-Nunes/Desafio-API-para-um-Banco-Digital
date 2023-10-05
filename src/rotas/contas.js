const express = require('express');
const rota = express();
const controladorContas = require('../controladores/controladorContas');

rota.get('/', controladorContas.listarContas);
rota.post('/', controladorContas.criarConta);
rota.put('/:numeroConta/usuario', controladorContas.atualizarUsuario);
rota.delete('/:numeroConta', controladorContas.excluirConta);
rota.get('/saldo', controladorContas.consultarSaldo);
rota.get('/extrato', controladorContas.emitirExtrato);

module.exports = rota;
