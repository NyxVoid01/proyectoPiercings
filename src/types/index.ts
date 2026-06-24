
// src/types/index.ts

export interface Usuario {
  id: string;
  nombre: string;
  rol: 'administrador' | 'perforador';
}

export interface Cliente {
  id: string;
  nombre: string;
  rut: string;
  telefono: string;
  zonaPerforacion: string; 
  alergias: string;
  fechaRegistro: string;
}

export interface Insumo {
  id: string;
  nombre: string; 
  categoria: 'joyeria' | 'herramientas' | 'insumos';
  stock: number;
  precio: number;
}