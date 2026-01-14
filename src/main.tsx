import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Development-only: expose seed function for testing
if (import.meta.env.DEV) {
  import('./utils/seedData').then(({ seedLocalStorage }) => {
    (window as unknown as { seedData: typeof seedLocalStorage }).seedData = seedLocalStorage;

    // Auto-seed if no entries exist (dev only)
    const existingEntries = localStorage.getItem('did-you-move-entries');
    if (!existingEntries || JSON.parse(existingEntries).length === 0) {
      seedLocalStorage();
      console.log('Auto-seeded test data for the past month');
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
