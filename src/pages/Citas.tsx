
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

  // Estados del formulario para el CRUD
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
    } else {
      const iniciales: Cita[] = [
        { id: '1', cliente: 'Bastian Portilla', numeroContacto: '+56922387381', fecha: '2026-06-25', hora: '14:30', personaEncargada: 'Abby Villegas', tipoPerforacion: 'Industrial', consentimiento: true },
        { id: '2', cliente: 'Anahí Gómez', numeroContacto: '+56912345678', fecha: '2026-06-25', hora: '16:00', personaEncargada: 'Víctor Villalobos', tipoPerforacion: 'Septum', consentimiento: false }
      ];
      setCitas(iniciales);
      localStorage.setItem('ink_needle_citas_crud', JSON.stringify(iniciales));
    }
  }, []);

  const handleCrearCita = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente || !fecha || !hora || !tipoPerforacion) {
      alert('Por favor completa los campos principales.');
      return;
    }

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

    // Limpiar formulario
    setCliente('');
    setNumeroContacto('');
    setFecha('');
    setHora('');
    setTipoPerforacion('');
    setConsentimiento(false);
    alert('¡Cita agendada con éxito!');
  };

  const handleAlternarConsentimiento = (id: string) => {
    const listaActualizada = citas.map(c => 
      c.id === id ? { ...c, consentimiento: !c.consentimiento } : c
    );
    setCitas(listaActualizada);
    localStorage.setItem('ink_needle_citas_crud', JSON.stringify(listaActualizada));
  };

  const handleEliminarCita = (id: string) => {
    if (window.confirm('¿Deseas cancelar y eliminar esta cita?')) {
      const filtradas = citas.filter(c => c.id !== id);
      setCitas(filtradas);
      localStorage.setItem('ink_needle_citas_crud', JSON.stringify(filtradas));
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Menú Lateral */}
      <div style={{ width: '250px', backgroundColor: '#1e1e2f', color: 'white', padding: '20px' }}>
        <h3>Ink & Needle</h3>
        <p style={{ fontSize: '13px', color: '#a0a0b0' }}>Usuario: {usuario?.nombre}</p>
        <Link to="/dashboard" style={{ color: 'white', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>🏠 Volver al Inicio</Link>
        <Link to="/clientes" style={{ color: '#d0d0d0', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>👥 Fichas Clínicas</Link>
        <Link to="/inventario" style={{ color: '#d0d0d0', display: 'block', textDecoration: 'none' }}>📦 Inventario y Servicios</Link>
      </div>

      {/* Contenido Principal */}
      <main style={{ flex: 1, padding: '30px', backgroundColor: '#f4f6f9' }}>
        <h2>📅 CRUD - Gestión y Agenda de Citas</h2>

        {/* Formulario de Registro */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>Agendar Nuevo Turno</h3>
          <form onSubmit={handleCrearCita} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div>
              <label>Nombre Cliente *</label>
              <input type="text" value={cliente} onChange={e => setCliente(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} required />
            </div>
            <div>
              <label>Teléfono Contacto</label>
              <input type="text" value={numeroContacto} onChange={e => setNumeroContacto(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} placeholder="+569..." />
            </div>
            <div>
              <label>Tipo Perforación *</label>
              <input type="text" value={tipoPerforacion} onChange={e => setTipoPerforacion(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} placeholder="Ej: Helix, Navel" required />
            </div>
            <div>
              <label>Fecha *</label>
              <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} required />
            </div>
            <div>
              <label>Hora *</label>
              <input type="time" value={hora} onChange={e => setHora(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} required />
            </div>
            <div>
              <label>Persona Encargada (Staff)</label>
              <select value={personaEncargada} onChange={e => setPersonaEncargada(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                <option value="Abby Villegas">Abby Villegas</option>
                <option value="Víctor Villalobos">Víctor Villalobos</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / span 3', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" id="consentCita" checked={consentimiento} onChange={e => setConsentimiento(e.target.checked)} />
              <label htmlFor="consentCita" style={{ fontWeight: 'bold' }}>¿Tiene el consentimiento firmado adjunto para esta sesión?</label>
            </div>
            <div style={{ gridColumn: '1 / span 3' }}>
              <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                📅 Registrar Turno en Agenda
              </button>
            </div>
          </form>
        </div>

        {/* Tabla Operativa */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>Lista de Turnos Activos</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#eee', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Cliente / Teléfono</th>
                <th style={{ padding: '10px' }}>Perforación</th>
                <th style={{ padding: '10px' }}>Fecha y Hora</th>
                <th style={{ padding: '10px' }}>Encargado</th>
                <th style={{ padding: '10px' }}>Consentimiento</th>
                <th style={{ padding: '10px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>
                    <strong>{c.cliente}</strong><br/>
                    <small style={{ color: '#666' }}>{c.numeroContacto}</small>
                  </td>
                  <td style={{ padding: '10px' }}>{c.tipoPerforacion}</td>
                  <td style={{ padding: '10px' }}>{c.fecha} a las {c.hora} hrs</td>
                  <td style={{ padding: '10px' }}>{c.personaEncargada}</td>
                  <td style={{ padding: '10px' }}>
                    <button 
                      onClick={() => handleAlternarConsentimiento(c.id)}
                      style={{
                        backgroundColor: c.consentimiento ? '#d4edda' : '#fff3cd',
                        color: c.consentimiento ? '#155724' : '#856404',
                        border: '1px solid currentColor',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {c.consentimiento ? '✔ Con Consentimiento' : '⏳ Pendiente'}
                    </button>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <button onClick={() => handleEliminarCita(c.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                      Cancelar
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

