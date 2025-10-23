import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { initLogger } from '@/utils/logger';

initLogger();

const root = document.getElementById('root') as HTMLElement;

ReactDOM
  .createRoot(root)
  .render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
