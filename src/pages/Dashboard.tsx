// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Importamos la conexión real a la base de datos
import { db } from '../../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

export const Dashboard: React.FC = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  
  const [totalCitas, setTotalCitas] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [proximasCitas, setProximasCitas] = useState<any[]>([]);

  useEffect(() => {
    // 1. BLINDAJE: Si la pestaña se acaba de abrir y no hay sesión cargada todavía, frenamos.
    if (!usuario) return;

    // ELIMINACIÓN DE DATOS FANTASMA: Limpiamos lo viejo que haya quedado en el navegador
    localStorage.removeItem('ink_needle_citas_crud');
    localStorage.removeItem('ink_needle_clientes_crud');

    // 2. Escuchar Citas desde Firestore en tiempo real para los contadores del Panel
    const qCitas = query(collection(db, 'citas'));
    const desuscribirCitas = onSnapshot(qCitas, (snapshot) => {
      const listaCitas = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTotalCitas(listaCitas.length);
      setProximasCitas(listaCitas.slice(0, 3)); // Muestra las primeras 3 reales
    }, (err) => console.error("Error cargando estadísticas de citas:", err));

    // 3. CONECTADO A FIRESTORE: Ahora los clientes se cuentan desde la base de datos real, no del localStorage
    const qClientes = query(collection(db, 'clientes'));
    const desuscribirClientes = onSnapshot(qClientes, (snapshot) => {
      setTotalClientes(snapshot.size); // snapshot.size nos da el número exacto de documentos en la nube
    }, (err) => console.error("Error cargando estadísticas de clientes:", err));

    // Limpiamos ambas conexiones en tiempo real al salir
    return () => {
      desuscribirCitas();
      desuscribirClientes();
    };
  }, [usuario]); // <--- Se vuelve a activar en cuanto Firebase valida tu sesión

  return (
    <div style={{ padding: '20px', textAlign: 'left', minHeight: '100vh', backgroundColor: '#121214', color: '#e1e1e6', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #29292e', paddingBottom: '15px' }}>
        <div>
          <h1 style={{ color: '#fff', margin: 0 }}>Panel de Control</h1>
          <p style={{ color: '#a8a8b3', margin: '5px 0 0 0' }}>Bienvenido de vuelta, <strong>{usuario?.nombre || (usuario as any)?.email}</strong></p>
        </div>
        <button onClick={logout} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Cerrar Sesión
        </button>
      </header>

      {/* Navegación Interna Horizontal */}
      <nav style={{ marginBottom: '30px', display: 'flex', gap: '15px' }}>
        <Link to="/citas" style={{ color: '#fff', background: '#e50914', padding: '10px 15px', borderRadius: '6px', textDecoration: 'none', fontWeight: '500' }}>📅 Citas</Link>
        <Link to="/clientes" style={{ color: '#fff', background: '#e50914', padding: '10px 15px', borderRadius: '6px', textDecoration: 'none', fontWeight: '500' }}>📋 Fichas de Clientes</Link>
        <Link to="/servicios" style={{ color: '#fff', background: '#e50914', padding: '10px 15px', borderRadius: '6px', textDecoration: 'none', fontWeight: '500' }}>💎 Catálogo e Inventario</Link>
      </nav>

      {/* Tarjetas de Indicadores */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#1a1a1e', padding: '20px', borderRadius: '8px', border: '1px solid #29292e' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#a8a8b3' }}>Citas Agendadas</h3>
          <p style={{ fontSize: '36px', margin: 0, fontWeight: 'bold', color: '#e50914' }}>{totalCitas}</p>
        </div>
        <div style={{ background: '#1a1a1e', padding: '20px', borderRadius: '8px', border: '1px solid #29292e' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#a8a8b3' }}>Clientes Registrados</h3>
          <p style={{ fontSize: '36px', margin: 0, fontWeight: 'bold', color: '#e50914' }}>{totalClientes}</p>
        </div>
      </div>

      {/* Tabla de Próximas Atenciones */}
      <h3 style={{ color: '#fff', marginBottom: '15px' }}>Próximas Atenciones del Estudio</h3>
      <div style={{ background: '#1a1a1e', border: '1px solid #29292e', padding: '20px', borderRadius: '8px' }}>
        {proximasCitas.length === 0 ? (
          <p style={{ color: '#a8a8b3' }}>No hay atenciones registradas en la agenda real en la nube.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #29292e' }}>
                <th style={{ color: '#a8a8b3', paddingBottom: '10px' }}>Cliente</th>
                <th style={{ color: '#a8a8b3', paddingBottom: '10px' }}>Procedimiento</th>
                <th style={{ color: '#a8a8b3', paddingBottom: '10px' }}>Horario</th>
              </tr>
            </thead>
            <tbody>
              {proximasCitas.map((cita) => (
                <tr key={cita.id} style={{ borderBottom: '1px solid #202024' }}>
                  <td style={{ padding: '12px 0', color: '#fff', fontWeight: 'bold' }}>{cita.cliente}</td>
                  <td style={{ padding: '12px 0', color: '#a8a8b3' }}>{cita.tipoPerforacion}</td>
                  <td style={{ padding: '12px 0', color: '#a8a8b3' }}>{cita.fecha} - {cita.hora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
