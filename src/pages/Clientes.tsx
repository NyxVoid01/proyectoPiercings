
// src/pages/Clientes.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Cliente {
  id: string;
  nombre: string;
  rut: string;
  telefono: string;
  edad: number;
  alergias: string;
}

export const Clientes: React.FC = () => {
  const { usuario } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);

  // Campos CRUD
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [telefono, setTelefono] = useState('');
  const [edad, setEdad] = useState('');
  const [alergias, setAlergias] = useState('');

  // DETECCIÓN DE PERMISOS DE ADMINISTRADOR
  const nombreMinuscula = usuario?.nombre?.toLowerCase() || '';
  const esAdmin = nombreMinuscula === 'fernando' || nombreMinuscula === 'angel';

  useEffect(() => {
    const guardados = localStorage.getItem('ink_needle_clientes_crud');
    if (guardados) {
      setClientes(JSON.parse(guardados));
    } else {
      const iniciales: Cliente[] = [
        { id: '1', nombre: 'Bastian Portilla', rut: '19.876.543-2', telefono: '+56922387381', edad: 24, alergias: 'Ninguna' },
        { id: '2', nombre: 'Anahí Gómez', rut: '20.123.456-k', telefono: '+56912345678', edad: 21, alergias: 'Alergia al Látex (Usa guantes de Nitrilo)' }
      ];
      setClientes(iniciales);
      localStorage.setItem('ink_needle_clientes_crud', JSON.stringify(iniciales));
    }
  }, []);

  const handleCrearCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !rut || !edad) return;

    const nuevoCliente: Cliente = {
      id: crypto.randomUUID(),
      nombre,
      rut,
      telefono,
      edad: Number(edad),
      alergias: alergias || 'Ninguna'
    };

    const listaActualizada = [...clientes, nuevoCliente];
    setClientes(listaActualizada);
    localStorage.setItem('ink_needle_clientes_crud', JSON.stringify(listaActualizada));

    setNombre('');
    setRut('');
    setTelefono('');
    setEdad('');
    setAlergias('');
  };

  const handleEliminarCliente = (id: string) => {
    if (!esAdmin) {
      alert('Error: No tienes permisos de Administrador para eliminar registros.');
      return;
    }
    if (window.confirm('¿Seguro que deseas eliminar esta ficha clínica de la base de datos?')) {
      const filtrados = clientes.filter(c => c.id !== id);
      setClientes(filtrados);
      localStorage.setItem('ink_needle_clientes_crud', JSON.stringify(filtrados));
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
          <Link to="/citas" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none' }}>📅 Agenda de Citas</Link>
          <Link to="/clientes" style={{ padding: '12px 15px', color: '#fff', backgroundColor: '#29292e', textDecoration: 'none', borderRadius: '6px', borderLeft: '4px solid #e50914', fontWeight: 'bold' }}>👥 Fichas Clínicas</Link>
          <Link to="/inventario" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none' }}>📦 Catálogo e Inventario</Link>
        </nav>
      </div>

      {/* CONTENIDO */}
      <main style={{ flex: 1, padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#fff' }}>👥 Base de Fichas Clínicas</h2>
          <span style={{ 
            fontSize: '12px', 
            padding: '5px 12px', 
            borderRadius: '12px', 
            backgroundColor: esAdmin ? 'rgba(40, 167, 69, 0.2)' : 'rgba(229, 9, 20, 0.2)', 
            color: esAdmin ? '#28a745' : '#e50914',
            fontWeight: 'bold'
          }}>
            Perfil: {esAdmin ? '⚡ Administrador' : '🔒 Staff Limitado'}
          </span>
        </div>

        {/* FORMULARIO */}
        <div style={{ backgroundColor: '#1a1a1e', border: '1px solid #29292e', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#fff' }}>Registrar Nuevo Cliente</h3>
          <form onSubmit={handleCrearCliente} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <input type="text" placeholder="Nombre Completo" value={nombre} onChange={e => setNombre(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} required />
            <input type="text" placeholder="RUT o Documento" value={rut} onChange={e => setRut(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} required />
            <input type="text" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} />
            <input type="number" placeholder="Edad" value={edad} onChange={e => setEdad(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} required />
            <input type="text" placeholder="Condiciones Médicas / Alergias" value={alergias} onChange={e => setAlergias(e.target.value)} style={{ gridColumn: '2 / span 2', padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} />
            
            <button type="submit" style={{ gridColumn: '1 / span 3', padding: '12px', backgroundColor: '#e50914', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              💾 Guardar Ficha Clínica
            </button>
          </form>
        </div>

        {/* TABLA */}
        <div style={{ backgroundColor: '#1a1a1e', border: '1px solid #29292e', padding: '20px', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #29292e' }}>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Paciente / RUT</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Contacto</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Edad</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Ficha Médica</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #202024' }}>
                  <td style={{ padding: '12px 0', color: '#fff' }}><strong>{c.nombre}</strong><br/><small style={{ color: '#7c7c8a' }}>{c.rut}</small></td>
                  <td style={{ padding: '12px 0', color: '#c4c4cc' }}>{c.telefono || 'No registra'}</td>
                  <td style={{ padding: '12px 0', color: '#c4c4cc' }}>{c.edad} años</td>
                  <td style={{ padding: '12px 0', color: '#feb700' }}>{c.alergias}</td>
                  <td style={{ padding: '12px 0' }}>
                    {esAdmin ? (
                      <button onClick={() => handleEliminarCliente(c.id)} style={{ backgroundColor: 'transparent', color: '#e50914', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                        Eliminar
                      </button>
                    ) : (
                      <span style={{ color: '#50505a', fontSize: '13px' }}>🔒 Bloqueado</span>
                    )}
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