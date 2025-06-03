#!/bin/bash

# Path to the YAML configuration file
CONFIG_FILE="/etc/zisk/config.yaml"

# Create directory for zisk config if it doesn't exist
mkdir -p /etc/zisk

# Function to extract values from YAML using yq
get_yaml_value() {
  local key=$1
  yq eval ".$key" "$CONFIG_FILE"
}

# Extract configuration values
ZISK_COUCHDB_ADMIN_USER=$(get_yaml_value "couchdb.admin_user")
ZISK_COUCHDB_ADMIN_PASS=$(get_yaml_value "couchdb.admin_pass")
AUTH_ACCESS_TOKEN_SECRET=$(get_yaml_value "auth.access_token_secret")
AUTH_ACCESS_TOKEN_HMAC_KID=$(get_yaml_value "auth.access_token_hmac_kid")

INI_FILE="/opt/couchdb/etc/default.d/zisk.ini"

# Add admins section
echo -e "\n[admins]\n${ZISK_COUCHDB_ADMIN_USER} = ${ZISK_COUCHDB_ADMIN_PASS}" >> "$INI_FILE"

# Encode the JWT secret
ENCODED_SECRET=$(echo -n "$AUTH_ACCESS_TOKEN_SECRET" | base64)

# Add JWT section
echo -e "\n[jwt_keys]\nhmac:${AUTH_ACCESS_TOKEN_HMAC_KID} = ${ENCODED_SECRET}" >> "$INI_FILE"

echo "CouchDB configuration completed successfully."
