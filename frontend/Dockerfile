# --- Etapa 1: Construcción (Builder) ---
FROM node:22-slim AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias con optimizaciones
RUN npm install --prefer-offline --no-audit

# Copiar el resto del código
COPY . .

# Build con optimizaciones
RUN npm run build

# --- Etapa 2: Servidor con Nginx (Más liviano y rápido) ---
FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html

# Remover archivos por defecto de nginx
RUN rm -rf ./*

# Copiar archivos del build
COPY --from=builder /app/dist .

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Instalar wget para healthcheck
RUN apk add --no-cache wget

EXPOSE 9001

# Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]