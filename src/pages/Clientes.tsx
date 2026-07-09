// src/pages/Clientes.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // IMPORTANTE
// Importamos la conexión real a Firestore
import { db } from '../../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';

interface Cliente {
  id: string;
  nombre: string;
  rut: string;
  edad: string;
  telefono: string;
  alergias: string;
  observaciones: string;
}

export const Clientes: React.FC = () => {
  const { usuario, cargando } = useAuth(); // Extraemos 'cargando' del contexto de autenticación
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [edad, setEdad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [alergias, setAlergias] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // Escuchar la base de datos de Firestore en tiempo real esperando la sesión
  useEffect(() => {
    if (!usuario) return; // Frena la ejecución si la sesión no ha cargado aún

    const q = query(collection(db, 'clientes'));
    
    const desuscribir = onSnapshot(q, (snapshot) => {
      const listaClientes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Cliente[];
      
      setClientes(listaClientes);
    }, (error) => {
      console.error("Error al obtener los clientes de Firestore:", error);
    });

    return () => desuscribir();
  }, [usuario]);

  // BLINDAJE VISUAL: Si Firebase está revisando la sesión activa, congelamos la pantalla en negro
  if (cargando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#121214', color: '#fff', fontFamily: 'sans-serif' }}>
        <h2 style={{ color: '#e50914' }}>⚡ Sincronizando fichas clínicas de Ink & Needle...</h2>
      </div>
    );
  }

  // Guardar un nuevo cliente en Firestore
  const handleCrearCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !rut) return;

    try {
      await addDoc(collection(db, 'clientes'), {
        nombre,
        rut,
        edad,
        telefono,
        alergias,
        observaciones,
        fechaRegistro: new Date()
      });

      // Limpiar formulario
      setNombre('');
      setRut('');
      setEdad('');
      setTelefono('');
      setAlergias('');
      setObservaciones('');
    } catch (error) {
      console.error("Error al guardar el cliente en Firestore: ", error);
      alert("Hubo un problema al registrar la ficha clínica.");
    }
  };

  // Eliminar un cliente de Firestore
  const handleEliminarCliente = async (id: string) => {
    if (window.confirm('¿Seguro que quieres eliminar esta ficha de la base de datos real?')) {
      try {
        await deleteDoc(doc(db, 'clientes', id));
      } catch (error) {
        console.error("Error al eliminar el cliente: ", error);
        alert("No se pudo eliminar el registro.");
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
          <Link to="/servicios" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none' }}>💎 Catálogo e Inventario</Link>
        </nav>
      </div>

      {/* CONTENIDO */}
      <main style={{ flex: 1, padding: '30px' }}>
        <h2 style={{ marginBottom: '20px', color: '#fff' }}>👥 Fichas Clínicas e Historial</h2>

        {/* FORMULARIO */}
        <div style={{ backgroundColor: '#1a1a1e', border: '1px solid #29292e', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#fff' }}>Registrar Nuevo Cliente</h3>
          <form onSubmit={handleCrearCliente} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <input type="text" placeholder="Nombre Completo" value={nombre} onChange={e => setNombre(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} required />
            <input type="text" placeholder="RUT / DNI" value={rut} onChange={e => setRut(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} required />
            <input type="number" placeholder="Edad" value={edad} onChange={e => setEdad(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} />
            <input type="text" placeholder="Teléfono de Contacto" value={telefono} onChange={e => setTelefono(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} />
            <input type="text" placeholder="Alergias o Enfermedades (Ej: Látex, Diabetes)" value={alergias} onChange={e => setAlergias(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px', gridColumn: '1 / span 2' }} />
            <textarea placeholder="Observaciones anatómicas o notas de curación" value={observaciones} onChange={e => setObservaciones(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px', gridColumn: '1 / span 2', minHeight: '8px', resize: 'vertical' }} />
            
            <button type="submit" style={{ gridColumn: '1 / span 2', padding: '12px', backgroundColor: '#e50914', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              💾 Guardar Ficha en Base de Datos
            </button>
          </form>
        </div>

        {/* TABLA */}
        <div style={{ backgroundColor: '#1a1a1e', border: '1px solid #29292e', padding: '20px', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #29292e' }}>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Cliente</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>RUT</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Condiciones / Alergias</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '20px 0', color: '#7c7c8a', textAlign: 'center' }}>No hay fichas clínicas registradas en la nube.</td>
                </tr>
              ) : (
                clientes.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #202024' }}>
                    <td style={{ padding: '12px 0', color: '#fff', fontWeight: 'bold' }}>{c.nombre} <span style={{ fontSize: '12px', color: '#a8a8b3', fontWeight: 'normal' }}>({c.edad} años)</span></td>
                    <td style={{ padding: '12px 0', color: '#c4c4cc' }}>{c.rut}</td>
                    <td style={{ padding: '12px 0', color: '#ef4444' }}>{c.alergias || 'Ninguna'}</td>
                    <td style={{ padding: '12px 0' }}>
                      <button onClick={() => handleEliminarCliente(c.id)} style={{ backgroundColor: 'transparent', color: '#e50914', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                        Eliminar
                      </button>
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
