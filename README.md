# Prueba Técnica TCS - CRUD Productos Financieros

Este proyecto es una prueba técnica para TCS, que consiste en un **CRUD de productos financieros de un banco**.  
El proyecto está dividido en **backend (Node.js)** y **frontend (Angular 18)**.

---

## 🛠 Tecnologías

- **Frontend:** Angular 18, RxJS, Reactive Forms  
- **Backend:** Node.js, Express  
- **Testing:** Jest para pruebas unitarias  
- **Otros:** CORS, SweetAlert2 para notificaciones  

---

## 📂 Estructura del Proyecto

📂 Estructura del Proyecto

root/
│
├─ client/                 # Frontend Angular 18.2.21
│  ├─ src/                 # Código fuente del frontend
│  │  ├─ app/              # Componentes, servicios, rutas y módulos de la app
│  │  │  ├─ core/          # Servicios globales, interceptores, constantes
│  │  │  └─ features/      # Funcionalidades específicas (ej: products)
│  │  │     ├─ products/   # CRUD de productos financieros
│  │  │     │  ├─ pages/   # Componentes de página (form, list)
│  │  │     │  ├─ services/ # Servicios relacionados a productos
│  │  │     │  ├─ models/  # Modelos de datos
│  │  │     │  └─ validators/ # Validaciones personalizadas
│  │  ├─ assets/           # Recursos estáticos (imágenes, estilos globales)
│  │  ├─ environments/     # Configuración de entornos (dev, prod)
│  │  ├─ index.html
│  │  ├─ main.ts
│  │  └─ styles.css
│  ├─ angular.json
│  ├─ package.json
│  ├─ jest.config.js        # Configuración de Jest
│  └─ tsconfig.json
│
├─ server/                 # Backend Node.js + Express
│  ├─ src/                 # Código fuente del backend
│  │  ├─ controllers/      # Controladores de las rutas (CRUD)
│  │  ├─ dto/              # Data Transfer Objects
│  │  ├─ interfaces/       # Interfaces de TypeScript
│  │  └─ const/            # Constantes globales (mensajes de error, etc.)
│  ├─ package.json
│  └─ tsconfig.json
│
└─ README.md               # Documentación del proyecto


---

## ⚡ Backend

1. Ir a la carpeta del backend:

cd ./repo-interview-main

2. Instalar dependencias:

npm install


3. Instalar CORS (si no está incluido):

npm install cors


4. Ejecutar en modo desarrollo (con reinicio automático):

npm run start:dev


El backend se ejecutará por defecto en http://localhost:3002.

🌐 Frontend

Ir a la carpeta del frontend:

cd client


Instalar dependencias:

npm install --legacy-peer-deps


Ejecutar el proyecto:

ng serve


El frontend se levantará en http://localhost:4200 y consumirá el backend en http://localhost:3002.

✅ Pruebas Unitarias

Desde la carpeta del frontend:

npm test


Esto ejecutará Jest y mostrará el reporte de cobertura. Resultados estimados: 
=============================== Coverage summary ===============================
Statements   : 97.22% ( 175/180 )
Branches     : 80% ( 44/55 )
Functions    : 96% ( 48/50 )
Lines        : 98.14% ( 159/162 )
================================================================================

Test Suites: 7 passed, 7 total
Tests:       37 passed, 37 total
Snapshots:   0 total
Time:        10.347 s
Ran all test suites.

⚙ Funcionalidades del CRUD

Crear productos financieros con validaciones de campos.

Editar productos existentes.

Eliminar productos con confirmación.

Listado y búsqueda de productos por nombre o descripción.

Validaciones y notificaciones centralizadas.

📌 Notas

No se suben al repositorio carpetas node_modules ni archivos de configuración locales (.env).

Para cualquier error de CORS, asegúrate de que el backend esté levantado y corriendo en http://localhost:3002.

La aplicación está lista para pruebas unitarias, con cobertura de servicios, formularios y componentes.

📚 Autor

Melany Secaira Zambrano
Prueba Técnica - TCS
