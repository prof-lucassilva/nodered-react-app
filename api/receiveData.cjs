module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const data = req.body;
      res.status(200).json({ message: `Dados recebidos: ${JSON.stringify(data)}` });
    } else {
      res.status(405).json({ message: 'Método não permitido. Use POST.' });
    }
  } catch (error) {
    console.error('Erro no handler:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};