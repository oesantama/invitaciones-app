# 🚀 Guía de Deploy - EventInvite

Esta guía te mostrará cómo desplegar tu aplicación EventInvite en diferentes plataformas.

## 📋 Tabla de Contenido

1. [Deploy Local con Docker](#deploy-local)
2. [Deploy en Render](#deploy-en-render)
3. [Deploy en Railway](#deploy-en-railway)
4. [Deploy en DigitalOcean](#deploy-en-digitalocean)
5. [Deploy en AWS](#deploy-en-aws)
6. [Deploy en Vercel + MongoDB Atlas](#deploy-en-vercel)

---

## 🏠 Deploy Local

```bash
# Clonar repositorio
git clone <tu-repo>
cd invitaciones-app

# Iniciar todos los servicios
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

**URLs:**
- Frontend: http://localhost:9001
- Backend API: http://localhost:3000
- MongoDB: localhost:27017

---

## 🔵 Deploy en Render

**Opción 1: Todo en Render (Recomendado)**

### Backend + MongoDB

1. **Crear cuenta en Render.com**
2. **Crear MongoDB en Render**
   - New → PostgreSQL/MongoDB → MongoDB
   - Plan Free (512MB)
   - Guardar la `MONGODB_URI`

3. **Deploy Backend**
   - New → Web Service
   - Connect tu repositorio de GitHub
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables:
     ```
     NODE_ENV=production
     PORT=3000
     MONGODB_URI=<tu-mongodb-uri-de-render>
     JWT_SECRET=<genera-un-secret-seguro>
     CORS_ORIGIN=*
     ```

4. **Deploy Frontend**
   - New → Static Site
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Environment Variables:
     ```
     VITE_API_URL=<url-de-tu-backend>/api
     ```

**Precio:** Gratis para proyectos pequeños

---

## 🚂 Deploy en Railway

### 1. Instalar Railway CLI
```bash
npm install -g @railway/cli
railway login
```

### 2. Deploy

```bash
# Crear nuevo proyecto
railway init

# Deploy Backend
cd backend
railway up

# Configurar variables
railway variables set NODE_ENV=production
railway variables set MONGODB_URI=mongodb://...
railway variables set JWT_SECRET=your-secret

# Deploy Frontend
cd ../frontend
railway up
railway variables set VITE_API_URL=https://your-backend.railway.app/api
```

**Precio:** $5/mes con $5 de crédito gratis

---

## 🌊 Deploy en DigitalOcean

### Opción 1: App Platform (Fácil)

1. **Crear cuenta en DigitalOcean**
2. **Apps → Create App**
3. **Conectar GitHub**
4. **Configurar Backend:**
   - Type: Web Service
   - Source Directory: `/backend`
   - Build Command: `npm install`
   - Run Command: `npm start`
   - HTTP Port: 3000
   - Environment Variables:
     - `NODE_ENV=production`
     - `MONGODB_URI=<tu-mongodb-uri>`
     - `JWT_SECRET=<tu-secret>`

5. **Configurar Frontend:**
   - Type: Static Site
   - Source Directory: `/frontend`
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist`

6. **Agregar MongoDB Managed Database**
   - Create → Databases → MongoDB
   - Conectar al App

**Precio:** ~$10-12/mes

### Opción 2: Droplet con Docker (Más control)

```bash
# Crear Droplet Ubuntu 22.04
# SSH al servidor
ssh root@your-ip

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clonar repo
git clone <tu-repo>
cd invitaciones-app

# Configurar variables de entorno
cp backend/.env.example backend/.env
# Editar backend/.env con tus valores

# Deploy
docker-compose up -d

# Configurar Nginx (opcional)
sudo apt install nginx
sudo nano /etc/nginx/sites-available/eventinvite
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:9001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**Precio:** $6/mes (Droplet básico)

---

## ☁️ Deploy en AWS

### Usando AWS ECS (Elastic Container Service)

1. **Crear cuenta AWS**
2. **Instalar AWS CLI**
3. **Crear ECR Repositories:**
   ```bash
   aws ecr create-repository --repository-name eventinvite-frontend
   aws ecr create-repository --repository-name eventinvite-backend
   ```

4. **Build y Push imágenes:**
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

   # Build y push frontend
   cd frontend
   docker build -t eventinvite-frontend .
   docker tag eventinvite-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/eventinvite-frontend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/eventinvite-frontend:latest

   # Build y push backend
   cd ../backend
   docker build -t eventinvite-backend .
   docker tag eventinvite-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/eventinvite-backend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/eventinvite-backend:latest
   ```

5. **Crear MongoDB en MongoDB Atlas**
6. **Crear ECS Cluster y Task Definitions**
7. **Deploy con Fargate**

**Precio:** Variable, desde $15/mes

---

## ▲ Deploy en Vercel + MongoDB Atlas

**Esta es la opción más económica y rápida**

### 1. MongoDB Atlas (Base de datos)

1. **Crear cuenta en MongoDB Atlas**
2. **Create New Cluster** (Free tier M0)
3. **Database Access** → Add User
4. **Network Access** → Add IP (0.0.0.0/0 para permitir todo)
5. **Copiar Connection String**

### 2. Backend en Render o Railway

Usar las instrucciones de Render o Railway de arriba para el backend.

### 3. Frontend en Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Configurar variables de entorno en Vercel Dashboard
VITE_API_URL=https://your-backend.railway.app/api
```

**Precio:** Gratis (Vercel) + Gratis (MongoDB Atlas M0)

---

## 🔐 Variables de Entorno

### Backend (.env)
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/invitaciones
JWT_SECRET=genera-un-secret-muy-seguro-aleatorio
CORS_ORIGIN=https://tu-frontend.com
```

### Frontend (.env)
```env
VITE_API_URL=https://tu-backend.com/api
```

---

## 🎯 Recomendaciones por Presupuesto

| Presupuesto | Opción Recomendada |
|-------------|-------------------|
| **Gratis** | Vercel (Frontend) + Render (Backend) + MongoDB Atlas (Free) |
| **$5-10/mes** | Railway (Todo en uno) |
| **$10-20/mes** | DigitalOcean App Platform |
| **$20+/mes** | DigitalOcean Droplet con control total |
| **Empresa** | AWS ECS + RDS + CloudFront |

---

## 🔒 Seguridad

Antes de hacer deploy en producción:

1. ✅ Cambiar `JWT_SECRET` por uno seguro
2. ✅ Configurar `CORS_ORIGIN` con tu dominio real
3. ✅ Usar HTTPS (certificados SSL)
4. ✅ Configurar firewall en el servidor
5. ✅ Hacer backup regular de MongoDB
6. ✅ Configurar rate limiting
7. ✅ Validar todas las entradas del usuario

---

## 📊 Monitoreo

- **Uptime:** UptimeRobot (gratis)
- **Logs:** Logtail, Papertrail
- **Performance:** New Relic, DataDog
- **Errores:** Sentry

---

## 🆘 Troubleshooting

### Error: CORS
```javascript
// Backend: Actualizar CORS_ORIGIN
CORS_ORIGIN=https://tu-dominio.com
```

### Error: MongoDB Connection
- Verificar IP whitelist en MongoDB Atlas
- Verificar connection string
- Verificar red del servidor

### Error: 502 Bad Gateway
- Verificar que el backend esté corriendo
- Verificar health checks
- Ver logs del contenedor

---

## 📞 Soporte

Para más ayuda:
- GitHub Issues
- Discord de la comunidad
- Stack Overflow

---

¡Listo! Tu aplicación EventInvite está lista para producción 🎉
