# Use the official CouchDB image from the Docker Hub
FROM couchdb:latest

# Set CouchDB to run as a daemon
RUN sed -i 's/^;daemonize = false/daemonize = true/' /opt/couchdb/etc/default.ini

# Expose the default CouchDB port
EXPOSE 5984

# Set environment variables for CouchDB
ENV COUCHDB_USER=admin \
    COUCHDB_PASSWORD=password

# Start CouchDB
CMD ["couchdb"]
