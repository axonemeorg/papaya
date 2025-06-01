# syntax=docker/dockerfile:experimental

# Build stage for the Vite app
FROM node:20-alpine AS app-builder
WORKDIR /usr/src/app

# Copy app package files
COPY app/package*.json ./
RUN npm ci --force

# Copy app source files
COPY app/ ./

# Build the Vite app
RUN npm run build

# Build stage for the Express server
FROM node:20-alpine AS server-builder
WORKDIR /usr/src/app

# Copy server package files
COPY server/package*.json ./
RUN npm ci

# Copy server source files
COPY server/ ./

# Build the server
RUN npm run build


# Production stage
FROM node:20-alpine

# Copy built Vite app to the server's expected location
WORKDIR /usr/src/app/web
COPY --from=app-builder /usr/src/app/dist ./dist

ENV ZISK_APP_ENTRYPOINT="/usr/src/app/web/dist/index.html"

# Copy built server files
WORKDIR /usr/src/app/server
COPY --from=server-builder /usr/src/app/dist ./dist
COPY --from=server-builder /usr/src/app/package*.json .

# Install production dependencies only
RUN npm ci --omit=dev

# Expose the port the server runs on
EXPOSE 9475

# Start the server
CMD ["npm", "run", "start"]
