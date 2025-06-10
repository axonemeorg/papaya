# Papaya Server

Papaya Server is a backend service designed to work seamlessly with CouchDB, providing authentication, configuration management, and API proxying capabilities for the Papaya application.

## Architecture Overview

### CouchDB Integration

Papaya Server is tightly coupled with CouchDB, using it as both an authentication provider and a data store. This architecture leverages CouchDB's built-in user management, authentication mechanisms, and database-per-user capabilities to create a secure and scalable backend solution.

Key integration points:

- **Authentication**: Papaya Server uses CouchDB's authentication system, extending it with JWT and refresh token support
- **User Management**: User accounts are stored in CouchDB's `_users` database
- **Data Storage**: Each user gets their own dedicated CouchDB database for storing application data
- **Configuration**: Server configuration is stored in a dedicated CouchDB database (`papaya_config`)
- **API Proxying**: Papaya Server acts as a proxy to CouchDB, adding authentication headers and handling token rotation

### Connection Model

Papaya Server requires a CouchDB instance URL to function. This URL is specified in the configuration and is used to establish a connection to the CouchDB server. The server uses the Node library [nano](https://github.com/apache/couchdb-nano) to interact with CouchDB.

```typescript
// Example of how the connection is established
this._couch = nano(`http://${adminUser}:${adminPass}@${url.split('//')[1]}`);
```

## Configuration

Papaya Server can be configured using YAML files. The configuration is loaded from the following locations, in order of precedence:

1. Docker environment (`/etc/papaya/config.yaml`)
2. Local configuration file (`local.yaml`)

The configuration includes settings for:

- CouchDB connection details (URL, port, admin credentials)
- Authentication secrets (JWT tokens)
- Server settings (port, name)

Example configuration:

```yaml
couchdb:
  url: 'http://localhost:5984'
  port: 5984
  admin_user: 'admin'
  admin_pass: 'password'
auth:
  access_token_secret: 'your-access-token-secret'
  refresh_token_secret: 'your-refresh-token-secret'
  access_token_hmac_kid: 'your-hmac-kid'
server:
  port: 3000
  name: 'papaya-server'
```

## CouchDB Requirements

### Admin Account

Papaya Server requires admin credentials for the CouchDB instance. These credentials are used to:

1. Create and manage user databases
2. Access the `_users` database for authentication and user management
3. Store and retrieve server configuration
4. Perform administrative operations on behalf of users

The admin credentials are specified in the configuration file and are used to establish the connection to CouchDB.

### Database-Per-User (couch_peruser)

Papaya Server relies on CouchDB's `couch_peruser` feature, which automatically creates a database for each user. This feature must be enabled in the CouchDB configuration.

When a user is created in the `_users` database, CouchDB automatically creates a database with the name `userdb-{hex encoded username}`. This database is owned by the user and is used to store the user's data.

Benefits of this approach:

- **Security**: Each user's data is isolated in their own database
- **Scalability**: Data is naturally partitioned by user
- **Simplicity**: No need for complex access control rules

## Packaging

The `/packaging` directory contains Docker configurations for setting up a complete Papaya environment, including a pre-configured CouchDB instance.

### Database Setup

The `/packaging/database` directory contains files for building a Docker image with a CouchDB instance configured for Papaya:

- **database.Dockerfile**: Extends the official CouchDB Docker image with Papaya-specific configurations
- **papaya.ini**: CouchDB configuration file that enables required features like `couch_peruser` and JWT authentication
- **setup.sh**: Script that configures CouchDB with admin credentials and JWT keys

Key configurations in the CouchDB setup:

1. **couch_peruser enabled**: Automatically creates a database for each user
   ```ini
   [couch_peruser]
   enable = true
   ```

2. **JWT authentication**: Configures CouchDB to accept JWT tokens for authentication
   ```ini
   [chttpd]
   authentication_handlers = {chttpd_auth, cookie_authentication_handler}, {chttpd_auth, jwt_authentication_handler}, {chttpd_auth, default_authentication_handler}
   ```

3. **CORS enabled**: Allows cross-origin requests, necessary for web clients
   ```ini
   [httpd]
   enable_cors = true
   ```

### Running with Docker

The Docker setup provides a complete environment for running Papaya Server with a properly configured CouchDB instance. This is the recommended way to run Papaya Server in production.

To build and run the Docker images:

```bash
# Build the images
docker-compose build

# Run the services
docker-compose up -d
```

## Development Setup

For local development, you can run Papaya Server directly:

1. Create a `local.yaml` file based on `local.example.yaml`
2. Install dependencies: `npm install`
3. Start the server: `npm start`

Make sure you have a CouchDB instance running and properly configured with `couch_peruser` enabled.

## API Endpoints

Papaya Server provides the following API endpoints:

- **GET /api**: Health check endpoint
- **POST /api/login**: User login endpoint
- **POST /api/logout**: User logout endpoint
- **GET /api/admin/config**: Get server configuration (admin only)
- **PUT /api/admin/config**: Update server configuration (admin only)
- **POST /api/admin/restart**: Restart the server (admin only)
- **All other paths**: Proxied to CouchDB with authentication headers

## Authentication Flow

Papaya Server implements a secure authentication flow using JWT access tokens and refresh tokens:

1. User logs in with username and password
2. Server validates credentials against CouchDB
3. Server issues an access token (short-lived) and a refresh token (long-lived)
4. Access token is used for API requests
5. When the access token expires, the refresh token is used to get a new access token
6. Refresh tokens are rotated on use to prevent token reuse
