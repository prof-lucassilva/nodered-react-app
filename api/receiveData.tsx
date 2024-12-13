import { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'db4free.net',
  port: 3306,
  user: 'lucas_silva',
  password: 'pi04d688',
  database: 'localhostlucas_s',
  connectTimeout: 10000,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const data = req.body;

    try {
      // Conexão ao banco de dados
      const connection = await mysql.createConnection(dbConfig);

      // Verifica se há dados no corpo da requisição
      if (!data || typeof data !== 'object') {
        return res.status(400).json({ message: 'Dados inválidos' });
      }

      // Percorre todas as chaves e valores do JSON recebido
      for (const [atributo, valor] of Object.entries(data)) {
        const query = 'INSERT INTO dados (atributo, valor) VALUES (?, ?)';
        await connection.execute(query, [atributo, valor]);
      }

      // Responde com sucesso
      res.status(200).json({ message: 'Dados armazenados com sucesso!' });

      // Fecha a conexão com o banco de dados
      await connection.end();
    } catch (error) {
      console.error('Erro ao armazenar dados:', error);
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}