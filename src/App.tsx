import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState<string>(''); // Estado para armazenar os dados do sensor
  const [loading, setLoading] = useState<boolean>(false); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Estado de erro

  // Função para buscar os dados da API
  const handleReceiveData = async () => {
    setLoading(true);
    try {
      const dataToSend = { campo1: 'valor1', campo2: 'valor2' }; // Exemplo de dados

      const response = await fetch('/api/receiveData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend), // Dados enviados ao backend
      });

      const result = await response.json();
      console.log('Resposta da API:', result);
      setData(result.message);

      // Armazena os dados recebidos no localStorage
      localStorage.setItem('sensorData', JSON.stringify(result));
    } catch (error) {
      setError('Erro ao enviar informações');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };


  // Verifica se há dados no localStorage quando o componente é montado
  useEffect(() => {
    const savedData = localStorage.getItem('sensorData');
    if (savedData) {
      setData(JSON.parse(savedData).message); // Carrega os dados do localStorage
    }
  }, []);

  return (
    <div>
      <h1>Recebendo Dados do Node-RED</h1>
      <button onClick={handleReceiveData} disabled={loading}>
        {loading ? 'Carregando...' : 'Receber Dados'}
      </button>

      {/* Exibe mensagem de erro se houver */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Exibe os dados recebidos */}
      {data && <p>{data}</p>}
    </div>
  );
}

export default App;