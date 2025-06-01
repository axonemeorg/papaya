# syntax=docker/dockerfile:experimental

FROM node:20-alpine AS server-build
WORKDIR /usr/src/app
COPY app ./
WORKDIR /usr/src/app/client

# Install dependencies
RUN npm install

WORKDIR /usr/src/app/server

# Install dependencies
RUN npm install

EXPOSE 9475

# Start the server
CMD ["npm", "run", "start"]
