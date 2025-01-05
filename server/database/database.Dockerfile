FROM couchdb:latest

# Copy the couchdb.ini file
COPY database/couchdb.ini /opt/couchdb/etc/local.d/couchdb.ini

RUN echo "\
[admins]\n\
${ZISK_COUCHDB_ADMIN_USER} = ${ZISK_COUCHDB_ADMIN_PASS}\n\
\n\
" >> /opt/couchdb/etc/local.d/jwt_cors.ini

EXPOSE 5984

CMD ["couchdb"]
