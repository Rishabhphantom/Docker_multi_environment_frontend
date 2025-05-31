# Use an official Node runtime as a parent image
FROM node:18-alpine AS build-stage

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:alpine

# Set build argument for environment name, default to 'dev'
ARG ENV_NAME=dev

# Copy the built files from the previous stage to the default Nginx directory
COPY --from=build-stage /app/build /usr/share/nginx/html

# Copy all possible nginx configs
COPY nginx-*.conf /etc/nginx/conf.d/

# Use the correct config based on ENV_NAME
RUN mv /etc/nginx/conf.d/nginx-${ENV_NAME}.conf /etc/nginx/conf.d/default.conf \
    && rm /etc/nginx/conf.d/nginx-*.conf || true

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
