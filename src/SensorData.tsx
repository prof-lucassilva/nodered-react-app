import React, { useState, useEffect } from 'react';

const SensorData: React.FC = () => {
  // Estado para armazenar os dados do sensor
  const [sensorData, setSensorData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Função para buscar os dados da API ou usar o localStorage
    const fetchData = async () => {
      try {
        // Verifica se já temos dados no localStorage
        const savedData = localStorage.getItem('sensorData');
        
        if (savedData) {
          // Se os dados existirem, carrega do localStorage
          setSensorData(JSON.parse(savedData));
          setLoading(false);
        } else {
          // Se não houver dados, faz a requisição para a API
          const response = await fetch('https://nodered-react-app.vercel.app/api/receiveData');
          if (response.ok) {
            const data = await response.json();
            setSensorData(data);
            localStorage.setItem('sensorData', JSON.stringify(data)); // Salva os dados no localStorage
          } else {
            throw new Error('Erro ao buscar dados');
          }
          setLoading(false);
        }
      } catch (error: unknown) {
        // Verifica se o erro tem a propriedade 'message'
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Erro desconhecido');
        }
        setLoading(false);
      }
    };

    fetchData();
  }, []); // O array vazio [] garante que isso só aconteça uma vez, quando o componente for montado

  // Se estiver carregando, mostra uma mensagem de loading
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Se houver erro, exibe a mensagem de erro
  if (error) {
    return <div>Erro: {error}</div>;
  }

  // Exibe os dados do sensor
  return (
    <div>
      <h1>Dados do Sensor</h1>
      <p><strong>Descrição:</strong> {sensorData?.message}</p>
    </div>
  );
};

export default SensorData;