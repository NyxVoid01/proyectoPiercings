
// src/pages/Inventario.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ItemInventario {
  id: string;
  nombre: string;
  categoria: 'Oreja' | 'Nariz' | 'Boca' | 'Cuerpo' | 'Insumo';
  material: 'Titanio ASTM F-136' | 'Acero Quirúrgico 316L' | 'Bioplástico' | 'Otro';
  stock: number;
  precioServicio: number;
}

export const Inventario: React.FC = () => {
  const { usuario } = useAuth();
  const [inventario, setInventario] = useState<ItemInventario[]>([]);

  // Estados para el formulario de nuevo insumo/joya
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState<'Oreja' | 'Nariz' | 'Boca' | 'Cuerpo' | 'Insumo'>('Oreja');
  const [material, setMaterial] = useState<'Titanio ASTM F-136' | 'Acero Quirúrgico 316L' | 'Bioplástico' | 'Otro'>('Titanio ASTM F-136');
  const [stock, setStock] = useState<number>(10);
  const [precio, setPrecio] = useState<number>(15000);

  // Cargar inventario inicial o desde localStorage
  useEffect(() => {
    const datosGuardados = localStorage.getItem('ink_needle_inventario');
    if (datosGuardados) {
      setInventario(JSON.parse(datosGuardados));
    } else {
      // Inventario base cargado desde tu catálogo original
      const inventarioBase: ItemInventario[] = [
        { id: '1', nombre: 'Joyas para Septum (Argolla)', categoria: 'Nariz', material: 'Titanio ASTM F-136', stock: 25, precioServicio: 18000 },
        { id: '2', nombre: 'Labret para Nostril', categoria: 'Nariz', material: 'Titanio ASTM F-136', stock: 40, precioServicio: 15000 },
        { id: '3', nombre: 'Barbell Industrial', categoria: 'Oreja', material: 'Acero Quirúrgico 316L', stock: 15, precioServicio: 20000 },
        { id: '4', nombre: 'Banana para Navel (Ombligo)', categoria: 'Cuerpo', material: 'Titanio ASTM F-136', stock: 12, precioServicio: 18000 },
        { id: '5', nombre: 'Catéteres 16G (Insumo Médico)', categoria: 'Insumo', material: 'Otro', stock: 100, precioServicio: 0 }
      ];
      setInventario(inventarioBase);
      localStorage.setItem('ink_needle_inventario', JSON.stringify(inventarioBase));
    }
  }, []);

  const handleAgregarItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || stock < 0 || precio < 0) {
      alert('Por favor, ingresa valores válidos.');
      return;
    }

    const nuevoItem: ItemInventario = {
      id: crypto.randomUUID(),
      nombre,
      categoria,
      material,
      stock,
      precioServicio: precio
    };

    const listaActualizada = [...inventario, nuevoItem];
    setInventario(listaActualizada);
    localStorage.setItem('ink_needle_inventario', JSON.stringify(listaActualizada));

    // Limpiar formulario
    setNombre('');
    alert('Elemento añadido al inventario');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Menú Lateral */}
      <div style={{ width: '250px', backgroundColor: '#1e1e2f', color: 'white', padding: '20px' }}>
        <h3>Ink & Needle</h3>
        <p style={{ fontSize: '13px', color: '#a0a0b0' }}>Admin: {usuario?.nombre}</p>
        <Link to="/dashboard" style={{ color: 'white', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>🏠 Volver al Inicio</Link>
        <Link to="/clientes" style={{ color: '#d0d0d0', display: 'block', textDecoration: 'none' }}>👥 Gestión de Clientes</Link>
      </div>

      {/* Contenido */}
      <main style={{ flex: 1, padding: '30px', backgroundColor: '#f4f6f9' }}>
        <h2>📦 Control de Inventario y Joyería</h2>

        {/* Formulario */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>Ingresar Nueva Joya o Insumo Crítico</h3>
          <form onSubmit={handleAgregarItem} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div>
              <label>Nombre del Artículo / Joya</label>
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} placeholder="Ej: Argolla Clicker Click" />
            </div>
            <div>
              <label>Zona / Categoría</label>
              <select value={categoria} onChange={e => setCategoria(e.target.value as any)} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                <option value="Oreja">Oreja</option>
                <option value="Nariz">Nariz</option>
                <option value="Boca">Boca</option>
                <option value="Cuerpo">Cuerpo</option>
                <option value="Insumo">Insumo Médico</option>
              </select>
            </div>
            <div>
              <label>Material base</label>
              <select value={material} onChange={e => setMaterial(e.target.value as any)} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                <option value="Titanio ASTM F-136">Titanio ASTM F-136</option>
                <option value="Acero Quirúrgico 316L">Acero Quirúrgico 316L</option>
                <option value="Bioplástico">Bioplástico</option>
                <option value="Otro">Otro (Herramientas/Insumos)</option>
              </select>
            </div>
            <div>
              <label>Cantidad en Stock (Unidades)</label>
              <input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </div>
            <div>
              <label>Precio del Servicio asociado ($)</label>
              <input type="number" value={precio} onChange={e => setPrecio(Number(e.target.value))} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                ➕ Añadir al Stock
              </button>
            </div>
          </form>
        </div>

        {/* Tabla de Stock */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>Existencias en Bodega</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#eee', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Descripción</th>
                <th style={{ padding: '10px' }}>Categoría</th>
                <th style={{ padding: '10px' }}>Material</th>
                <th style={{ padding: '10px' }}>Stock Actual</th>
                <th style={{ padding: '10px' }}>Precio Venta/Servicio</th>
                <th style={{ padding: '10px' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {inventario.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{item.nombre}</td>
                  <td style={{ padding: '10px' }}>{item.categoria}</td>
                  <td style={{ padding: '10px' }}><small>{item.material}</small></td>
                  <td style={{ padding: '10px', color: item.stock <= 15 ? 'red' : 'black', fontWeight: item.stock <= 15 ? 'bold' : 'normal' }}>
                    {item.stock} uds {item.stock <= 15 && '⚠️ (Stock Bajo)'}
                  </td>
                  <td style={{ padding: '10px' }}>{item.precioServicio > 0 ? `$${item.precioServicio.toLocaleString('es-CL')}` : 'N/A'}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ backgroundColor: item.stock > 0 ? '#d4edda' : '#f8d7da', color: item.stock > 0 ? '#155724' : '#721c24', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>
                      {item.stock > 0 ? 'Disponible' : 'Agotado'}
                    </span>
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
