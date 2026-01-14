import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { seedLocalStorage } from './utils/seedData';

// Expose seed function to window for easy testing
// Run `seedData()` in browser console to add test entries
(window as unknown as { seedData: typeof seedLocalStorage }).seedData = seedLocalStorage;

// Auto-seed if no entries exist
const existingEntries = localStorage.getItem('did-you-move-entries');
if (!existingEntries || JSON.parse(existingEntries).length === 0) {
  seedLocalStorage();
  console.log('Auto-seeded test data for the past month');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
