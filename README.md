# 📝 Notepad Fullstack App

Aplicación completa de notas con React (frontend) y NestJS (backend) usando TypeScript.

![Demo](https://via.placeholder.com/800x400?text=Notepad+App+Demo) <!-- Reemplaza con imagen real luego -->

## 🚀 Tecnologías Usadas

### Backend
- NestJS (Node.js framework)
- Prisma ORM
- TypeScript
- PostgreSQL (via Supabase)

### Frontend
- React 18
- Vite
- TypeScript
- React Icons
- CSS Modules

## 📋 Requisitos Previos

- Node.js v18+ (recomendado LTS)
- npm v9+ o yarn v1.22+
- PostgreSQL (o acceso a Supabase)
- Git

## 🛠️ Configuración Inicial

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/notepad-app.git
cd notepad-app
```

--------------------------
# Configurar variables de entorno:
---------------------------
- Backend
Crea un archivo .env en backend/ basado en .env.example:

DATABASE_URL="postgresql://user:password@localhost:5432/notepad?schema=public"
PORT=3001

- Frontend
Crea un archivo .env en frontend/:
VITE_API_URL=http://localhost:3001

🔧 Instalación
- Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev

- Frontend
cd ../frontend
npm install
npm run dev

#Estructura del proyecto
notepad-app/
├── backend/
│   ├── src/               # Código fuente NestJS
│   ├── prisma/            # Esquemas y migraciones
│   ├── test/              # Pruebas
│   └── package.json
├── frontend/
│   ├── public/            # Assets estáticos
│   ├── src/               # Código fuente React
│   └── vite.config.ts
├── .gitignore
└── README.md
