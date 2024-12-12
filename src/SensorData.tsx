import React, { useState, useEffect } from 'react';

const SensorData: React.FC = () => {
  // Estados para armazenar os dados, status de carregamento e possíveis erros
  const [sensorData, setSensorData] = useState<{ message: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Função para buscar dados do localStorage ou da API
    const fetchData = async () => {
      try {
        // Verifica se há dados armazenados no localStorage
        const savedData = localStorage.getItem('sensorData');
        if (savedData) {
          // Tenta carregar os dados do localStorage
          const parsedData = JSON.parse(savedData);
          if (parsedData?.message) {
            setSensorData(parsedData);
          } else {
            throw new Error('Dados inválidos no localStorage');
          }
        } else {
          // Faz a requisição à API se não houver dados no localStorage
          const response = await fetch('/api/receiveData');
          if (!response.ok) {
            throw new Error('Erro ao buscar dados da API');
          }

          const data = await response.json();
          if (data?.message) {
            setSensorData(data);
            localStorage.setItem('sensorData', JSON.stringify(data)); // Armazena os dados no localStorage
          } else {
            throw new Error('Resposta inválida da API');
          }
        }
      } catch (err: unknown) {
        // Captura e trata erros
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Erro desconhecido');
        }
      } finally {
        setLoading(false); // Finaliza o estado de carregamento
      }
    };

    fetchData();
  }, []); // O array vazio garante que o efeito seja executado apenas uma vez

  // Renderização condicional com base no estado da aplicação
  return (
    <div>
      <h1>Dados do Sensor</h1>

      {/* Mostra uma mensagem de carregamento */}
      {loading && <p>Carregando...</p>}

      {/* Exibe mensagem de erro, caso exista */}
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}

      {/* Exibe os dados do sensor se disponíveis */}
      {!loading && !error && sensorData && (
        <p>
          <strong>Dados recebidos:</strong> {sensorData.message}
        </p>
      )}

      {/* Caso não haja dados, exibe mensagem informativa */}
      {!loading && !error && !sensorData && <p>Nenhum dado disponível no momento.</p>}
    </div>
  );
};

export default SensorData;