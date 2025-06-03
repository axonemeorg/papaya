# syntax=docker/dockerfile:experimental

FROM node:20-alpine AS server-build
WORKDIR /usr/src/app

# Copy application code
COPY app ./

# Create directory for zisk config
RUN mkdir -p /etc/zisk

# Copy configuration files
COPY config/docker.yaml /etc/zisk/config.yaml

# Install yq for YAML parsing
RUN apk add --no-cache yq

# Keep yq for reading auth configuration

# Client
WORKDIR /usr/src/app/client
RUN npm install
RUN npm run build

# Server
WORKDIR /usr/src/app/server
RUN npm install
RUN npm run build

# Use fixed port
EXPOSE 9475

# Start the server
CMD ["npm", "run", "start"]
