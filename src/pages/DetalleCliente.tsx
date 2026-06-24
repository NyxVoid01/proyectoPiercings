
// src/pages/DetalleCliente.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { type Cliente } from '../types/index';

export const DetalleCliente: React.FC = () => {
  // Capturamos el parámetro id directo desde la URL
  const { id } = useParams<{ id: string }>();
  const [cliente, setCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    const datosGuardados = localStorage.getItem('ink_needle_clientes');
    if (datosGuardados) {
      const lista: Cliente[] = JSON.parse(datosGuardados);
      // Buscamos al cliente que coincida con el ID de la URL
      const encontrado = lista.find(c => c.id === id);
      if (encontrado) {
        setCliente(encontrado);
      }
    }
  }, [id]);

  if (!cliente) {
    return (
      <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
        <h2>Error: Ficha técnica no encontrada</h2>
        <Link to="/clientes">Volver a la lista de clientes</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'sans-serif', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <Link to="/clientes" style={{ color: '#007bff', textDecoration: 'none', fontSize: '14px' }}>← Volver a Clientes</Link>
      
      <div style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginTop: '15px' }}>
        <h1 style={{ margin: 0 }}>FICHA TÉCNICA DE CONSENTIMIENTO</h1>
        <p style={{ color: '#666', margin: '5px 0 0 0' }}>ID Registro: {cliente.id}</p>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <p><strong>Nombre del Paciente/Cliente:</strong> {cliente.nombre}</p>
        <p><strong>RUT:</strong> {cliente.rut}</p>
        <p><strong>Teléfono de Contacto:</strong> {cliente.telefono}</p>
        <p><strong>Fecha de la Sesión:</strong> {cliente.fechaRegistro}</p>
        
        <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '6px', borderLeft: '5px solid #ffc107' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#856404' }}>📍 Zona Seleccionada para el Piercing</h4>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{cliente.zonaPerforacion}</p>
        </div>

        <div style={{ background: '#f8d7da', padding: '15px', borderRadius: '6px', borderLeft: '5px solid #dc3545' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#721c24' }}>⚠️ Alergias y Contraindicaciones</h4>
          <p style={{ margin: 0 }}>{cliente.alergias}</p>
        </div>
      </div>

      <div style={{ marginTop: '40px', fontSize: '12px', color: '#909090', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
        Ink & Needle Studio — Documento interno digitalizado vía LocalStorage.
      </div>
    </div>
  );
};