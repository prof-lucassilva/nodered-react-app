// Importação de tipos para as requisições e respostas HTTP da Vercel
// `VercelRequest` e `VercelResponse` são interfaces específicas para lidar com funções serverless na Vercel.
import { VercelRequest, VercelResponse } from '@vercel/node';
// Importa o pacote mysql2/promise para trabalhar com conexões assíncronas ao MySQL.
import mysql from 'mysql2/promise';

// Configuração do banco de dados
// Aqui configuramos os detalhes de conexão ao banco, como host, usuário, senha e nome do banco.
const dbConfig = {
  host: 'db4free.net', // Endereço do servidor MySQL
  port: 3306,          // Porta padrão do MySQL
  user: 'lucas_silva',
  password: 'pi04d688',
  database: 'localhostlucas_s',
  connectTimeout: 10000, // Tempo limite para conexão em milissegundos
};

// Função principal exportada como handler para ser utilizada na Vercel
// Essa função será executada automaticamente quando a rota correspondente for chamada.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verifica o método HTTP da requisição (GET para buscar dados)
  if (req.method === 'GET') {
    try {
      // Cria uma conexão com o banco de dados usando a configuração definida.
      const connection = await mysql.createConnection(dbConfig);
      
      // Executa uma consulta SQL para buscar todos os registros na tabela "dados".
      const [rows] = await connection.execute('SELECT * FROM dados');
      
      // Fecha a conexão com o banco após a execução.
      await connection.end();
      
      // Retorna os dados encontrados no formato JSON com status 200 (sucesso).
      return res.status(200).json({ dados: rows });
      
    } catch (error) {
      // Em caso de erro, loga no console e retorna uma mensagem com status 500 (erro interno).
      console.error('Erro ao buscar dados:', error);
      return res.status(500).json({ message: 'Erro ao buscar dados do banco' });
    }
  }
  
  // Verifica se o método HTTP é POST (para armazenar dados)
  if (req.method === 'POST') {
    const data = req.body; // Captura o corpo da requisição, que deve conter os dados a serem armazenados.

    try {
      // Validação básica para garantir que os dados recebidos são válidos.
      if (!data || typeof data !== 'object') {
        return res.status(400).json({ message: 'Dados inválidos' }); // Retorna erro 400 se inválidos.
      }

      // Conecta ao banco de dados.
      const connection = await mysql.createConnection(dbConfig);

      // Itera sobre cada par de chave-valor no objeto `data` recebido.
      for (const [atributo, valor] of Object.entries(data)) {
        // Define a consulta SQL para inserir os dados na tabela "dados".
        const query = 'INSERT INTO dados (atributo, valor) VALUES (?, ?)';
        // Executa a inserção com os valores fornecidos.
        await connection.execute(query, [atributo, valor]);
      }

      // Retorna uma mensagem de sucesso com status 200.
      res.status(200).json({ message: 'Dados armazenados com sucesso!' });

      // Fecha a conexão com o banco de dados.
      await connection.end();
    } catch (error) {
      // Em caso de erro, loga no console e retorna erro 500.
      console.error('Erro ao armazenar dados:', error);
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  } 
  
  // Para deletar um dado
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: 'ID não fornecido' });
    }
  
    try {
      const connection = await mysql.createConnection(dbConfig);
  
      const [result] = await connection.execute<mysql.OkPacket>(
        'DELETE FROM dados WHERE id = ?',
        [id]
      );
  
      await connection.end();
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Registro não encontrado' });
      }
  
      return res.status(200).json({ message: 'Registro deletado com sucesso!' });
    } catch (error) {
      console.error('Erro ao deletar registro:', error);
      return res.status(500).json({ message: 'Erro ao deletar registro' });
    }
  }

  // Caso o método HTTP não seja GET ou POST, retorna erro 405 (método não permitido).
  else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}