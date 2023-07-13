# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install --production

# Copia todos los archivos del proyecto al directorio de trabajo
COPY . .

# Expone el puerto 3001
EXPOSE 3001

# Define el comando para iniciar la aplicación
CMD ["npm", "run", "startBack"]
