import { useState } from 'react';
import Menu from './components/Menu';
import Game from './components/Game';
import Creditos from './components/Creditos';
import './index.css';

export default function App() {
  const [estado, setEstado] = useState<'menu' | 'jogo' | 'creditos'>('menu');
  const [dificuldade, setDificuldade] = useState<string>('Fácil');

  const [tempoFinal, setTempoFinal] = useState<number>(0);
  const [saltosFinais, setSaltosFinais] = useState<number>(0);
  const [foiGameOver, setFoiGameOver] = useState<boolean>(false);

  const iniciarJogo = (nivel: string) => {
    setDificuldade(nivel);
    setEstado('jogo');
  };

  const voltarAoMenu = () => {
    setEstado('menu');
  };

  const finalizarJogo = (tempoRestante: number, saltos: number, gameOver: boolean) => {
    setTempoFinal(tempoRestante);
    setSaltosFinais(saltos);
    setFoiGameOver(gameOver);
    setEstado('creditos');
  };

  return (
    <>
      {estado === 'menu' && <Menu iniciarJogo={iniciarJogo} />}

      {estado === 'jogo' && (
        <Game
          dificuldade={dificuldade}
          voltarMenu={voltarAoMenu}
          encerrar={finalizarJogo} 
        />
      )}

      {estado === 'creditos' && (
        <Creditos
          voltar={voltarAoMenu}
          tempoRestante={tempoFinal}
          saltos={saltosFinais}
          gameOver={foiGameOver}
        />
      )}
    </>
  );
}
