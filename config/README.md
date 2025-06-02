# Zisk Configuration System

This directory contains the configuration files for Zisk. The configuration system uses YAML files to store configuration values, which are then loaded by the server at startup.

## Configuration Files

- `default.yaml`: The default configuration values. This file should be committed to the repository.
- `local.yaml`: Local configuration overrides. This file is gitignored and should be used for local development.
- `docker.yaml`: Docker-specific configuration. This file is used when building Docker images.

## Configuration Locations

The configuration system looks for configuration files in the following locations:

1. `/etc/zisk/config.yaml`: Used in Docker containers
2. `config/local.yaml`: Local development overrides
3. `config/default.yaml`: Default configuration

## Configuration Structure

The configuration is structured as follows:

```yaml
couchdb:
  url: http://localhost:5984
  port: 5984
  admin_user: admin
  admin_pass: surfboard

auth:
  access_token_secret: a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e5e5e5
  refresh_token_secret: a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e5e5e5
  access_token_hmac_kid: zisk

server:
  port: 9475
  name: myserver
```

## Configuration Management

The configuration is managed through the following components:

1. **ConfigService**: A singleton service that loads and manages the configuration.
2. **ConfigController**: A controller that provides API endpoints for managing the configuration.
3. **CouchDB Storage**: The configuration is stored in a CouchDB database called `zisk_config`.

## API Endpoints

The following API endpoints are available for managing the configuration:

- `GET /api/admin/config`: Get the current configuration.
- `PUT /api/admin/config`: Update the configuration.
- `POST /api/admin/restart`: Restart the server to apply configuration changes.

These endpoints require authentication and the `zisk:admin` role.

## Adding the zisk:admin Role

To add the `zisk:admin` role to a user, you can use the CouchDB API:

```bash
curl -X PUT http://admin:password@localhost:5984/_users/org.couchdb.user:username \
  -H "Content-Type: application/json" \
  -d '{"_id": "org.couchdb.user:username", "name": "username", "roles": ["zisk:admin"], "type": "user", "password": "password"}'
```

Replace `admin:password` with your CouchDB admin credentials, and `username` and `password` with the user's credentials.

If the user already exists, you'll need to include the `_rev` field in the request body:

```bash
curl -X GET http://admin:password@localhost:5984/_users/org.couchdb.user:username \
  -H "Accept: application/json"
```

Then update the user:

```bash
curl -X PUT http://admin:password@localhost:5984/_users/org.couchdb.user:username \
  -H "Content-Type: application/json" \
  -d '{"_id": "org.couchdb.user:username", "_rev": "1-abc123", "name": "username", "roles": ["zisk:admin"], "type": "user", "password": "password"}'
```

## Docker Integration

When building Docker images:

1. The `docker.yaml` configuration file is copied to `/etc/zisk/config.yaml` in the container.
2. A Docker network named `zisk-network` is created to allow communication between containers.
3. The CouchDB container is named `zisk-couchdb` and is accessible to the app container via the Docker network.
