
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface FichaCliente {
  id: string;
  nombre: string;
  fechaNacimiento: string;
  alergias: string;
  numeroContacto: string;
  correo: string;
  consentimientoFirmado: boolean;
}

export const Clientes: React.FC = () => {
  const { usuario } = useAuth();
  const [clientes, setClientes] = useState<FichaCliente[]>([]);

  // Campos del formulario CRUD
  const [nombre, setNombre] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [alergias, setAlergias] = useState('');
  const [numeroContacto, setNumeroContacto] = useState('');
  const [correo, setCorreo] = useState('');
  const [consentimiento, setConsentimiento] = useState(false);

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const guardados = localStorage.getItem('ink_needle_fichas');
    if (guardados) {
      setClientes(JSON.parse(guardados));
    } else {
      // Datos de prueba iniciales corregidos
      const iniciales: FichaCliente[] = [
        { id: '1', nombre: 'Bastian Portilla', fechaNacimiento: '2000-05-15', alergias: 'Látex', numeroContacto: '+56922387381', correo: 'bastian@correo.com', consentimientoFirmado: true },
        { id: '2', nombre: 'Anahí Gómez', fechaNacimiento: '1998-11-22', alergias: 'Penicilina', numeroContacto: '+56912345678', correo: 'anahi@correo.com', consentimientoFirmado: false }
      ];
      setClientes(iniciales);
      localStorage.setItem('ink_needle_fichas', JSON.stringify(iniciales));
    }
  }, []);

  const handleCrearFicha = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !numeroContacto || !correo) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }

    const nuevaFicha: FichaCliente = {
      id: crypto.randomUUID(),
      nombre,
      fechaNacimiento,
      alergias: alergias || 'Ninguna',
      numeroContacto,
      correo,
      consentimientoFirmado: consentimiento
    };

    const listaActualizada = [...clientes, nuevaFicha];
    setClientes(listaActualizada);
    localStorage.setItem('ink_needle_fichas', JSON.stringify(listaActualizada));

    // Limpiar formulario
    setNombre('');
    setFechaNacimiento('');
    setAlergias('');
    setNumeroContacto('');
    setCorreo('');
    setConsentimiento(false);
    alert('¡Ficha clínica registrada con éxito!');
  };

  const handleEliminarFicha = (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este registro clínico?')) {
      const filtrados = clientes.filter(c => c.id !== id);
      setClientes(filtrados);
      localStorage.setItem('ink_needle_fichas', JSON.stringify(filtrados));
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Menú Lateral */}
      <div style={{ width: '250px', backgroundColor: '#1e1e2f', color: 'white', padding: '20px' }}>
        <h3>Ink & Needle</h3>
        <p style={{ fontSize: '13px', color: '#a0a0b0' }}>Personal: {usuario?.nombre}</p>
        <Link to="/dashboard" style={{ color: 'white', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>🏠 Volver al Inicio</Link>
        <Link to="/citas" style={{ color: '#d0d0d0', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>📅 Ver Citas</Link>
        <Link to="/inventario" style={{ color: '#d0d0d0', display: 'block', textDecoration: 'none' }}>📦 Inventario</Link>
      </div>

      {/* Panel de Contenido */}
      <main style={{ flex: 1, padding: '30px', backgroundColor: '#f4f6f9' }}>
        <h2>👥 Registro de Fichas Clínicas y Consentimientos</h2>

        {/* Formulario de Alta */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>Nueva Ficha Obligatoria (Pre-Perforación)</h3>
          <form onSubmit={handleCrearFicha} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label>Nombre Completo del Cliente *</label>
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} required />
            </div>
            <div>
              <label>Fecha de Nacimiento *</label>
              <input type="date" value={fechaNacimiento} onChange={e => setFechaNacimiento(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} required />
            </div>
            <div>
              <label>Número de Contacto (WhatsApp) *</label>
              <input type="text" value={numeroContacto} onChange={e => setNumeroContacto(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} placeholder="+569..." required />
            </div>
            <div>
              <label>Correo Electrónico *</label>
              <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} placeholder="ejemplo@correo.com" required />
            </div>
            <div style={{ gridColumn: '1 / span 2' }}>
              <label>Alergias o Contraindicaciones Médicas</label>
              <input type="text" value={alergias} onChange={e => setAlergias(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} placeholder="Ej: Látex, metales, penicilina (o dejar vacío si no tiene)" />
            </div>
            <div style={{ gridColumn: '1 / span 2', display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
              <input type="checkbox" id="consent" checked={consentimiento} onChange={e => setConsentimiento(e.target.checked)} style={{ transform: 'scale(1.2)' }} />
              <label htmlFor="consent" style={{ fontWeight: 'bold', color: '#333' }}>¿El cliente firmó el documento de consentimiento legal?</label>
            </div>
            <div style={{ gridColumn: '1 / span 2' }}>
              <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                💾 Guardar Ficha en Base de Datos
              </button>
            </div>
          </form>
        </div>

        {/* Listado / Tabla */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>Fichas Registradas</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#eee', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Cliente</th>
                <th style={{ padding: '10px' }}>Contacto / Email</th>
                <th style={{ padding: '10px' }}>F. Nacimiento</th>
                <th style={{ padding: '10px' }}>Alergias</th>
                <th style={{ padding: '10px' }}>Consentimiento</th>
                <th style={{ padding: '10px' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{c.nombre}</td>
                  <td style={{ padding: '10px' }}>
                    <small>{c.numeroContacto}</small><br/>
                    <small style={{ color: '#666' }}>{c.correo}</small>
                  </td>
                  <td style={{ padding: '10px' }}>{c.fechaNacimiento}</td>
                  <td style={{ padding: '10px', color: c.alergias !== 'Ninguna' ? 'red' : 'inherit' }}>⚠️ {c.alergias}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ backgroundColor: c.consentimientoFirmado ? '#d4edda' : '#f8d7da', color: c.consentimientoFirmado ? '#155724' : '#721c24', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                      {c.consentimientoFirmado ? 'Firmado' : 'Pendiente'}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <button onClick={() => handleEliminarFicha(c.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
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