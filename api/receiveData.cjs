module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    res.status(200).json({ message: `Dados recebidos: ${JSON.stringify(data)}` });
  } else {
    res.status(405).json({ message: 'Método não permitido. Use POST.' });
  }
};
