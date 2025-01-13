#!/bin/bash

# Wait for CouchDB to start (poll until it responds)
until curl -s http://127.0.0.1:5984/_up > /dev/null; do
  echo "Waiting for CouchDB to start..."
  sleep 2
done

# Create the `_users` and `_replicator` tables without authentication
curl -X PUT http://127.0.0.1:5984/_users || echo "_users database already exists"
curl -X PUT http://127.0.0.1:5984/_replicator || echo "_replicator database already exists"

# Set admin credentials from environment variables
if [ -n "$ZISK_COUCHDB_ADMIN_USER" ] && [ -n "$ZISK_COUCHDB_ADMIN_PASS" ]; then
  # Use the _config API to set the admin user
  curl -X PUT http://127.0.0.1:5984/_node/nonode@nohost/_config/admins/$ZISK_COUCHDB_ADMIN_USER -d "\"$ZISK_COUCHDB_ADMIN_PASS\""
fi

echo "Setup completed."
