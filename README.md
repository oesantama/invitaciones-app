# 🎉 EventInvite - Sistema de Invitaciones Digitales

Una aplicación fullstack moderna para crear y gestionar invitaciones digitales para eventos, con confirmación de asistencia, códigos QR, y panel administrativo.

![Tech Stack](https://img.shields.io/badge/React-18-blue)
![Tech Stack](https://img.shields.io/badge/TypeScript-5-blue)
![Tech Stack](https://img.shields.io/badge/Node.js-22-green)
![Tech Stack](https://img.shields.io/badge/MongoDB-8-green)
![Tech Stack](https://img.shields.io/badge/Docker-Ready-blue)

## ✨ Características

### Frontend
- ⚡ **React 18** con TypeScript
- 🎨 **Tailwind CSS** para estilos modernos
- 🎬 **Framer Motion** para animaciones fluidas
- 📱 **100% Responsive** - Adaptado para móviles
- 🎯 **Vite** para desarrollo rápido
- 🔐 **Autenticación JWT**

### Backend
- 🚀 **Node.js + Express**
- 🍃 **MongoDB** con Mongoose
- 🔒 **JWT** para autenticación
- 🛡️ **Helmet** para seguridad
- ✅ **Validación** con express-validator
- 📊 **API RESTful** completa

### Funcionalidades
- 📋 Creación y gestión de eventos
- 👥 Gestión de invitados
- 💌 Invitaciones personalizadas
- 📱 Códigos QR únicos por invitado
- ✅ Confirmación de asistencia online
- 📊 Dashboard con estadísticas
- 🎨 Personalización de temas
- 📍 Integración con Google Maps
- 📅 Cronograma de eventos
- 📸 Galería de fotos

## 🚀 Inicio Rápido

### Opción 1: Docker (Recomendado)

```bash
# Clonar el repositorio
git clone <tu-repo>
cd invitaciones-app

# Iniciar todos los servicios
docker-compose up --build -d

# Ver logs
docker-compose logs -f
```

**URLs:**
- Frontend: http://localhost:9001
- Backend API: http://localhost:3000/api
- MongoDB: localhost:27017

### Opción 2: Desarrollo Local

#### Backend

```bash
cd backend
npm install

# Crear archivo .env
cp .env.example .env

# Iniciar servidor
npm run dev
```

#### Frontend

```bash
cd frontend
npm install

# Crear archivo .env
cp .env.example .env

# Iniciar desarrollo
npm run dev
```

## 📁 Estructura del Proyecto

```
invitaciones-app/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── contexts/        # Contextos de React
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── services/        # Servicios API
│   │   └── main.tsx         # Entry point
│   ├── Dockerfile
│   ├── nginx.conf          # Configuración Nginx
│   └── package.json
│
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── models/         # Modelos de MongoDB
│   │   ├── routes/         # Rutas de la API
│   │   ├── middleware/     # Middleware personalizado
│   │   └── server.js       # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml      # Orquestación de contenedores
├── DEPLOY.md              # Guía de despliegue
└── README.md              # Este archivo
```

## 🔌 API Endpoints

### Autenticación
```
POST   /api/auth/register    - Registrar nuevo usuario
POST   /api/auth/login       - Iniciar sesión
GET    /api/auth/me          - Obtener usuario actual
PUT    /api/auth/profile     - Actualizar perfil
```

### Eventos
```
GET    /api/events           - Listar eventos del usuario
GET    /api/events/:id       - Obtener evento específico
POST   /api/events           - Crear nuevo evento
PUT    /api/events/:id       - Actualizar evento
DELETE /api/events/:id       - Eliminar evento
GET    /api/events/:id/stats - Estadísticas del evento
```

### Invitados
```
GET    /api/guests/invitation/:eventId/:code  - Ver invitación (público)
POST   /api/guests/confirm/:eventId/:code     - Confirmar asistencia (público)
POST   /api/guests/:eventId/:guestId/attend   - Marcar asistencia
POST   /api/guests/:eventId/guests            - Agregar invitado
```

## 🎨 Capturas de Pantalla

### Homepage
![Homepage](docs/screenshots/homepage.png)

### Panel Administrativo
![Admin](docs/screenshots/admin.png)

### Invitación Digital
![Invitation](docs/screenshots/invitation.png)

## 🔧 Tecnologías Utilizadas

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router DOM
- Axios
- Lucide React (iconos)
- html2canvas, jsPDF, QRCode
- Vite

### Backend
- Node.js 22
- Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Helmet (seguridad)
- CORS
- Morgan (logs)
- express-validator

### DevOps
- Docker & Docker Compose
- Nginx (servidor estático)
- GitHub Actions (CI/CD)

## 🌐 Deploy en Producción

Ver [DEPLOY.md](DEPLOY.md) para instrucciones detalladas de despliegue en:

- ✅ **Render** (Gratis)
- ✅ **Railway** ($5/mes)
- ✅ **DigitalOcean** ($6-12/mes)
- ✅ **AWS** (Variable)
- ✅ **Vercel + MongoDB Atlas** (Gratis)

## 🔐 Variables de Entorno

### Backend (.env)
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/invitaciones
JWT_SECRET=tu-secret-muy-seguro
CORS_ORIGIN=*
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## 📝 Scripts Disponibles

### Frontend
```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run preview  # Preview build
npm run lint     # Linter
```

### Backend
```bash
npm start        # Producción
npm run dev      # Desarrollo con nodemon
```

### Docker
```bash
docker-compose up -d          # Iniciar servicios
docker-compose down           # Detener servicios
docker-compose logs -f        # Ver logs
docker-compose restart        # Reiniciar servicios
```

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea tu Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al Branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)

## 🙏 Agradecimientos

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!
