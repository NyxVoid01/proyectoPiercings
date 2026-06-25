
// src/pages/Citas.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface CitaItem {
  id: string;
  cliente: string;
  telefono: string;
  zona: string;
  perforador: string;
  fecha: string;
  hora: string;
}

// Opciones predefinidas para evitar errores de tipeo
const LISTA_ZONAS = [
  "Helix",
  "Nostril",
  "Navel",
  "Septum",
  "Industrial",
  "Labret",
  "Tragus",
  "Ceja",
  "Lóbulo"
];

const LISTA_STAFF = [
  "Abby Villegas",
  "Fernando",
  "Angel"
];

export const Citas: React.FC = () => {
  const { usuario } = useAuth();
  const [citas, setCitas] = useState<CitaItem[]>([]);

  // Estados del Formulario
  const [cliente, setCliente] = useState('');
  const [telefono, setTelefono] = useState('');
  const [zona, setZona] = useState('');
  const [perforador, setPerforador] = useState('Abby Villegas');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    const guardadas = localStorage.getItem('ink_needle_citas');
    if (guardadas) {
      setCitas(JSON.parse(guardadas));
    } else {
      // Datos iniciales idénticos a tu captura de pantalla
      const iniciales: CitaItem[] = [
        { id: '1', cliente: 'Bastian Portilla', telefono: '+56912345678', zona: 'Industrial', perforador: 'Abby Villegas', fecha: '2026-06-25', hora: '14:30' },
        { id: '2', cliente: 'Anahí Gómez', telefono: '+56987654321', zona: 'Septum', perforador: 'Abby Villegas', fecha: '2026-06-25', hora: '16:00' }
      ];
      setCitas(iniciales);
      localStorage.setItem('ink_needle_citas', JSON.stringify(iniciales));
    }
  }, []);

  const handleGuardarCita = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente || !telefono || !zona || !perforador || !fecha || !hora) return;

    const nuevaCita: CitaItem = {
      id: crypto.randomUUID(),
      cliente,
      telefono,
      zona,
      perforador,
      fecha,
      hora
    };

    const listaActualizada = [...citas, nuevaCita];
    setCitas(listaActualizada);
    localStorage.setItem('ink_needle_citas', JSON.stringify(listaActualizada));

    // Resetear formulario
    setCliente('');
    setTelefono('');
    setZona('');
    setPerforador('Abby Villegas');
    setFecha('');
    setHora('');
  };

  const handleEliminarCita = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar o eliminar esta cita?')) {
      const filtradas = citas.filter(c => c.id !== id);
      setCitas(filtradas);
      localStorage.setItem('ink_needle_citas', JSON.stringify(filtradas));
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121214', color: '#e1e1e6', fontFamily: 'sans-serif' }}>
      {/* SIDEBAR */}
      <div style={{ width: '260px', backgroundColor: '#1a1a1e', borderRight: '1px solid #29292e', padding: '20px' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', marginBottom: '40px' }}>
          INK & <span style={{ color: '#e50914' }}>NEEDLE</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/dashboard" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none' }}>Panel Principal</Link>
          <Link to="/citas" style={{ padding: '12px 15px', color: '#fff', backgroundColor: '#29292e', textDecoration: 'none', borderRadius: '6px', borderLeft: '4px solid #e50914', fontWeight: 'bold' }}>📅 Agenda de Citas</Link>
          <Link to="/clientes" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none' }}>👥 Fichas Clínicas</Link>
          <Link to="/inventario" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none' }}>📦 Catálogo e Inventario</Link>
        </nav>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#fff' }}>🎬 Gestión Dinámica de Citas</h2>
          <span style={{ fontSize: '13px', color: '#a8a8b3' }}>
            ⚡ Staff Activo: <strong style={{ color: '#fff' }}>{usuario?.nombre || 'admin'}</strong>
          </span>
        </div>

        {/* FORMULARIO */}
        <div style={{ backgroundColor: '#1a1a1e', border: '1px solid #29292e', padding: '25px', borderRadius: '8px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px', color: '#fff', textAlign: 'center', fontSize: '18px' }}>Agendar Nueva Perforación</h3>
          <form onSubmit={handleGuardarCita} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            
            <input type="text" placeholder="Nombre del Cliente" value={cliente} onChange={e => setCliente(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} required />
            <input type="text" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} required />
            
            {/* NUEVO DESPLEGABLE DE ZONA OPTIMIZADO */}
            <select 
              value={zona} 
              onChange={e => setZona(e.target.value)} 
              style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: zona ? '#fff' : '#7c7c8a', borderRadius: '4px', cursor: 'pointer' }} 
              required
            >
              <option value="" disabled>Zona (Ej: Septum, Helix)</option>
              {LISTA_ZONAS.map(opcion => (
                <option key={opcion} value={opcion} style={{ backgroundColor: '#1a1a1e', color: '#fff' }}>{opcion}</option>
              ))}
            </select>

            {/* DESPLEGABLE DEL PERFORADOR */}
            <select 
              value={perforador} 
              onChange={e => setPerforador(e.target.value)} 
              style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px', cursor: 'pointer' }} 
              required
            >
              {LISTA_STAFF.map(p => (
                <option key={p} value={p} style={{ backgroundColor: '#1a1a1e', color: '#fff' }}>{p}</option>
              ))}
            </select>

            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} required />
            <input type="time" value={hora} onChange={e => setHora(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} required />
            
            <button type="submit" style={{ gridColumn: '1 / span 2', padding: '12px', backgroundColor: '#e50914', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
              ➕ Guardar Cita en Agenda
            </button>
          </form>
        </div>

        {/* TABLA DE CITAS */}
        <div style={{ backgroundColor: '#1a1a1e', border: '1px solid #29292e', padding: '20px', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #29292e' }}>
                <th style={{ color: '#7c7c8a', paddingBottom: '12px' }}>Cliente</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '12px' }}>Ubicación</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '12px' }}>Horario</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '12px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #202024' }}>
                  <td style={{ padding: '14px 0', color: '#fff', fontWeight: 'bold' }}>
                    {c.cliente}
                    <div style={{ fontSize: '12px', color: '#7c7c8a', fontWeight: 'normal', marginTop: '2px' }}>{c.telefono} • Perfora: {c.perforador}</div>
                  </td>
                  <td style={{ padding: '14px 0', color: '#c4c4cc' }}>{c.zona}</td>
                  <td style={{ padding: '14px 0', color: '#fff' }}>{c.fecha} - {c.hora}</td>
                  <td style={{ padding: '14px 0' }}>
                    <button onClick={() => handleEliminarCita(c.id)} style={{ backgroundColor: 'transparent', color: '#e50914', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {citas.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: '#7c7c8a' }}>No hay citas agendadas para hoy.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};