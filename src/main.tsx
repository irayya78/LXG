// src/main.tsx
import { createRoot } from 'react-dom/client';
import App from './App';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { BrowserRouter } from 'react-router-dom';
import { SessionManagerProvider } from './sessionManager/SessionManager'

defineCustomElements(window);

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <BrowserRouter>
    <SessionManagerProvider>
      <App />
    </SessionManagerProvider>
  </BrowserRouter>
);
