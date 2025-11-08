import { App } from '@/app';
import { QueryProvider, ThemeProvider } from '@/app/providers';
import '@/app/styles/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <App />
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>
);
