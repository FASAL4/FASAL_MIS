import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// DEFAULT ROUTE = the redesigned dashboard (src/redesign). This is deliberate and
// was confirmed by the project owner on 2026-11-10; it is not an integration bug.
// The previous UI is kept and served from /legacy.html (src/legacy-main.tsx).
import './redesign/redesign.css';
import App from './redesign/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
