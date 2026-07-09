
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx' // 👈 Importamos el proveedor

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> {/* 👈 Envolvemos la app */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
)