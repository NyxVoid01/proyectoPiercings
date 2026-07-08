// src/pages/DetalleCliente.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Cliente } from '../types/index';

export const DetalleCliente: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cliente, setCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    const guardados = localStorage.getItem('ink_needle_clientes_crud');
    if (guardados) {
      const lista: Cliente[] = JSON.parse(guardados);
      const encontrado = lista.find(c => c.id === id);
      setCliente(encontrado || null);
    }
  }, [id]);

  if (!cliente) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121214', color: '#fff', fontFamily: 'sans-serif' }}>
        <h2>⚠️ Ficha clínica no encontrada</h2>
        <Link to="/clientes" style={{ color: '#e50914', textDecoration: 'none', marginTop: '15px', fontWeight: 'bold' }}>Volver al listado</Link>
      </div>
    );
  }

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
          <Link to="/servicios" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none' }}>💎 Servicios</Link>
        </nav>
      </div>

      {/* CONTENIDO DE LA FICHA */}
      <main style={{ flex: 1, padding: '40px', textAlign: 'left' }}>
        <Link to="/clientes" style={{ color: '#a8a8b3', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>⬅️ Volver a Clientes</Link>
        
        <div style={{ backgroundColor: '#1a1a1e', border: '1px solid #29292e', padding: '35px', borderRadius: '8px', maxWidth: '700px' }}>
          <h2 style={{ marginTop: 0, color: '#fff', borderBottom: '1px solid #29292e', paddingBottom: '15px' }}>
            📋 Ficha Clínica: {cliente.nombre}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
            <div>
              <p style={{ margin: '5px 0', color: '#7c7c8a' }}>RUT:</p>
              <p style={{ margin: '5px 0', fontSize: '16px', color: '#fff', fontWeight: 'bold' }}>{cliente.rut}</p>
            </div>
            <div>
              <p style={{ margin: '5px 0', color: '#7c7c8a' }}>Teléfono:</p>
              <p style={{ margin: '5px 0', fontSize: '16px', color: '#fff' }}>{cliente.telefono || 'No registra'}</p>
            </div>
            <div>
              <p style={{ margin: '5px 0', color: '#7c7c8a' }}>Edad:</p>
              <p style={{ margin: '5px 0', fontSize: '16px', color: '#fff' }}>{cliente.edad} años</p>
            </div>
          </div>

          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#202024', borderRadius: '6px', borderLeft: '4px solid #feb700' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#feb700' }}>⚠️ Alergias y Contraindicaciones Médicas</h4>
            <p style={{ margin: 0, color: '#e1e1e6', lineHeight: '1.5' }}>{cliente.alergias}</p>
          </div>
        </div>
      </main>

    </div>
  );
};
