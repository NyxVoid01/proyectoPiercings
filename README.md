
# ✒️ Ink & Needle - Intranet de Gestión

Sistema de intranet para la administración interna de un estudio de piercings y tatuajes. Desarrollado con React, TypeScript, Vite y persistencia de datos local.

## 📦 Módulos del Sistema

* **1. Inicio de Sesión (`/login`):** Pantalla de acceso que adapta las funciones según quién ingrese. Si entras como `admin`, tienes control total para editar o borrar. Si usas cualquier otro nombre, entras como personal (Staff) y solo podrás ver la información sin modificarla.
* **2. Panel Principal (`/dashboard`):** Es la pantalla de bienvenida y el menú central que te permite navegar rápidamente hacia todas las herramientas del estudio.
* **3. Agenda de Citas (`/citas`):** Un calendario interno para organizar las reservas. Aquí se guarda la fecha, la hora, qué tipo de perforación se hará y qué profesional atenderá al cliente.
* **4. Fichas de Clientes (`/clientes`):** Un registro de clientes enfocado en su salud y seguridad. Guarda sus datos de contacto, historial de alergias importantes y confirma si ya firmaron el consentimiento. Toda la información se guarda automáticamente en el navegador.
* **5. Inventario y Servicios (`/inventario`):** Control del catálogo de piercings, lista de precios y stock de materiales (joyas, agujas, insumos). Funciona con seguridad inteligente: solo los administradores pueden añadir o quitar productos, mientras que el resto del equipo solo puede consultar el stock disponible.

---

## 🛠️ Stack Tecnológico

* **Frontend:** React 18, TypeScript
* **Herramienta de Construcción:** Vite
* **Enrutamiento:** React Router Dom
* **Estado y Autenticación:** Context API (AuthContext)
* **Almacenamiento:** LocalStorage

---

## 🚀 Instalación y Configuración

paso 1: Navegar a la carpeta del proyecto:

cd proyecto-piercings

paso 2: Instalar las dependencias:

npm install

paso 3: Iniciar el servidor local:

npm run dev

paso 4: Visualización:

Abra en su navegador la dirección: http://localhost:5173

