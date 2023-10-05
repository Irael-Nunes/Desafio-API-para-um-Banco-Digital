const bancoDeDados = require('../bancodedados');

// Depositar em uma conta bancária
const depositar = (req, res) => {
  const { numero_conta, valor } = req.body;

  // Verifique se o número da conta e o valor foram informados
  if (!numero_conta || !valor) {
    return res.status(400).json({ mensagem: 'O número da conta e o valor são obrigatórios!' });
  }

  // Encontre a conta com o número informado
  const conta = bancoDeDados.contas.find((conta) => conta.numero === numero_conta);

  if (!conta) {
    return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
  }

  // Verifique se o valor do depósito é válido (não é negativo ou zero)
  if (valor <= 0) {
    return res.status(400).json({ mensagem: 'O valor do depósito deve ser maior que zero!' });
  }

  // Atualize o saldo da conta
  conta.saldo += valor;

  // Registre o depósito
  const registroDeposito = {
    data: new Date().toISOString(),
    numero_conta: numero_conta,
    valor: valor,
  };

  bancoDeDados.depositos.push(registroDeposito);

  res.status(204).end();
};

// Sacar de uma conta bancária
const sacar = (req, res) => {
  const { numero_conta, valor, senha } = req.body;

  // Encontre a conta com o número informado
  const conta = bancoDeDados.contas.find((conta) => conta.numero === numero_conta);

  if (!conta) {
    return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
  }

  // Verifique se a senha está correta
  if (senha !== conta.usuario.senha) {
    return res.status(401).json({ mensagem: 'Senha incorreta!' });
  }

  // Verifique se o valor do saque é válido (não é negativo ou zero)
  if (valor <= 0) {
    return res.status(400).json({ mensagem: 'O valor do saque deve ser maior que zero!' });
  }

  // Verifique se há saldo disponível para saque
  if (valor > conta.saldo) {
    return res.status(400).json({ mensagem: 'Saldo insuficiente!' });
  }

  // Atualize o saldo da conta
  conta.saldo -= valor;

  // Registre o saque
  const registroSaque = {
    data: new Date().toISOString(),
    numero_conta: numero_conta,
    valor: valor,
  };

  bancoDeDados.saques.push(registroSaque);

  res.status(204).end();
};

// Transferir valores entre contas bancárias
const transferir = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

  // Encontre a conta de origem e a conta de destino
  const contaOrigem = bancoDeDados.contas.find((conta) => conta.numero === numero_conta_origem);
  const contaDestino = bancoDeDados.contas.find((conta) => conta.numero === numero_conta_destino);

  if (!contaOrigem || !contaDestino) {
    return res.status(404).json({ mensagem: 'Conta bancária de origem ou destino não encontrada!' });
  }

  // Verifique se a senha da conta de origem está correta
  if (senha !== contaOrigem.usuario.senha) {
    return res.status(401).json({ mensagem: 'Senha incorreta!' });
  }

  // Verifique se o valor da transferência é válido (não é negativo ou zero)
  if (valor <= 0) {
    return res.status(400).json({ mensagem: 'O valor da transferência deve ser maior que zero!' });
  }

  // Verifique se há saldo disponível na conta de origem
  if (valor > contaOrigem.saldo) {
    return res.status(400).json({ mensagem: 'Saldo insuficiente!' });
  }

  // Atualize o saldo da conta de origem e da conta de destino
  contaOrigem.saldo -= valor;
  contaDestino.saldo += valor;

  // Registre a transferência
  const registroTransferencia = {
    data: new Date().toISOString(),
    numero_conta_origem: numero_conta_origem,
    numero_conta_destino: numero_conta_destino,
    valor: valor,
  };

  bancoDeDados.transferencias.push(registroTransferencia);

  res.status(204).end();
};

module.exports = {
  depositar,
  sacar,
  transferir,
};
