import { useState, useEffect } from 'react';
import { Trash } from 'lucide-react';
import './index.css';

function App() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/receiveData', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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

  // função para deletar o dado
  
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="lista-container">
      <div className="lista-card">
        <header className="lista-header">
          <div className="titulo-grupo">
            <h1 className="lista-titulo">Dados Recebidos</h1>
          </div>
          <div>
            <button
              onClick={fetchData}
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Atualizar Dados'}
            </button>
          </div>
        </header>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {data.length > 0 ? (
          <ul className="dados-grid">
            {data.map((item, index) => (
              <li key={index} className="dado-card">
                <div className="dado-info">
                  <p className="dado-atributo">{item.atributo}</p>
                  <p className="dado-valor">{item.valor}</p>
                </div>
                <button
                    className="dado-delete-btn"
                    // onClick={() => handleDelete(item.id)}
                    aria-label="Deletar"
                  >
                    <Trash size={20} />
                  </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="sem-resultados">Nenhum dado encontrado</p>
        )}
      </div>
    </div>
  );
}

export default App;