React Frontend App

📦 Features
Built with Create React App
Multi-environment support: dev, qa, prod
Docker multi-stage build for optimized image size
Nginx-based static file serving
Environment-specific API URL injection via .env files
Proxy /api/ requests to matching backend service

🛠️ Prerequisites
Make sure you have the following installed before getting started:

Node.js v16 or higher
npm or yarn
Docker
Docker Compose

📁 Folder Structure
/frontend
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── index.js
│   └── ...
├── nginx-dev.conf
├── nginx-qa.conf
├── nginx-prod.conf
├── .env.dev
├── .env.qa
├── .env.prod
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md

🧪 Environment Configuration
The app supports three environments: development, staging (QA), and production. Each has its own .env file:

🟢 .env.dev
ENV_NAME=dev
REACT_APP_ENV=development
REACT_APP_API_URL=http://backend-dev:4000
REACT_APP_DEBUG=true
REACT_APP_ANALYTICS=false

🟡 .env.qa
ENV_NAME=qa
REACT_APP_ENV=staging
REACT_APP_API_URL=https://backend-qa:4001 
REACT_APP_DEBUG=false
REACT_APP_ANALYTICS=true

🔵 .env.prod
ENV_NAME=prod
REACT_APP_ENV=production
REACT_APP_API_URL=http://backend-prod:4002
REACT_APP_DEBUG=false
REACT_APP_ANALYTICS=true

These files define:

The environment name
The base API URL used in the app
Feature flags like analytics or debug mode

🐳 Dockerfile Overview
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

✅ Key Features:
Uses node:18-alpine and nginx:alpine for small images.
Supports different environments via ENV_NAME.
Injects environment variables at build time.
Copies only relevant Nginx config per environment.
Serves static files using Nginx with proper routing and fallback.

🧩 Nginx Configuration Files
Each environment has a dedicated Nginx config that:

Serves the React app
Proxies /api/ requests to the appropriate backend

🟢 nginx-dev.conf
server {
    listen 80;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ =404;
    }

    # Proxy API calls to dev backend
    location /api/ {
        proxy_pass http://backend-dev:4000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

🟡 nginx-qa.conf
server {
    listen 80;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ =404;
    }

    # Proxy API calls to staging backend
    location /api/ {
        proxy_pass http://backend-qa:4001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

🔵 nginx-prod.conf

server {
    listen 80;

    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ =404;
    }

    # Proxy API calls to production backend
    location /api/ {
        proxy_pass http://backend-prod:4002/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}


🧩 Docker Compose Setup

version: '3.8'

services:

  frontend-dev:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        ENV_NAME: dev
    container_name: frontend-dev
    ports:
      - "3000:80"
    networks:
      - my_app_network

  frontend-qa:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        ENV_NAME: qa
    ports:
      - "3001:80"
    networks:
      - my_app_network

  frontend-prod:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        ENV_NAME: prod
    container_name: frontend-prod
    ports:
      - "3002:80"
    networks:
      - my_app_network

networks:
  my_app_network:
    external: true

  🧪 Running the App
docker compose up -d

Or build/run individual services:

🟢 Dev Environment

docker build --build-arg ENV_NAME=dev -t frontend-dev .
docker run -d -p 3000:80 --name frontend-dev frontend-dev

🟡 QA Environment
docker build --build-arg ENV_NAME=qa -t frontend-qa .
docker run -d -p 3001:80 --name frontend-qa frontend-qa

🔵 Production Environment
docker build --build-arg ENV_NAME=prod -t frontend-prod .
docker run -d -p 3002:80 --name frontend-prod frontend-prod

📦 Package Management
All dependencies are managed through package.json. Use the following commands:

npm install
Install all dependencies
npm install axios
Add new dependency
npm outdated
Check for outdated packages
npm update
Update packages

Always commit changes to package.json and package-lock.json.

🚀 Deployment
For production deployment:

Ensure backend services (backend-dev, backend-qa, backend-prod) are running
Use Docker Compose to manage services
Monitor logs: docker logs frontend-prod
Optionally add HTTPS using Let’s Encrypt + Certbot
  









