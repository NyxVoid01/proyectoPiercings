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
  edad?: number;              // Con el '?' evitamos errores si falta en algún lado
  alergias: string;
  zonaPerforacion?: string;   // Opcional para que no choque con el CRUD
  fechaRegistro?: string;     // Opcional para que no choque con el CRUD
}

export interface Insumo {
  id: string;
  nombre: string; 
  categoria: 'joyeria' | 'herramientas' | 'insumos';
  stock: number;
  precio: number;
}
