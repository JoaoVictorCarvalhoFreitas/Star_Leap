import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // Importa estilos globais do Tailwind ou CSS customizado

// Seleciona o elemento root no HTML
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Elemento #root não encontrado no HTML.');
}
