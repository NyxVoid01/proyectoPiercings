// src/pages/Clientes.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Cliente } from '../types/index';
// 1. Herramientas de Firestore y base de datos
import { db } from '../../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';

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

  // 2. Escuchar la colección de clientes en tiempo real desde Firestore
  useEffect(() => {
    const q = query(collection(db, 'clientes'));
    
    const desuscribir = onSnapshot(q, (snapshot) => {
      const listaClientes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Cliente[];
      
      setClientes(listaClientes);
    }, (error) => {
      console.error("Error al traer clientes de Firestore:", error);
    });

    return () => desuscribir();
  }, []);

  // 3. Guardar cliente en Firestore
  const handleCrearCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !rut.trim() || !edad.trim() || !alergias.trim()) {
      alert('Por favor complete los campos obligatorios (Nombre, RUT, Edad, Alergias).');
      return;
    }

    try {
      await addDoc(collection(db, 'clientes'), {
        nombre: nombre.trim(),
        rut: rut.trim(),
        telefono: telefono.trim() || 'No registra',
        edad: Number(edad),
        alergias: alergias.trim(),
        fechaRegistro: new Date()
      });

      // Limpiar formulario
      setNombre('');
      setRut('');
      setTelefono('');
      setEdad('');
      setAlergias('');
    } catch (error) {
      console.error("Error al guardar la ficha clínica: ", error);
      alert("No se pudo guardar la ficha en la base de datos.");
    }
  };

  // 4. Eliminar cliente de Firestore (Solo Admin)
  const handleEliminarCliente = async (id: string) => {
    if (!esAdmin) return;
    if (window.confirm('¿Está seguro de eliminar esta ficha clínica de forma permanente de la base de datos?')) {
      try {
        await deleteDoc(doc(db, 'clientes', id));
      } catch (error) {
        console.error("Error al eliminar la ficha clínica: ", error);
        alert("Hubo un problema al intentar eliminar.");
      }
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121214', color: '#e1e1e6', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR UNIFICADO */}
      <div style={{ width: '260px', backgroundColor: '#1a1a1e', borderRight: '1px solid #29292e', padding: '20px' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', marginBottom: '40px' }}>
          INK & <span style={{ color: '#e50914' }}>NEEDLE</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/dashboard" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none' }}>Panel Principal</Link>
          <Link to="/citas" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none' }}>📅 Agenda de Citas</Link>
          <Link to="/clientes" style={{ padding: '12px 15px', color: '#fff', backgroundColor: '#29292e', textDecoration: 'none', borderRadius: '6px', borderLeft: '4px solid #e50914', fontWeight: 'bold' }}>👥 Fichas Clínicas</Link>
          <Link to="/servicios" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none' }}>💎 Servicios</Link>
        </nav>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, padding: '30px' }}>
        <h2 style={{ color: '#fff', marginBottom: '20px', textAlign: 'left' }}>👥 Registro de Fichas Clínicas</h2>

        {/* FORMULARIO */}
        <div style={{ backgroundColor: '#1a1a1e', border: '1px solid #29292e', padding: '25px', borderRadius: '8px', marginBottom: '30px', textAlign: 'left' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#fff' }}>Registrar Nueva Ficha</h3>
          <form onSubmit={handleCrearCliente} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <input type="text" placeholder="Nombre Completo" value={nombre} onChange={e => setNombre(e.target.value)} style={{ padding: '12px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '6px' }} />
            <input type="text" placeholder="RUT (Ej: 12.345.678-9)" value={rut} onChange={e => setRut(e.target.value)} style={{ padding: '12px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '6px' }} />
            <input type="text" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} style={{ padding: '12px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '6px' }} />
            <input type="number" placeholder="Edad" value={edad} onChange={e => setEdad(e.target.value)} style={{ padding: '12px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '6px' }} />
            <input type="text" placeholder="Alergias / Contraindicaciones Médicas" value={alergias} onChange={e => setAlergias(e.target.value)} style={{ gridColumn: '1 / span 2', padding: '12px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '6px' }} />
            
            <button type="submit" style={{ gridColumn: '1 / span 2', padding: '14px', backgroundColor: '#e50914', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
              💾 Guardar Ficha Clínica
            </button>
          </form>
        </div>

        {/* TABLA DE CLIENTES */}
        <div style={{ backgroundColor: '#1a1a1e', border: '1px solid #29292e', padding: '20px', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #29292e' }}>
                <th style={{ color: '#7c7c8a', paddingBottom: '12px' }}>Cliente / RUT</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '12px' }}>Teléfono</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '12px' }}>Edad</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '12px' }}>Alergias</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '12px' }}>Ficha Médica</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '12px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '20px 0', color: '#7c7c8a', textAlign: 'center' }}>No hay fichas clínicas guardadas en la base de datos.</td>
                </tr>
              ) : (
                clientes.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #202024' }}>
                    <td style={{ padding: '14px 0', color: '#fff' }}><strong>{c.nombre}</strong><br/><small style={{ color: '#7c7c8a' }}>{c.rut}</small></td>
                    <td style={{ padding: '14px 0', color: '#c4c4cc' }}>{c.telefono || 'No registra'}</td>
                    <td style={{ padding: '14px 0', color: '#c4c4cc' }}>{c.edad} años</td>
                    <td style={{ padding: '14px 0', color: '#feb700' }}>⚠️ {c.alergias}</td>
                    <td style={{ padding: '14px 0' }}>
                      <Link to={`/clientes/${c.id}`} style={{ color: '#e50914', textDecoration: 'none', fontWeight: 'bold' }}>
                        👁️ Ver Ficha
                      </Link>
                    </td>
                    <td style={{ padding: '14px 0' }}>
                      {esAdmin ? (
                        <button onClick={() => handleEliminarCliente(c.id)} style={{ backgroundColor: 'transparent', color: '#e50914', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                          Eliminar
                        </button>
                      ) : (
                        <span style={{ color: '#50505a', fontSize: '13px' }}>🔒 Bloqueado</span>
                      )}
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
