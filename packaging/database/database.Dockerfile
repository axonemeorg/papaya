# syntax=docker/dockerfile:experimental

FROM couchdb:latest

# Install yq for YAML parsing
RUN apt-get update && \
    apt-get install -y wget && \
    wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 && \
    chmod +x /usr/local/bin/yq && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create directory for zisk config
RUN mkdir -p /etc/zisk

# Copy YAML configuration file
COPY config/docker.yaml /etc/zisk/config.yaml

# Use fixed port
EXPOSE 5984

# Copy baseline configuration file
COPY packaging/database/zisk.ini /opt/couchdb/etc/default.d/zisk.ini

# Extract configuration values and update the ini file directly
RUN ZISK_COUCHDB_ADMIN_USER=$(/usr/local/bin/yq eval '.couchdb.admin_user' /etc/zisk/config.yaml) && \
    ZISK_COUCHDB_ADMIN_PASS=$(/usr/local/bin/yq eval '.couchdb.admin_pass' /etc/zisk/config.yaml) && \
    AUTH_ACCESS_TOKEN_SECRET=$(/usr/local/bin/yq eval '.auth.access_token_secret' /etc/zisk/config.yaml) && \
    AUTH_ACCESS_TOKEN_HMAC_KID=$(/usr/local/bin/yq eval '.auth.access_token_hmac_kid' /etc/zisk/config.yaml) && \
    ENCODED_SECRET=$(echo -n "$AUTH_ACCESS_TOKEN_SECRET" | base64) && \
    echo -e "\n[admins]\n${ZISK_COUCHDB_ADMIN_USER} = ${ZISK_COUCHDB_ADMIN_PASS}" >> /opt/couchdb/etc/default.d/zisk.ini && \
    echo -e "\n[jwt_keys]\nhmac:${AUTH_ACCESS_TOKEN_HMAC_KID} = ${ENCODED_SECRET}" >> /opt/couchdb/etc/default.d/zisk.ini && \
    echo "CouchDB configuration completed successfully."

# Use default CouchDB entrypoint and command
CMD ["couchdb"]
