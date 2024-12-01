# Use the official CouchDB image from the Docker Hub
FROM couchdb:latest

# Set CouchDB to run as a daemon
RUN sed -i 's/^;daemonize = false/daemonize = true/' /opt/couchdb/etc/default.ini

# Enable JWT authentication and CORS in the CouchDB configuration
RUN echo "\
[jwt_auth]\n\
; To enable JWT authentication, set this to true.\n\
enabled = true\n\
\n\
[chttpd]\n\
; Allow JWT authentication.\n\
authentication_handlers = {couch_httpd_auth, cookie_authentication_handler}, {couch_httpd_auth, default_authentication_handler}, {chttpd_auth, jwt_authentication_handler}\n\
\n\
[httpd]\n\
; Allow CORS requests.\n\
enable_cors = true\n\
\n\
[cors]\n\
; Define CORS settings.\n\
credentials = true\n\
origins = *\n\
methods = GET, POST, PUT, DELETE, OPTIONS\n\
headers = accept, authorization, content-type, origin, referer, x-csrf-token\n\
" >> /opt/couchdb/etc/local.d/jwt_cors.ini

# Expose the default CouchDB port
EXPOSE 5984

# Start CouchDB
CMD ["couchdb"]
