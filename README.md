<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./packages/papaya-web/public/images/papaya/papaya-dark.png">
  <img width="250px" alt="Papaya logo" src="./packages/papaya-web/public/images/papaya/papaya-light.png">
</picture>

The open-source, local-first personal finance app.

> [!IMPORTANT]
> Papaya is in a pre-alpha state, and only suitable for use by developers
>

This is the mono-repo source for services used to run Papaya.

## 🌟 Overview

Papaya is a modern, local-first personal finance application built with privacy and user control in mind. It leverages CouchDB's robust synchronization capabilities to provide seamless data access across devices while keeping your financial data under your control.

### Key Features

- 🔒 **Privacy-First**: Your data stays local and syncs only with your chosen CouchDB instance
- 🌐 **Local-First Architecture**: Works offline, syncs when online
- 📱 **Modern UI**: Built with React and Material-UI for a sleek, responsive experience
- 🔐 **Secure Authentication**: JWT-based authentication with CouchDB integration
- 📊 **Multi-Device Sync**: Seamless synchronization across all your devices
- 🛠️ **Developer-Friendly**: Open source with a modular architecture

## 🏗️ Architecture

Papaya consists of four main packages:

```
papaya/
├── packages/
│   ├── papaya-web/       # React frontend application
│   ├── papaya-server/    # Node.js backend API server
│   ├── papaya-docs/      # Next.js documentation site
│   └── papaya-shortcut/  # Quick access landing page
```

### Technology Stack

**Frontend (papaya-web):**
- React 19 with TypeScript
- Material-UI v7 for components
- TanStack Router for routing
- TanStack Query for data fetching
- PouchDB for local data storage
- Zustand for state management
- React Hook Form + Zod for form validation

**Backend (papaya-server):**
- Node.js with Express
- CouchDB integration via Nano
- JWT authentication
- TypeScript
- CORS and proxy middleware

**Database:**
- CouchDB with `couch_peruser` feature
- Database-per-user architecture
- Built-in replication and sync

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- CouchDB instance (local or remote)
- Docker (optional, for containerized deployment)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/papaya.git
   cd papaya
   ```

2. **Install dependencies**
   ```bash
   make install
   ```

3. **Start CouchDB**
   ```bash
   # Option 1: Using Docker
   make docker-dev
   
   # Option 2: Local CouchDB instance
   # Make sure CouchDB is running on localhost:5984
   ```

4. **Start development servers**
   ```bash
   # Terminal 1: Start the backend
   make dev-server
   
   # Terminal 2: Start the frontend
   make dev-client
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - CouchDB Admin: http://localhost:5984/_utils

### Production Deployment

#### Docker (Recommended)

```bash
# Build production image
make docker-build-prod

# Run with Docker Compose
make docker-dev-detached
```

#### Manual Deployment

```bash
# Build all packages
make build

# Deploy server package
cd packages/papaya-server
npm start
```

## 📖 Documentation

- **[Web App Documentation](./packages/papaya-web/README.md)** - Frontend development guide
- **[Server Documentation](./packages/papaya-server/README.md)** - Backend API and configuration
- **[Documentation Site](./packages/papaya-docs/README.md)** - User and developer docs
- **[Quick Access](./packages/papaya-shortcut/README.md)** - Landing page service

## 🛠️ Development

### Available Commands

```bash
# Development
make dev-client          # Start frontend dev server
make dev-server          # Start backend dev server

# Building
make build              # Build all packages
make web-build          # Build web package only
make build-server       # Build server package only

# Docker
make docker-dev         # Start development environment
make docker-stop        # Stop Docker services
make docker-clean       # Clean up Docker resources

# Maintenance
make clean              # Clean all build artifacts
make install            # Install all dependencies
```

### Project Structure

```
papaya/
├── packages/
│   ├── papaya-web/           # Frontend React application
│   │   ├── src/             # Source code
│   │   ├── public/          # Static assets
│   │   └── dist/            # Built assets
│   ├── papaya-server/       # Backend Express server
│   │   ├── src/             # Source code
│   │   ├── web-assets/      # Frontend assets for serving
│   │   └── dist/            # Compiled JavaScript
│   ├── papaya-docs/         # Documentation site (Next.js)
│   └── papaya-shortcut/     # Landing page (Next.js)
├── docker/                  # Docker configuration
├── Makefile                 # Build automation
└── README.md               # This file
```

## 🔧 Configuration

Papaya uses a flexible YAML-based configuration system. See the [server documentation](./packages/papaya-server/README.md) for detailed configuration options.

## 🤝 Contributing

https://axoneme.org/contributing
