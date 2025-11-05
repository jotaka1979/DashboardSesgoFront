# Etapa 1: Compilar la aplicación Angular
FROM node:22-alpine AS build

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Construir la aplicación para producción
RUN npm run build -- --configuration production

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copiar el build de Angular al directorio de Nginx
COPY --from=build /app/dist/DashboardSesgo/browser/* /usr/share/nginx/html/

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
