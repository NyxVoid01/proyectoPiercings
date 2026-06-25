
// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  
  // Estados para contar datos reales del localStorage
  const [totalCitas, setTotalCitas] = useState(0);
  const [insumosBajos, setInsumosBajos] = useState(0);
  const [proximasCitas, setProximasCitas] = useState<any[]>([]);

  useEffect(() => {
    // 1. Cargar y contar citas reales
    const citasRaw = localStorage.getItem('ink_needle_citas_crud');
    if (citasRaw) {
      const listaCitas = JSON.parse(citasRaw);
      setTotalCitas(listaCitas.length);
      // Tomar las primeras 3 para mostrar en la tabla de inicio
      setProximasCitas(listaCitas.slice(0, 3));
    }

    // 2. Cargar inventario y contar alertas de stock bajo (<= 15 unidades)
    const inventarioRaw = localStorage.getItem('ink_needle_servicios_crud');
    if (inventarioRaw) {
      const listaInv = JSON.parse(inventarioRaw);
      const alertas = listaInv.filter((item: any) => item.stockInsumo <= 15);
      setInsumosBajos(alertas.length);
    }
  }, []);

  const handleCerrarSesion = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121214', color: '#e1e1e6', fontFamily: 'sans-serif' }}>
      {/* SIDEBAR DEL ESTUDIO */}
      <div style={{ width: '260px', backgroundColor: '#1a1a1e', borderRight: '1px solid #29292e', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', marginBottom: '40px', letterSpacing: '1px' }}>
          INK & <span style={{ color: '#e50914' }}>NEEDLE</span>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/dashboard" style={{ padding: '12px 15px', color: '#ffffff', backgroundColor: '#29292e', textDecoration: 'none', borderRadius: '6px', borderLeft: '4px solid #e50914', fontWeight: 'bold' }}>Panel Principal</Link>
          <Link to="/citas" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none', borderRadius: '6px', fontWeight: 'medium' }}>📅 Agenda de Citas</Link>
          <Link to="/clientes" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none', borderRadius: '6px', fontWeight: 'medium' }}>👥 Fichas Clínicas</Link>
          <Link to="/inventario" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none', borderRadius: '6px', fontWeight: 'medium' }}>📦 Catálogo e Inventario</Link>
        </nav>

        <button onClick={handleCerrarSesion} style={{ marginTop: 'auto', padding: '10px', backgroundColor: '#e50914', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          🚪 Cerrar Sesión
        </button>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #29292e', paddingBottom: '15px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#fff' }}>Resumen Operativo del Estudio</h1>
          <div style={{ fontSize: '14px', color: '#c4c4cc', backgroundColor: '#202024', padding: '8px 15px', borderRadius: '20px', border: '1px solid #29292e' }}>
            ⚡ Staff Activo: <strong style={{ color: '#fff' }}>{usuario?.nombre || 'Administrador'}</strong>
          </div>
        </div>

        {/* TARJETAS DE INDICADORES EN TIEMPO REAL */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ backgroundColor: '#1a1a1e', border: '1px solid #29292e', borderRadius: '8px', padding: '20px' }}>
            <h3 style={{ fontSize: '13px', color: '#7c7c8a', textTransform: 'uppercase', marginBottom: '10px' }}>Total Turnos</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffffff' }}>{totalCitas} Agendados</div>
          </div>
          <div style={{ backgroundColor: '#1a1a1e', border: '1px solid #29292e', borderRadius: '8px', padding: '20px' }}>
            <h3 style={{ fontSize: '13px', color: '#7c7c8a', textTransform: 'uppercase', marginBottom: '10px' }}>Consentimientos</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>100% Digital</div>
          </div>
          <div style={{ backgroundColor: '#1a1a1e', border: insumosBajos > 0 ? '1px solid #feb700' : '1px solid #29292e', borderRadius: '8px', padding: '20px' }}>
            <h3 style={{ fontSize: '13px', color: insumosBajos > 0 ? '#feb700' : '#7c7c8a', textTransform: 'uppercase', marginBottom: '10px' }}>Alertas de Vitrina</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: insumosBajos > 0 ? '#feb700' : '#ffffff' }}>{insumosBajos} Críticos</div>
          </div>
        </div>

        {/* VISTA RÁPIDA DE PRÓXIMOS CLIENTES */}
        <div style={{ backgroundColor: '#1a1a1e', border: '1px solid #29292e', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#fff' }}>Próximas Sesiones en Agenda</h2>
          {proximasCitas.length === 0 ? (
            <p style={{ color: '#7c7c8a' }}>No hay citas registradas actualmente en el sistema.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #29292e' }}>
                  <th style={{ color: '#7c7c8a', fontSize: '12px', paddingBottom: '12px', textTransform: 'uppercase' }}>Cliente</th>
                  <th style={{ color: '#7c7c8a', fontSize: '12px', paddingBottom: '12px', textTransform: 'uppercase' }}>Perforación</th>
                  <th style={{ color: '#7c7c8a', fontSize: '12px', paddingBottom: '12px', textTransform: 'uppercase' }}>Fecha / Hora</th>
                  <th style={{ color: '#7c7c8a', fontSize: '12px', paddingBottom: '12px', textTransform: 'uppercase' }}>Profesional</th>
                </tr>
              </thead>
              <tbody>
                {proximasCitas.map((cita) => (
                  <tr key={cita.id} style={{ borderBottom: '1px solid #202024' }}>
                    <td style={{ padding: '12px 0', fontSize: '14px', color: '#fff', fontWeight: 'bold' }}>{cita.cliente}</td>
                    <td style={{ padding: '12px 0', fontSize: '14px', color: '#c4c4cc' }}>{cita.tipoPerforacion}</td>
                    <td style={{ padding: '12px 0', fontSize: '14px', color: '#c4c4cc' }}>{cita.fecha} a las {cita.hora}</td>
                    <td style={{ padding: '12px 0', fontSize: '14px', color: '#e50914' }}>{cita.personaEncargada}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};