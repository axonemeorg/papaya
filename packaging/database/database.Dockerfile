# syntax=docker/dockerfile:experimental

FROM couchdb:latest

# Install yq for YAML parsing
RUN apt-get update && \
    apt-get install -y wget && \
    wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 && \
    chmod +x /usr/local/bin/yq && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create directory for papaya config
RUN mkdir -p /etc/papaya

# Copy YAML configuration file
COPY config/docker.yaml /etc/papaya/config.yaml

# Use fixed port
EXPOSE 5984

# Copy baseline configuration file
COPY packaging/database/papaya.ini /opt/couchdb/etc/default.d/papaya.ini

# Extract configuration values and update the ini file directly
RUN PAPAYA_COUCHDB_ADMIN_USER=$(/usr/local/bin/yq eval '.couchdb.admin_user' /etc/papaya/config.yaml) && \
    PAPAYA_COUCHDB_ADMIN_PASS=$(/usr/local/bin/yq eval '.couchdb.admin_pass' /etc/papaya/config.yaml) && \
    AUTH_ACCESS_TOKEN_SECRET=$(/usr/local/bin/yq eval '.auth.access_token_secret' /etc/papaya/config.yaml) && \
    AUTH_ACCESS_TOKEN_HMAC_KID=$(/usr/local/bin/yq eval '.auth.access_token_hmac_kid' /etc/papaya/config.yaml) && \
    ENCODED_SECRET=$(echo -n "$AUTH_ACCESS_TOKEN_SECRET" | base64) && \
    echo -e "\n[admins]\n${PAPAYA_COUCHDB_ADMIN_USER} = ${PAPAYA_COUCHDB_ADMIN_PASS}" >> /opt/couchdb/etc/default.d/papaya.ini && \
    echo -e "\n[jwt_keys]\nhmac:${AUTH_ACCESS_TOKEN_HMAC_KID} = ${ENCODED_SECRET}" >> /opt/couchdb/etc/default.d/papaya.ini && \
    echo "CouchDB configuration completed successfully."

# Use default CouchDB entrypoint and command
CMD ["couchdb"]
