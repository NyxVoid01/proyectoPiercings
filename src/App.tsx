
// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Clientes } from './pages/Clientes';
import { DetalleCliente } from './pages/DetalleCliente';
import { useAuth } from './context/AuthContext';

function App() {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return <div style={{ padding: '20px' }}>Cargando plataforma...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={!usuario ? <Login /> : <Navigate to="/dashboard" />} />
        
        {/* Rutas Privadas / Protegidas */}
        <Route path="/dashboard" element={usuario ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/clientes" element={usuario ? <Clientes /> : <Navigate to="/login" />} />
        
        {/* 💡 RUTA DINÁMICA CON PARÁMETRO :id */}
        <Route path="/clientes/:id" element={usuario ? <DetalleCliente /> : <Navigate to="/login" />} />

        {/* Ruta comodín */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;