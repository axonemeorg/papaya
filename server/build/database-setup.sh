#!/bin/bash

set -e

CONFIG_MARKER="/opt/couchdb/etc/local.d/setup_completed"

# Run setup only if the marker file does not exist
if [[ ! -f "$CONFIG_MARKER" ]]; then
  echo "Running initial setup for CouchDB."

  # Ensure required environment variables are present
  if [[ -z "$AUTH_ACCESS_TOKEN_SECRET" || -z "$AUTH_ACCESS_TOKEN_HMAC_KID" ]]; then
    echo "Environment variables AUTH_ACCESS_TOKEN_SECRET and AUTH_ACCESS_TOKEN_HMAC_KID must be set."
    exit 1
  fi

  # Base64 encode the secret
  ENCODED_SECRET=$(echo -n "$AUTH_ACCESS_TOKEN_SECRET" | base64)

  # Add the secret to the CouchDB config file
  CONFIG_FILE="/opt/couchdb/etc/local.d/couchdb.ini"
  mkdir -p "$(dirname "$CONFIG_FILE")"
  cat >> "$CONFIG_FILE" <<EOF

[jwt_keys]
hmac:$AUTH_ACCESS_TOKEN_HMAC_KID = $ENCODED_SECRET
EOF

  echo "CouchDB configured with JWT secret."

  # Create a marker file to indicate setup is complete
  touch "$CONFIG_MARKER"
else
  echo "Setup has already been completed. Skipping initial configuration."
fi
