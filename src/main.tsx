import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import React from 'react'
import store from '../store.ts'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider >
      <App />
    </Provider>
  </React.StrictMode>,
);
