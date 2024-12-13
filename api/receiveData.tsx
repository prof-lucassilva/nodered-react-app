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
  if (req.method === 'GET') {
    try {
      const connection = await mysql.createConnection(dbConfig);
      
      // Consulta para buscar todos os registros
      const [rows] = await connection.execute('SELECT * FROM dados');
      
      await connection.end();
      
      return res.status(200).json({ dados: rows });
      
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      return res.status(500).json({ message: 'Erro ao buscar dados do banco' });
    }
  }
  
  if (req.method === 'POST') {
    const data = req.body;

    try {
      // Validação básica
      if (!data || typeof data !== 'object') {
        return res.status(400).json({ message: 'Dados inválidos' });
      }

      // Conexão ao banco de dados
      const connection = await mysql.createConnection(dbConfig);

      // Inserção no banco
      const query = 'INSERT INTO dados (campo1, campo2) VALUES (?, ?)';
      await connection.execute(query, [data.campo1, data.campo2]);

      // Responder ao cliente
      res.status(200).json({ message: 'Dados armazenados com sucesso!' });

      // Fechar conexão
      await connection.end();
    } catch (error) {
      console.error('Erro ao armazenar dados:', error);
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}