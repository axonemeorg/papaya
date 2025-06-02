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

# Extract port from config and set as build arg
RUN export SERVER_PORT=$(yq eval '.server.port' /etc/zisk/config.yaml) && \
    echo "Exposing port $SERVER_PORT" && \
    echo "SERVER_PORT=$SERVER_PORT" > /etc/zisk/port.env

# Client
WORKDIR /usr/src/app/client
RUN npm install
RUN npm run build

# Server
WORKDIR /usr/src/app/server
RUN npm install
RUN npm run build

# Read port from environment file
ARG SERVER_PORT
RUN . /etc/zisk/port.env && \
    echo "EXPOSE $SERVER_PORT" && \
    echo "EXPOSE $SERVER_PORT" > /etc/zisk/expose.docker

# Expose the port from config
EXPOSE ${SERVER_PORT:-9475}

# Start the server
CMD ["npm", "run", "start"]
