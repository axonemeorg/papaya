#!/bin/bash

# Path to the YAML configuration file
CONFIG_FILE="/etc/papaya/config.yaml"

# Create directory for papaya config if it doesn't exist
mkdir -p /etc/papaya

# Function to extract values from YAML using yq
get_yaml_value() {
  local key=$1
  yq eval ".$key" "$CONFIG_FILE"
}

# Extract configuration values
PAPAYA_COUCHDB_ADMIN_USER=$(get_yaml_value "couchdb.admin_user")
PAPAYA_COUCHDB_ADMIN_PASS=$(get_yaml_value "couchdb.admin_pass")
AUTH_ACCESS_TOKEN_SECRET=$(get_yaml_value "auth.access_token_secret")

INI_FILE="/opt/couchdb/etc/default.d/papaya.ini"

# Add admins section
echo -e "\n[admins]\n${PAPAYA_COUCHDB_ADMIN_USER} = ${PAPAYA_COUCHDB_ADMIN_PASS}" >> "$INI_FILE"

# Encode the JWT secret
ENCODED_SECRET=$(echo -n "$AUTH_ACCESS_TOKEN_SECRET" | base64)

# Add JWT section
echo -e "\n[jwt_keys]\nhmac:papaya = ${ENCODED_SECRET}" >> "$INI_FILE"

echo "CouchDB configuration completed successfully."
