<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./app/client/public/images/papaya/papaya-dark.png">
  <img width="250px" alt="Zisk logo" src="./app/client/public/images/papaya/papaya-light.png">
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

## Configuration

Zisk uses a YAML-based configuration system. Configuration files are stored in the `/config` directory:

- `default.yaml`: Default configuration values
- `local.yaml`: Local development overrides (gitignored)
- `docker.yaml`: Docker-specific configuration

See `config/README.md` for more details on the configuration system.

## Docker Setup

Zisk can be run using Docker containers for both the web server and CouchDB database. The containers are configured using the YAML configuration files.

### Setup

1. Review and modify the configuration files in the `/config` directory as needed:
   ```bash
   # For local development
   cp config/default.yaml config/local.yaml
   # Edit config/local.yaml with your settings
   ```

### Container Management

#### Database Container

- `make db` - Build and run the CouchDB container
- `make db-stop` - Stop the CouchDB container
- `make db-clean` - Clean up the CouchDB container and image
- `make logs-db` - View CouchDB logs

The CouchDB container will be accessible at the port specified in your configuration (default: 5984).

#### Web Server Container

- `make app` - Build and run the web server container
- `make app-stop` - Stop the web server container
- `make app-clean` - Clean up the web server container and image

The web server container will use the configuration from the YAML files, including the CouchDB connection details.

## Administration

Zisk provides a set of API endpoints for configuration management:

- `GET /api/admin/config`: Get the current configuration
- `PUT /api/admin/config`: Update the configuration
- `POST /api/admin/restart`: Restart the server

These endpoints require authentication and the `zisk:admin` role. See `config/README.md` for details on how to add this role to a user.
