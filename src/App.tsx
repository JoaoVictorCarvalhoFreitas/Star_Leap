import { useState } from 'react';
import Menu from './components/Menu';
import Game from './components/Game';
import Creditos from './components/Creditos';

function App() {
  const [estado, setEstado] = useState<'menu' | 'jogo' | 'creditos'>('menu');

  return (
    <>
      {estado === 'menu' && <Menu iniciarJogo={() => setEstado('jogo')} />}
      {estado === 'jogo' && <Game voltarMenu={() => setEstado('menu')} />}
      {estado === 'creditos' && <Creditos voltar={() => setEstado('menu')} />}
    </>
  );
}

export default App;
