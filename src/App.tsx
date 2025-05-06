import { useState } from 'react';
import Menu from './components/Menu';
import Game from './components/Game';
import Creditos from './components/Creditos';
import './index.css';

export default function App() {
  const [estado, setEstado] = useState<'menu' | 'jogo' | 'creditos'>('menu');
  const [dificuldade, setDificuldade] = useState<string>('Fácil');

  return (
    <>
      {estado === 'menu' && (
        <Menu
          iniciarJogo={(dif) => {
            setDificuldade(dif);
            setEstado('jogo');
          }}
        />
      )}
      {estado === 'jogo' && (
        <Game
          dificuldade={dificuldade}
          voltarMenu={() => setEstado('menu')}
          encerrar={() => setEstado('creditos')}
        />
      )}
      {estado === 'creditos' && (
        <Creditos voltar={() => setEstado('menu')} />
      )}
    </>
  );
}
