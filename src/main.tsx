import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// The default route mounts the redesigned dashboard (src/redesign).
// The previous UI is kept and served from /legacy.html (src/legacy-main.tsx).
import './redesign/redesign.css';
import App from './redesign/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
