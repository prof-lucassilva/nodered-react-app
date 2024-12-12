import { useState } from 'react';

function App() {
  const [data, setData] = useState<string>('');

  const handleReceiveData = async () => {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result.message);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  return (
    <div>
      <h1>Recebendo Dados do Node-RED</h1>
      <button onClick={handleReceiveData}>Receber Dados</button>
      <p>{data}</p>
    </div>
  );
}

export default App;