import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  
  const [totalCitas, setTotalCitas] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [proximasCitas, setProximasCitas] = useState<any[]>([]);

  useEffect(() => {
    const citasRaw = localStorage.getItem('ink_needle_citas_crud');
    if (citasRaw) {
      const listaCitas = JSON.parse(citasRaw);
      setTotalCitas(listaCitas.length);
      setProximasCitas(listaCitas.slice(0, 3));
    }

    const clientesRaw = localStorage.getItem('ink_needle_clientes_crud');
    if (clientesRaw) {
      setTotalClientes(JSON.parse(clientesRaw).length);
    }
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'left' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
        <div>
          <h1 style={{ color: 'var(--text-h)', margin: 0 }}>Panel de Control</h1>
          <p style={{ color: 'var(--text)', margin: '5px 0 0 0' }}>Bienvenido de vuelta, <strong>{usuario?.nombre}</strong> ({usuario?.rol})</p>
        </div>
        <button onClick={logout} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Cerrar Sesión
        </button>
      </header>

      {/* Navegación Interna */}
      <nav style={{ marginBottom: '30px', display: 'flex', gap: '15px' }}>
        <Link to="/citas" style={{ color: '#fff', background: 'var(--accent)', padding: '10px 15px', borderRadius: '6px', textDecoration: 'none', fontWeight: '500' }}>📅 Citas</Link>
        <Link to="/clientes" style={{ color: '#fff', background: 'var(--accent)', padding: '10px 15px', borderRadius: '6px', textDecoration: 'none', fontWeight: '500' }}>📋 Fichas de Clientes</Link>
        <Link to="/servicios" style={{ color: '#fff', background: 'var(--accent)', padding: '10px 15px', borderRadius: '6px', textDecoration: 'none', fontWeight: '500' }}>💎 Servicios</Link>
      </nav>

      {/* Tarjetas de Indicadores */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'var(--code-bg)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: 'var(--text)' }}>Citas Agendadas</h3>
          <p style={{ fontSize: '36px', margin: 0, fontWeight: 'bold', color: 'var(--accent)' }}>{totalCitas}</p>
        </div>
        <div style={{ background: 'var(--code-bg)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: 'var(--text)' }}>Clientes Registrados</h3>
          <p style={{ fontSize: '36px', margin: 0, fontWeight: 'bold', color: 'var(--accent)' }}>{totalClientes}</p>
        </div>
      </div>

      {/* Tabla de Próximas Atenciones */}
      <h3 style={{ color: 'var(--text-h)', marginBottom: '15px' }}>Próximas Atenciones del Estudio</h3>
      <div style={{ background: 'var(--code-bg)', border: '1px solid var(--border)', padding: '20px', borderRadius: '8px' }}>
        {proximasCitas.length === 0 ? (
          <p style={{ color: 'var(--text)' }}>No hay atenciones registradas en la agenda.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ color: 'var(--text)', paddingBottom: '10px' }}>Cliente</th>
                <th style={{ color: 'var(--text)', paddingBottom: '10px' }}>Procedimiento</th>
                <th style={{ color: 'var(--text)', paddingBottom: '10px' }}>Horario</th>
              </tr>
            </thead>
            <tbody>
              {proximasCitas.map((cita) => (
                <tr key={cita.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 0', color: 'var(--text-h)', fontWeight: 'bold' }}>{cita.cliente}</td>
                  <td style={{ padding: '12px 0', color: 'var(--text)' }}>{cita.tipoPerforacion}</td>
                  <td style={{ padding: '12px 0', color: 'var(--text)' }}>{cita.fecha} - {cita.hora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
