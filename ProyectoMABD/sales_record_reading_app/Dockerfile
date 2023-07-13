# Usamos una imagen de Node.js
FROM node:18

# Establecemos el directorio de trabajo
WORKDIR /usr/src/app

# Copiamos el package.json y el package-lock.json
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el código fuente de la aplicación
COPY . .

# Construimos la aplicación
RUN npm run build

# Exponemos el puerto que usa tu servidor Node.js
EXPOSE 3002

# Definimos el puerto en el que se ejecutará la aplicación
ENV PORT=3002

# Ejecutamos tu servidor Node.js
CMD [ "npm", "run", "startFront" ]
