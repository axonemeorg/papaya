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
COPY ../../config/docker.yaml /etc/zisk/config.yaml

# Extract port from config
RUN export DB_PORT=$(/usr/local/bin/yq eval '.couchdb.port // 5984' /etc/zisk/config.yaml) && \
    echo "Exposing port $DB_PORT" && \
    echo "EXPOSE $DB_PORT" > /etc/zisk/expose.docker

# Expose the port from config (default to 5984 if not specified)
EXPOSE ${DB_PORT:-5984}

# Copy baseline configuration file
COPY couchdb.ini /opt/couchdb/etc/local.d/couchdb.ini

# Copy and run setup script during build
COPY setup.sh /usr/local/bin/setup.sh
RUN chmod +x /usr/local/bin/setup.sh && \
    /usr/local/bin/setup.sh

# Use default CouchDB entrypoint and command
CMD ["couchdb"]
