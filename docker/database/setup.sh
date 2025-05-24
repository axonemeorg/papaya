#!/bin/bash

INI_FILE="/opt/couchdb/etc/local.d/couchdb.ini"

if [ -z "$COUCHDB_USER" ] || [ -z "$COUCHDB_PASSWORD" ]; then
  echo "Error: COUCHDB_USER or COUCHDB_PASSWORD not set."
  exit 1
fi

if ! grep -q "^\[admins\]" "$INI_FILE"; then
  echo -e "\n[admins]\n${COUCHDB_USER} = ${COUCHDB_PASSWORD}" >> "$INI_FILE"
else
  echo "The [admins] section was already present in $INI_FILE."
fi

COUCHDB_USER="$COUCHDB_USER" COUCHDB_PASSWORD="$COUCHDB_PASSWORD" /opt/couchdb/bin/couchdb &

COUCHDB_PID=$!

echo "Waiting for CouchDB to start..."
ATTEMPT=0
while [ $ATTEMPT -lt 10 ]; do
  if curl -s -u "$COUCHDB_USER:$COUCHDB_PASSWORD" http://127.0.0.1:5984/_up > /dev/null 2>&1; then
    echo "CouchDB is up."
    break
  fi
  ATTEMPT=$((ATTEMPT + 1))
#   echo "Attempt $ATTEMPT/10: waiting 1 second..."
  sleep 1
done

if [ $ATTEMPT -eq 10 ]; then
  echo "Error: CouchDB failed to start within 10 seconds"
  kill $COUCHDB_PID
  exit 1
fi

echo "Configuring JWT key..."
ENCODED_SECRET=$(echo -n "$AUTH_ACCESS_TOKEN_SECRET" | base64)

curl -X PUT -u "$COUCHDB_USER:$COUCHDB_PASSWORD" http://127.0.0.1:5984/_node/nonode@nohost/_config/jwt_keys/hmac:$AUTH_ACCESS_TOKEN_HMAC_KID \
  -H "Content-Type: application/json" \
  -d "\"$ENCODED_SECRET\""

kill $COUCHDB_PID
