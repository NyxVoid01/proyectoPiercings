

// src/pages/Clientes.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { type Cliente } from '../types/index';
import { Link } from 'react-router-dom';

export const Clientes: React.FC = () => {
  const { usuario } = useAuth(); // 👈 Ya no marcará error porque lo usaremos abajo
  const [clientes, setClientes] = useState<Cliente[]>([]);
  
  // Estados para el formulario
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [telefono, setTelefono] = useState('');
  const [zona, setZona] = useState('Septum');
  const [alergias, setAlergias] = useState('');

  // Cargar clientes desde localStorage al iniciar
  useEffect(() => {
    const datosGuardados = localStorage.getItem('ink_needle_clientes');
    if (datosGuardados) {
      setClientes(JSON.parse(datosGuardados));
    }
  }, []);

  // Guardar en formulario
  const handleAgregarCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !rut || !telefono) {
      alert('Por favor, rellena los campos obligatorios');
      return;
    }

    const nuevoCliente: Cliente = {
      id: crypto.randomUUID(),
      nombre,
      rut,
      telefono,
      zonaPerforacion: zona,
      alergias: alergias || 'Ninguna',
      fechaRegistro: new Date().toLocaleDateString('es-CL')
    };

    const listaActualizada = [...clientes, nuevoCliente];
    setClientes(listaActualizada);
    localStorage.setItem('ink_needle_clientes', JSON.stringify(listaActualizada));

    // Limpiar formulario
    setNombre('');
    setRut('');
    setTelefono('');
    setAlergias('');
    alert('Cliente registrado con éxito');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Reutilizamos un menú básico rápido arriba o a la izquierda */}
      <div style={{ width: '250px', backgroundColor: '#1e1e2f', color: 'white', padding: '20px' }}>
        <h3>Ink & Needle</h3>
        <Link to="/dashboard" style={{ color: 'white', display: 'block', marginBottom: '10px' }}>🏠 Volver al Inicio</Link>
      </div>

      <main style={{ flex: 1, padding: '30px', backgroundColor: '#f4f6f9' }}>
        <h2>👥 Registro y Control de Clientes (Operador: {usuario?.nombre})</h2>

        {/* FORMULARIO DE INGRESO */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>Nueva Ficha de Perforación</h3>
          <form onSubmit={handleAgregarCliente} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label>Nombre Completo *</label>
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} placeholder="Juan Pérez" />
            </div>
            <div>
              <label>RUT *</label>
              <input type="text" value={rut} onChange={e => setRut(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} placeholder="12.345.678-9" />
            </div>
            <div>
              <label>Teléfono *</label>
              <input type="text" value={telefono} onChange={e => setTelefono(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} placeholder="+56912345678" />
            </div>
            <div>
              <label>Zona a Perforar</label>
              <select value={zona} onChange={e => setZona(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                <option value="Septum">Septum</option>
                <option value="Nostril">Nostril</option>
                <option value="Industrial">Industrial</option>
                <option value="Helix">Helix</option>
                <option value="Navel (Ombligo)">Navel (Ombligo)</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / span 2' }}>
              <label>Alergias o Contraindicaciones Médicas</label>
              <textarea value={alergias} onChange={e => setAlergias(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} placeholder="Ej: Alergia al níquel, toma anticoagulantes..." />
            </div>
            <button type="submit" style={{ gridColumn: '1 / span 2', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Registrar Cliente y Crear Ficha
            </button>
          </form>
        </div>

        {/* TABLA DE CLIENTES */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>Clientes Registrados</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#eee', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Nombre</th>
                <th style={{ padding: '10px' }}>RUT</th>
                <th style={{ padding: '10px' }}>Zona</th>
                <th style={{ padding: '10px' }}>Fecha</th>
                <th style={{ padding: '10px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '10px', textAlign: 'center' }}>No hay clientes registrados en este navegador.</td></tr>
              ) : (
                clientes.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px' }}>{c.nombre}</td>
                    <td style={{ padding: '10px' }}>{c.rut}</td>
                    <td style={{ padding: '10px' }}><span style={{ background: '#e2f0fd', color: '#007bff', padding: '3px 8px', borderRadius: '4px' }}>{c.zonaPerforacion}</span></td>
                    <td style={{ padding: '10px' }}>{c.fechaRegistro}</td>
                    <td style={{ padding: '10px' }}>
                      {/* Aquí ocupamos la RUTA DINÁMICA pasándole el ID único */}
                      <Link to={`/clientes/${c.id}`} style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '13px' }}>
                        👁️ Ver Ficha Técnica
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};