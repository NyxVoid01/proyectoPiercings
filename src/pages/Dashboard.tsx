
// src/pages/Dashboard.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { usuario, logout } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f4f6f9' }}>
      {/* BARRA LATERAL (SIDEBAR) */}
      <aside style={{ width: '250px', backgroundColor: '#1e1e2f', color: 'white', padding: '20px' }}>
        <h2>Ink & Needle 💉</h2>
        <p style={{ fontSize: '14px', color: '#a0a0b0' }}>Sesión: {usuario?.nombre}</p>
        <span style={{ fontSize: '12px', background: '#4e4eff', padding: '3px 8px', borderRadius: '10px' }}>
          {usuario?.rol.toUpperCase()}
        </span>
        
        <nav style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🏠 Inicio</Link>
          <Link to="/clientes" style={{ color: '#d0d0d0', textDecoration: 'none' }}>👥 Gestión de Clientes</Link>
          <Link to="/inventario" style={{ color: '#d0d0d0', textDecoration: 'none' }}>📦 Inventario de Insumos</Link>
        </nav>

        <button 
          onClick={logout} 
          style={{ marginTop: 'auto', width: '100%', padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Cerrar Sesión
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, padding: '30px' }}>
        <h1>Panel de Control</h1>
        <p>Bienvenido al sistema de gestión interna del estudio de perforaciones.</p>

        <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
          <div style={{ flex: 1, background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>Módulo Clientes</h3>
            <p>Registra nuevos clientes,zonas de perforación y fichas de consentimiento de alergias.</p>
            <Link to="/clientes" style={{ color: '#007bff', fontWeight: 'bold' }}>Ir a Clientes →</Link>
          </div>
          <div style={{ flex: 1, background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>Módulo Inventario</h3>
            <p>Controla el stock crítico de joyas (Titanio, Acero quirúrgico) y catéteres.</p>
            <Link to="/inventario" style={{ color: '#007bff', fontWeight: 'bold' }}>Ir a Inventario →</Link>
          </div>
        </div>
      </main>
    </div>
  );
};