<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./app/public/images/logo/logo-w.svg">
  <img width="250px" alt="Zisk logo" src="./app/public/images/logo/logo-b.svg">
</picture>

The open-source, local-first personal finance app.

> [!IMPORTANT]
> Zisk is in a pre-alpha state, and only suitable for use by developers
>

This is the mono-repo source for services used to run Zisk.

## Services

### Client
This is the web frontend for Zisk. Core dependencies include:
 - PouchDB
 - React
 - Material-UI
 - Emotion
 - Tanstack Router
 - Tanstack Query
 - React-Hook-Form
 - Zod
 - Zustand

Please see `app/client/README.md` for more info.

### Server

This is the server for hosting Zisk. It serves a backend API and the app frontend, as well as a proxy to your CouchDB instance.

Please see `app/server/README.md` for more info.

## Docker Setup

Zisk can be run using Docker containers for both the web server and CouchDB database. The containers are configured to use environment variables from the `.env` file.

### Setup

1. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file to set your desired configuration, including:
   - `ZISK_SERVER_PORT`: Port for the web server
   - `ZISK_COUCHDB_URL`: URL for the CouchDB database
   - `ZISK_COUCHDB_ADMIN_USER`: CouchDB admin username
   - `ZISK_COUCHDB_ADMIN_PASS`: CouchDB admin password

### Container Management

#### Database Container

- `make db` - Build and run the CouchDB container
- `make db-stop` - Stop the CouchDB container
- `make db-clean` - Clean up the CouchDB container and image
- `make logs-db` - View CouchDB logs

The CouchDB container will be accessible at the port specified in your `.env` file (default: 5984).

#### Web Server Container

- `make app` - Build and run the web server container
- `make app-stop` - Stop the web server container
- `make app-clean` - Clean up the web server container and image

The web server container will use the environment variables from your `.env` file, including the `ZISK_COUCHDB_URL` to connect to your CouchDB instance.
