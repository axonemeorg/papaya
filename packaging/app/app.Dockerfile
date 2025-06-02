# syntax=docker/dockerfile:experimental

FROM node:20-alpine AS server-build
WORKDIR /usr/src/app
COPY app ./

# Client
WORKDIR /usr/src/app/client
RUN npm install
RUN npm run build

# Server
WORKDIR /usr/src/app/server
RUN npm install
RUN npm run build

EXPOSE 9475

# Start the server
CMD ["npm", "run", "start"]
