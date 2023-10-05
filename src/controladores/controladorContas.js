const bancoDeDados = require('../bancodedados');

// Listar todas as contas bancárias
const listarContas = (req, res) => {
  const { senha_banco } = req.query;

  // Verifique se a senha do banco foi informada e é válida
  if (!senha_banco || senha_banco !== bancoDeDados.banco.senha) {
    return res.status(400).json({ mensagem: 'A senha do banco informada é inválida!' });
  }

  // Retorna a lista de contas bancárias
  res.json(bancoDeDados.contas);
};

// Criar uma nova conta bancária
const criarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  // Verifique se todos os campos foram informados
  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' });
  }

  // Verifique se já existe uma conta com o mesmo CPF ou e-mail
  const contaExistente = bancoDeDados.contas.find(
    (conta) => conta.usuario.cpf === cpf || conta.usuario.email === email
  );

  if (contaExistente) {
    return res.status(400).json({ mensagem: 'Já existe uma conta com o mesmo CPF ou e-mail informado!' });
  }

  // Crie uma nova conta
  const novaConta = {
    numero: (bancoDeDados.contas.length + 1).toString(), // Gere um número único para a nova conta
    saldo: 0, // Saldo inicial
    usuario: {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha,
    },
  };

  // Adicione a nova conta ao array de contas
  bancoDeDados.contas.push(novaConta);

  res.status(201).end();
};

// Atualizar dados do usuário de uma conta bancária
const atualizarUsuario = (req, res) => {
  const { numeroConta } = req.params;
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  // Encontre a conta com o número informado
  const conta = bancoDeDados.contas.find((conta) => conta.numero === numeroConta);

  if (!conta) {
    return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
  }

  // Verifique se todos os campos foram informados
  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' });
  }

  // Verifique se o CPF informado já existe cadastrado em outra conta
  const cpfExistente = bancoDeDados.contas.find((conta) => conta.usuario.cpf === cpf && conta.numero !== numeroConta);

  if (cpfExistente) {
    return res.status(400).json({ mensagem: 'O CPF informado já existe cadastrado!' });
  }

  // Atualize os dados do usuário da conta
  conta.usuario = {
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha,
  };

  res.status(204).end();
};

// Excluir uma conta bancária
const excluirConta = (req, res) => {
  const { numeroConta } = req.params;

  // Encontre a conta com o número informado
  const contaIndex = bancoDeDados.contas.findIndex((conta) => conta.numero === numeroConta);

  if (contaIndex === -1) {
    return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
  }

  // Verifique se o saldo da conta é zero para permitir a exclusão
  if (bancoDeDados.contas[contaIndex].saldo !== 0) {
    return res.status(400).json({ mensagem: 'A conta só pode ser removida se o saldo for zero!' });
  }

  // Remova a conta do array de contas
  bancoDeDados.contas.splice(contaIndex, 1);

  res.status(204).end();
};

// Consultar saldo de uma conta bancária
const consultarSaldo = (req, res) => {
  const { numero_conta, senha } = req.query;

  // Encontre a conta com o número informado
  const conta = bancoDeDados.contas.find((conta) => conta.numero === numero_conta);

  if (!conta) {
    return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
  }

  // Verifique se a senha informada é válida para a conta
  if (senha !== conta.usuario.senha) {
    return res.status(401).json({ mensagem: 'Senha inválida!' });
  }

  // Retorne o saldo da conta
  res.status(200).json({ saldo: conta.saldo });
};

// Emitir extrato de uma conta bancária
const emitirExtrato = (req, res) => {
  const { numero_conta, senha } = req.query;

  // Encontre a conta com o número informado
  const conta = bancoDeDados.contas.find((conta) => conta.numero === numero_conta);

  if (!conta) {
    return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
  }

  // Verifique se a senha informada é válida para a conta
  if (senha !== conta.usuario.senha) {
    return res.status(401).json({ mensagem: 'Senha inválida!' });
  }

  // Consulte o histórico de transações da conta
  const extrato = {
    depositos: bancoDeDados.depositos.filter((deposito) => deposito.numero_conta === numero_conta),
    saques: bancoDeDados.saques.filter((saque) => saque.numero_conta === numero_conta),
    transferenciasEnviadas: bancoDeDados.transferencias.filter(
      (transferencia) => transferencia.numero_conta_origem === numero_conta
    ),
    transferenciasRecebidas: bancoDeDados.transferencias.filter(
      (transferencia) => transferencia.numero_conta_destino === numero_conta
    ),
  };

  // Retorne o extrato da conta
  res.status(200).json(extrato);
};

module.exports = {
  listarContas,
  criarConta,
  atualizarUsuario,
  excluirConta,
  consultarSaldo, 
  emitirExtrato, 
};