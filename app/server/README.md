<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../app/public/images/logo/logo-w.svg">
  <img width="250px" alt="Papaya logo" src="../app/public/images/logo/logo-b.svg">
</picture>

# Papaya Server
Papaya Server is a web server for managing the syncing of a Papaya journal. Data replication is implemented by CouchDB.

## Why Papaya Server?
By default, the Papaya app only stores your data locally on-device using PouchDB - a JavaScript implementation of CouchDB. Papaya Server is a set self-managed services that makes it easier to maintain your own private instance of CouchDB.

## Setup

This section will get you set up using Papaya Server

### 1. Database

Papaya uses CouchDB. You can use the provided Docker image to start a pre-configured instance of CouchDB (recommended), or you can manually set up an existing database

#### Pre-Configured Setup

```
cd docker
docker build -t you/papaya-couchdb ./database
docker run -d -p 5984:5984 you/papaya-couchdb
```

#### Manual Setup

This encompasses the end-to-end setup steps.

1. Spin up a new instance of CouchDB in Docker
```
TODO insert docker command for running couchDB
```

2. 