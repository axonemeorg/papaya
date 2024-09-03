# Use the official LibSQL Server image from GitHub Container Registry
FROM ghcr.io/tursodatabase/libsql-server:latest

# Set environment variable for SQLD_NODE
ENV SQLD_NODE=primary

# Expose port 8080
EXPOSE 8080

# Command to run the server
CMD ["libsql-server"]
