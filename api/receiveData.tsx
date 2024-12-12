import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const data = req.body;
    res.status(200).json({ message: `Dados recebidos: ${JSON.stringify(data)}` });
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}