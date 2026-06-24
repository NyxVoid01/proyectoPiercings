
// src/pages/Citas.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Cita {
  id: string;
  cliente: string;
  whatsapp: string;
  servicio: string;
  fecha: string;
  hora: string;
  estado: 'Pendiente' | 'Confirmada' | 'Cancelada' | 'Finalizada';
  perforador: string;
}

export const Citas: React.FC = () => {
  const { usuario } = useAuth();
  const [citas, setCitas] = useState<Cita[]>([]);

  // Cargar citas iniciales de simulación basadas en tu web anterior
  useEffect(() => {
    const citasGuardadas = localStorage.getItem('ink_needle_citas');
    if (citasGuardadas) {
      setCitas(JSON.parse(citasGuardadas));
    } else {
      const citasBase: Cita[] = [
        { id: 'c1', cliente: 'Bastian Portilla', whatsapp: '+56922387381', servicio: 'Industrial (Oreja)', fecha: '2026-06-25', hora: '14:30', estado: 'Pendiente', perforador: 'Sin asignar' },
        { id: 'c2', cliente: 'Anahí Gómez', whatsapp: '+56912345678', servicio: 'Septum (Nariz)', fecha: '2026-06-25', hora: '16:00', estado: 'Confirmada', perforador: 'Abby Villegas' },
        { id: 'c3', cliente: 'Carlos Plaza', whatsapp: '+56987654321', servicio: 'Microdermal (Rostro)', fecha: '2026-06-26', hora: '11:00', estado: 'Finalizada', perforador: 'Víctor Villalobos' }
      ];
      setCitas(citasBase);
      localStorage.setItem('ink_needle_citas', JSON.stringify(citasBase));
    }
  }, []);

  // Cambiar el estado de la cita (Ej: De Pendiente a Confirmada)
  const handleCambiarEstado = (id: string, nuevoEstado: Cita['estado']) => {
    const listaActualizada = citas.map(cita => 
      cita.id === id ? { ...cita, estado: nuevoEstado } : cita
    );
    setCitas(listaActualizada);
    localStorage.setItem('ink_needle_citas', JSON.stringify(listaActualizada));
  };

  // Asignar perforador (Basado en tu sección de certificados reales)
  const handleAsignarPerforador = (id: string, perforador: string) => {
    const listaActualizada = citas.map(cita => 
      cita.id === id ? { ...cita, perforador } : cita
    );
    setCitas(listaActualizada);
    localStorage.setItem('ink_needle_citas', JSON.stringify(listaActualizada));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Menú Lateral Cohesivo */}
      <div style={{ width: '250px', backgroundColor: '#1e1e2f', color: 'white', padding: '20px' }}>
        <h3>Ink & Needle</h3>
        <p style={{ fontSize: '13px', color: '#a0a0b0' }}>Usuario: {usuario?.nombre}</p>
        <Link to="/dashboard" style={{ color: 'white', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>🏠 Volver al Inicio</Link>
        <Link to="/inventario" style={{ color: '#d0d0d0', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>📦 Inventario de Joyas</Link>
        <Link to="/clientes" style={{ color: '#d0d0d0', display: 'block', textDecoration: 'none' }}>👥 Gestión de Clientes</Link>
      </div>

      {/* Contenido Principal */}
      <main style={{ flex: 1, padding: '30px', backgroundColor: '#f4f6f9' }}>
        <h2>📅 Panel de Control de Citas y Agendas</h2>
        <p>Monitorea los abonos previos de seguridad y organiza los turnos del estudio.</p>

        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#eee', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>Cliente</th>
                <th style={{ padding: '12px' }}>Servicio Solicitado</th>
                <th style={{ padding: '12px' }}>Fecha / Hora</th>
                <th style={{ padding: '12px' }}>Perforador Asignado</th>
                <th style={{ padding: '12px' }}>Estado Abono</th>
                <th style={{ padding: '12px' }}>Acciones Administrativas</th>
              </tr>
            </thead>
            <tbody>
              {citas.map(cita => (
                <tr key={cita.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>
                    <strong>{cita.cliente}</strong>
                    <br />
                    <small style={{ color: '#666' }}>{cita.whatsapp}</small>
                  </td>
                  <td style={{ padding: '12px' }}>{cita.servicio}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ backgroundColor: '#e2e3e5', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>
                      {cita.fecha} @ {cita.hora}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <select 
                      value={cita.perforador} 
                      onChange={(e) => handleAsignarPerforador(cita.id, e.target.value)}
                      style={{ padding: '5px', borderRadius: '4px' }}
                    >
                      <option value="Sin asignar">Sin asignar</option>
                      <option value="Abby Villegas">Abby Villegas</option>
                      <option value="Víctor Villalobos">Víctor Villalobos</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: cita.estado === 'Confirmada' ? '#d4edda' : cita.estado === 'Pendiente' ? '#fff3cd' : '#f8d7da',
                      color: cita.estado === 'Confirmada' ? '#155724' : cita.estado === 'Pendiente' ? '#856404' : '#721c24'
                    }}>
                      {cita.estado}
                    </span>
                  </td>
                  <td style={{ padding: '12px', display: 'flex', gap: '5px' }}>
                    {cita.estado === 'Pendiente' && (
                      <button 
                        onClick={() => handleCambiarEstado(cita.id, 'Confirmada')}
                        style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        ✔ Confirmar Abono
                      </button>
                    )}
                    {cita.estado !== 'Finalizada' && cita.estado !== 'Cancelada' && (
                      <button 
                        onClick={() => handleCambiarEstado(cita.id, 'Cancelada')}
                        style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        ❌ Cancelar
                      </button>
                    )}
                    <a 
                      href={`https://wa.me/${cita.whatsapp.replace('+', '')}`} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ backgroundColor: '#25D366', color: 'white', padding: '5px 8px', borderRadius: '4px', textDecoration: 'none', fontSize: '12px', textAlign: 'center' }}
                    >
                      💬 WhatsApp
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};