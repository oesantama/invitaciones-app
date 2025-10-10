# --- Etapa 1: Construcción (Builder) ---
FROM node:22-slim AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias usando npm ci
RUN npm ci

# Copiar el resto del código de la aplicación
COPY . .

# Ejecutar el build del proyecto (Quasar CLI, Vue CLI, etc.)
# Esto generará los archivos estáticos en la carpeta 'dist'
RUN npm run build

# --- Etapa 2: Ejecución (Runner) ---
# Usamos la misma imagen de Node.js, pero ahora solo para ejecutar la app.
# Esta imagen será más grande que una de Nginx, pero evita la dependencia de Nginx.
FROM node:22-slim AS runner

WORKDIR /app

# Copiar SOLO los archivos de la carpeta 'dist' de la etapa builder.
# Esto mantiene la imagen limpia, sin el código fuente de desarrollo.
COPY --from=builder /app/dist ./dist

# Instalar un servidor de archivos estáticos como 'serve' globalmente
# Si usas Quasar, puede que ya tengas un comando de producción.
# Si usas Vue CLI, el 'dist' suele ser servible directamente.
RUN npm install -g serve

# Exponer el puerto que el servidor usará (ej: 80 o 3000)
# 'serve' por defecto usa el puerto 5000, pero podemos configurarlo.
EXPOSE 9001

# Comando para ejecutar el servidor de archivos estáticos.
# 'serve -s dist' le dice que sirva el contenido de la carpeta 'dist'.
# '-l 80' le dice que escuche en el puerto 80.
# '-C' (o --cors) es útil si tu frontend necesita hacer requests a otro origen.
CMD ["serve", "-s", "dist", "-l", "9001", "--cors"]