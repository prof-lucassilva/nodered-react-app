import { useState, useEffect } from 'react';
import { Trash } from 'lucide-react';
import './index.css';

function App() {
  // Define o estado `data` para armazenar os dados recebidos do servidor.
  const [data, setData] = useState<any[]>([]);
  // Define o estado `loading` para indicar se os dados estão sendo carregados.
  const [loading, setLoading] = useState<boolean>(false);
  // Define o estado `error` para armazenar mensagens de erro caso ocorram.
  const [error, setError] = useState<string | null>(null);

  // Função assíncrona para buscar os dados da API.
  const fetchData = async () => {
    setLoading(true); // Define o estado `loading` como `true` para indicar que o carregamento está em andamento.
    try {
      // Faz uma requisição GET para a rota `/api/receiveData`.
      const response = await fetch('/api/receiveData', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Especifica o tipo de conteúdo da requisição.
        },
      });

      // Converte a resposta para JSON.
      const result = await response.json();
      // Atualiza o estado `data` com os dados recebidos.
      setData(result.dados);
      // Reseta o estado `error` caso tenha ocorrido algum erro anteriormente.
      setError(null);
    } catch (error) {
      // Caso ocorra um erro, define o estado `error` com uma mensagem apropriada.
      setError('Erro ao buscar dados do banco');
      console.error('Erro:', error); // Loga o erro no console para depuração.
    } finally {
      // Define o estado `loading` como `false`, indicando que o carregamento foi concluído.
      setLoading(false);
    }
  };

  // Função para deletar o dado
  const handleDelete = async (id: number) => {
    try {
      const url = `/api/receiveData?id=${id}`;
      console.log("URL de DELETE:", url);
  
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log("Resposta do servidor:", response);
  
      if (!response.ok) {
        throw new Error('Erro ao deletar item');
      }
  
      // Atualiza os dados localmente após o sucesso
      setData((prevData) => prevData.filter((item) => item.id !== id));
      console.log("Item deletado com sucesso!");
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      setError('Erro ao deletar item');
    }
  };

  // Hook `useEffect` para buscar os dados assim que o componente for montado.
  useEffect(() => {
    fetchData(); // Chama a função `fetchData` uma única vez quando o componente é renderizado.
  }, []); // O array vazio garante que o efeito seja executado apenas na montagem do componente.

  return (
    // Container principal da aplicação com classe `lista-container`.
    <div className="lista-container">
      <div className="lista-card">
        <header className="lista-header">
          <div className="titulo-grupo">
            {/* Título da lista */}
            <h1 className="lista-titulo">Dados Recebidos</h1>
          </div>
          <div>
            {/* Botão para atualizar os dados manualmente */}
            <button
              onClick={fetchData} // Chama a função `fetchData` ao clicar no botão.
              disabled={loading} // Desabilita o botão enquanto os dados estão sendo carregados.
            >
              {loading ? 'Carregando...' : 'Atualizar Dados'} {/* Texto muda com base no estado `loading`. */}
            </button>
          </div>
        </header>

        {/* Exibe a mensagem de erro, se houver. */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Verifica se há dados para exibir. */}
        {data.length > 0 ? (
          // Renderiza a lista de dados como um grid.
          <ul className="dados-grid">
            {data.map((item, index) => (
              <li key={index} className="dado-card">
                <div className="dado-info">
                  {/* Exibe o atributo e valor de cada item recebido. */}
                  <p className="dado-atributo">{item.atributo}</p>
                  <p className="dado-valor">{item.valor}</p>
                </div>
                {/* Botão para deletar o item. */}
                <button
                  className="dado-delete-btn"
                  onClick={() => handleDelete(item.id)}
                  aria-label="Deletar" // Adiciona um rótulo acessível ao botão.
                >
                  <Trash size={20} /> {/* Ícone de lixeira para o botão de exclusão. */}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          // Exibe uma mensagem caso não haja dados disponíveis.
          <p className="sem-resultados">Nenhum dado encontrado</p>
        )}
      </div>
    </div>
  );
}

export default App;