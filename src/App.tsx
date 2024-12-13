import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState<any[]>([]); // Alterado para array
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/receiveData', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      setData(result.dados);
      setError(null);
      
    } catch (error) {
      setError('Erro ao buscar dados do banco');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carrega os dados quando o componente é montado
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Dados Armazenados</h1>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Carregando...' : 'Atualizar Dados'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Lista os dados do banco */}
      {data.length > 0 ? (
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              {item.atributo}, {item.valor}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum dado encontrado</p>
      )}
    </div>
  );
}

export default App;