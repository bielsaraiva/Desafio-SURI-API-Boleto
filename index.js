const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ANTES: O JSON estava escrito aqui dentro.
// AGORA: Carregamos o arquivo database.json para a variável boletosDB
const boletosDB = require('./database.json');

// Endpoint para buscar a lista de boletos pelo CPF 
app.get('/boletos/:cpf', (req, res) => {
  const cpf = req.params.cpf;
  const boletosDoCliente = boletosDB[cpf];

  if (boletosDoCliente) {
    res.json(boletosDoCliente);
  } else {
    // Caso o CPF não seja encontrado na base 
    res.status(404).json({ erro: "CPF não encontrado." });
  }
});

// Endpoint para retornar os dados de um boleto específico (o link do PDF) 
app.get('/boleto/:id', (req, res) => {
  const boletoId = req.params.id;
  let boletoEncontrado = null;

  // Procura o boleto em todos os CPFs do "banco de dados"
  for (const cpf in boletosDB) {
    const boleto = boletosDB[cpf].find(b => b.id === boletoId);
    if (boleto) {
      boletoEncontrado = boleto;
      break;
    }
  }

  if (boletoEncontrado) {
    res.json({ url: boletoEncontrado.link_pdf });
  } else {
    res.status(404).json({ erro: "Boleto não encontrado." });
  }
});

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});