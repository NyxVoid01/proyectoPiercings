
// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { usuario, logout } = useAuth();
  const [metricas, setMetricas] = useState({
    totalCitas: 0,
    citasPendientes: 0,
    insumosBajos: 0
  });

  useEffect(() => {
    // Leer en tiempo real las citas e inventario creados en los módulos
    const citas = JSON.parse(localStorage.getItem('ink_needle_citas') || '[]');
    const inventario = JSON.parse(localStorage.getItem('ink_needle_inventario') || '[]');

    // Calcular KPI administrativos
    const pendientes = citas.filter((c: any) => c.estado === 'Pendiente').length;
    const bajos = inventario.filter((i: any) => i.stock <= 15).length;

    setMetricas({
      totalCitas: citas.length,
      citasPendientes: pendientes,
      insumosBajos: bajos
    });
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Menú Lateral Cohesivo */}
      <div style={{ width: '250px', backgroundColor: '#1e1e2f', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ letterSpacing: '1px' }}>Ink & Needle</h3>
          <p style={{ fontSize: '13px', color: '#a0a0b0', marginBottom: '30px' }}>Bienvenido, {usuario?.nombre}</p>
          
          <Link to="/dashboard" style={{ color: '#007bff', display: 'block', marginBottom: '15px', textDecoration: 'none', fontWeight: 'bold' }}>🏠 Panel Principal</Link>
          <Link to="/citas" style={{ color: '#d0d0d0', display: 'block', marginBottom: '15px', textDecoration: 'none' }}>📅 Agenda de Citas</Link>
          <Link to="/inventario" style={{ color: '#d0d0d0', display: 'block', marginBottom: '15px', textDecoration: 'none' }}>📦 Inventario de Joyas</Link>
          <Link to="/clientes" style={{ color: '#d0d0d0', display: 'block', marginBottom: '15px', textDecoration: 'none' }}>👥 Gestión de Clientes</Link>
        </div>
        
        <button onClick={logout} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          🚪 Cerrar Sesión
        </button>
      </div>

      {/* Contenido de Control */}
      <main style={{ flex: 1, padding: '30px', backgroundColor: '#f4f6f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h2 style={{ margin: 0 }}>Studio Manager — Control General</h2>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>Resumen operativo de la tienda de perforaciones.</p>
          </div>
          <span style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 15px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
            🟢 Estudio Conectado
          </span>
        </div>

        {/* Indicadores Clave en Tiempo Real (Métricas) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          
          {/* Tarjeta Citas Pendientes */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '5px solid #ffc107' }}>
            <p style={{ color: '#888', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '11px', fontWeight: 'bold' }}>Citas por Confirmar Abono</p>
            <h3 style={{ fontSize: '36px', margin: 0, color: '#333' }}>{metricas.citasPendientes}</h3>
            <Link to="/citas" style={{ fontSize: '12px', color: '#007bff', textDecoration: 'none', display: 'block', marginTop: '10px' }}>Revisar solicitudes de clientes →</Link>
          </div>

          {/* Tarjeta Alertas Stock */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '5px solid #dc3545' }}>
            <p style={{ color: '#888', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '11px', fontWeight: 'bold' }}>Joyas / Insumos Críticos</p>
            <h3 style={{ fontSize: '36px', margin: 0, color: '#333' }}>{metricas.insumosBajos}</h3>
            <Link to="/inventario" style={{ fontSize: '12px', color: '#007bff', textDecoration: 'none', display: 'block', marginTop: '10px' }}>Ver alertas de stock bajo →</Link>
          </div>

          {/* Tarjeta Total Operaciones */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '5px solid #28a745' }}>
            <p style={{ color: '#888', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '11px', fontWeight: 'bold' }}>Total Historial Citas</p>
            <h3 style={{ fontSize: '36px', margin: 0, color: '#333' }}>{metricas.totalCitas}</h3>
            <Link to="/citas" style={{ fontSize: '12px', color: '#007bff', textDecoration: 'none', display: 'block', marginTop: '10px' }}>Ver bitácora del mes →</Link>
          </div>

        </div>

        {/* Panel de Accesos Rápidos */}
        <div style={{ background: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '10px' }}>⚡ Flujo de Trabajo Técnico</h3>
          <p style={{ color: '#555', fontSize: '14px' }}>Accede rápidamente a los módulos actualizados con tu catálogo:</p>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '20px' }}>
            <Link to="/citas" style={{ backgroundColor: '#007bff', color: 'white', padding: '12px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
              📅 Validar y Asignar Citas
            </Link>
            <Link to="/inventario" style={{ backgroundColor: '#6c757d', color: 'white', padding: '12px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
              📦 Abastecer Bodega de Joyería
            </Link>
            <Link to="/clientes" style={{ backgroundColor: '#17a2b8', color: 'white', padding: '12px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
              👥 Fichas Clínicas de Clientes
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};