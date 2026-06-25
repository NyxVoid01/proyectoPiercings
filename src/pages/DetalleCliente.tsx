import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Cliente } from '../types/index'; // 👈 Agregamos "type" aquí

export const DetalleCliente: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cliente, setCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    const datosGuardados = localStorage.getItem('ink_needle_clientes_crud');
    if (datosGuardados) {
      const lista: Cliente[] = JSON.parse(datosGuardados);
      const encontrado = lista.find(c => c.id === id);
      if (encontrado) {
        setCliente(encontrado);
      }
    }
  }, [id]);

  if (!cliente) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#121214', color: '#e1e1e6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <h2 style={{ color: '#fff' }}>⚠️ Error: Ficha médica no encontrada</h2>
        <Link to="/clientes" style={{ color: '#e50914', textDecoration: 'none', fontWeight: 'bold' }}>
          Volver a la lista de clientes
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121214', color: '#e1e1e6', fontFamily: 'sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', width: '100%', margin: '0 auto', padding: '30px', backgroundColor: '#1a1a1e', border: '1px solid #29292e', borderRadius: '8px', textAlign: 'left', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
        
        <Link to="/clientes" style={{ color: '#e50914', textDecoration: 'none', display: 'inline-block', marginBottom: '25px', fontWeight: 'bold' }}>
          ← Volver a Clientes
        </Link>
        
        <div style={{ borderBottom: '1px solid #29292e', paddingBottom: '15px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '22px', letterSpacing: '0.5px' }}>📋 FICHA MÉDICA E HISTORIAL</h2>
          <p style={{ color: '#7c7c8a', margin: '5px 0 0 0', fontSize: '13px' }}>ID Registro Interno: {cliente.id}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', color: '#c4c4cc' }}>
          <p style={{ margin: 0 }}><strong style={{ color: '#fff' }}>Nombre Completo:</strong> {cliente.nombre}</p>
          <p style={{ margin: 0 }}><strong style={{ color: '#fff' }}>RUT / Identificación:</strong> {cliente.rut}</p>
          <p style={{ margin: 0 }}><strong style={{ color: '#fff' }}>Teléfono de Contacto:</strong> {cliente.telefono || 'No registra'}</p>
          <p style={{ margin: 0 }}><strong style={{ color: '#fff' }}>Edad:</strong> {cliente.edad} años</p>
          
          <div style={{ backgroundColor: 'rgba(254, 183, 0, 0.1)', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #feb700', marginTop: '10px' }}>
            <h4 style={{ margin: '0 0 6px 0', color: '#feb700', fontSize: '15px' }}>⚠️ Alergias y Contraindicaciones</h4>
            <p style={{ margin: 0, color: '#e1e1e6', fontSize: '14px', lineHeight: '1.4' }}>{cliente.alergias}</p>
          </div>
        </div>

      </div>
    </div>
  );
};
