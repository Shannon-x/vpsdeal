# STAGE 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the frontend source code
COPY public ./public
COPY src ./src
COPY babel.config.js .
COPY vue.config.js .
COPY tailwind.config.js .
COPY postcss.config.js .

# Set the API base URL for the build (can be overridden at build time)
ARG VUE_APP_API_BASE_URL=/api
ENV VUE_APP_API_BASE_URL=${VUE_APP_API_BASE_URL}

# Build frontend
RUN npm run build

# STAGE 2: Prepare Backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files and install dependencies
COPY server/package.json server/package-lock.json* ./
RUN npm install --production

# Copy the rest of the backend source code
COPY server ./

# STAGE 3: Final image with Nginx and Supervisor
FROM node:18-alpine

WORKDIR /app

# Install Nginx and Supervisor
RUN apk update && apk add --no-cache nginx supervisor

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/frontend/dist /app/frontend_dist

# Copy backend from backend-builder stage
COPY --from=backend-builder /app/backend /app/server

# Ensure data directory exists for backend and set permissions (if needed)
RUN mkdir -p /app/server/data && chown -R node:node /app/server/data
# If your backend runs as 'node' user, otherwise adjust or remove chown

# Copy Nginx and Supervisord configuration files
COPY nginx.vps.conf /etc/nginx/http.d/default.conf
COPY supervisord.vps.conf /etc/supervisor/conf.d/supervisord.vps.conf

# Expose the port Nginx will listen on (defined in nginx.vps.conf)
EXPOSE 8080

# Set user for backend (optional, good practice)
# USER node

# Start Supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.vps.conf"] 