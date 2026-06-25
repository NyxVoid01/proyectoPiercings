
// src/pages/Citas.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Cita {
  id: string;
  cliente: string;
  numeroContacto: string;
  fecha: string;
  hora: string;
  personaEncargada: string;
  tipoPerforacion: string;
  consentimiento: boolean;
}

export const Citas: React.FC = () => {
  const { usuario } = useAuth();
  const [citas, setCitas] = useState<Cita[]>([]);

  const [cliente, setCliente] = useState('');
  const [numeroContacto, setNumeroContacto] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [personaEncargada, setPersonaEncargada] = useState('Abby Villegas');
  const [tipoPerforacion, setTipoPerforacion] = useState('');
  const [consentimiento, setConsentimiento] = useState(false);

  useEffect(() => {
    const guardadas = localStorage.getItem('ink_needle_citas_crud');
    if (guardadas) {
      setCitas(JSON.parse(guardadas));
    }
  }, []);

  const handleCrearCita = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente || !fecha || !hora || !tipoPerforacion) return;

    const nuevaCita: Cita = {
      id: crypto.randomUUID(),
      cliente,
      numeroContacto,
      fecha,
      hora,
      personaEncargada,
      tipoPerforacion,
      consentimiento
    };

    const listaActualizada = [...citas, nuevaCita];
    setCitas(listaActualizada);
    localStorage.setItem('ink_needle_citas_crud', JSON.stringify(listaActualizada));

    setCliente('');
    setNumeroContacto('');
    setFecha('');
    setHora('');
    setTipoPerforacion('');
    setConsentimiento(false);
  };

  const handleEliminarCita = (id: string) => {
    if (window.confirm('¿Eliminar cita?')) {
      const filtradas = citas.filter(c => c.id !== id);
      setCitas(filtradas);
      localStorage.setItem('ink_needle_citas_crud', JSON.stringify(filtradas));
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
          <Link to="/citas" style={{ padding: '12px 15px', color: '#fff', backgroundColor: '#29292e', textDecoration: 'none', borderRadius: '6px', borderLeft: '4px solid #e50914' }}>📅 Agenda de Citas</Link>
          <Link to="/clientes" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none' }}>👥 Fichas Clínicas</Link>
          <Link to="/inventario" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none' }}>📦 Catálogo e Inventario</Link>
        </nav>
      </div>

      {/* CONTENIDO */}
      <main style={{ flex: 1, padding: '30px' }}>
        <h2 style={{ marginBottom: '20px', color: '#fff' }}>📅 Gestión Dinámica de Citas</h2>

        {/* FORMULARIO CRUD */}
        <div style={{ backgroundColor: '#1a1a1e', border: '1px solid #29292e', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#fff' }}>Agendar Nueva Perforación</h3>
          <form onSubmit={handleCrearCita} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <input type="text" placeholder="Nombre del Cliente" value={cliente} onChange={e => setCliente(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} required />
            <input type="text" placeholder="Teléfono" value={numeroContacto} onChange={e => setNumeroContacto(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} />
            <input type="text" placeholder="Zona (Ej: Septum, Helix)" value={tipoPerforacion} onChange={e => setTipoPerforacion(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} required />
            <select value={personaEncargada} onChange={e => setPersonaEncargada(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }}>
              <option value="Abby Villegas">Abby Villegas</option>
              <option value="Víctor Villalobos">Víctor Villalobos</option>
            </select>
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} required />
            <input type="time" value={hora} onChange={e => setHora(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} required />
            
            <button type="submit" style={{ gridColumn: '1 / span 2', padding: '12px', backgroundColor: '#e50914', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              ➕ Guardar Cita en Agenda
            </button>
          </form>
        </div>

        {/* TABLA CRUD */}
        <div style={{ backgroundColor: '#1a1a1e', border: '1px solid #29292e', padding: '20px', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #29292e' }}>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Cliente</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Ubicación</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Horario</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #202024' }}>
                  <td style={{ padding: '12px 0', color: '#fff' }}>{c.cliente}</td>
                  <td style={{ padding: '12px 0', color: '#c4c4cc' }}>{c.tipoPerforacion}</td>
                  <td style={{ padding: '12px 0', color: '#c4c4cc' }}>{c.fecha} - {c.hora}</td>
                  <td style={{ padding: '12px 0' }}>
                    <button onClick={() => handleEliminarCita(c.id)} style={{ backgroundColor: 'transparent', color: '#e50914', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                      Eliminar
                    </button>
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