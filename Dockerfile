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

# Deshabilitar cache directamente en el contenedor
RUN echo '\
    server { \
        listen 80; \
        location / { \
            root /usr/share/nginx/html; \
            index index.html; \
            try_files $uri $uri/ /index.html; \
            add_header Cache-Control "no-cache, no-store, must-revalidate"; \
            add_header Pragma "no-cache"; \
            add_header Expires "0"; \
        } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]