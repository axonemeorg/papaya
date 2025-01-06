FROM couchdb:latest

# Expose CouchDB port
EXPOSE 5984

# Copy your custom configuration file
COPY database/couchdb.ini /opt/couchdb/etc/local.d/couchdb.ini

# Copy the setup script into the container
COPY database/setup.sh /usr/local/bin/setup.sh
RUN chmod +x /usr/local/bin/setup.sh

# Use the default CouchDB CMD but run the setup script after CouchDB starts
CMD ["/bin/bash", "-c", "/docker-entrypoint.sh /opt/couchdb/bin/couchdb & /usr/local/bin/setup.sh && wait"]
