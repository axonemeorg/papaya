FROM couchdb:latest

# Expose CouchDB port
EXPOSE 5984

# Copy the custom script
COPY build/database-setup.sh /usr/local/bin/database-setup.sh
RUN chmod +x /usr/local/bin/database-setup.sh

# Copy the initial CouchDB configuration
COPY build/couchdb.ini /opt/couchdb/etc/local.d/couchdb.ini

# Switch to the CouchDB user
USER couchdb

# Default entrypoint to start CouchDB
ENTRYPOINT ["/opt/couchdb/bin/couchdb"]
