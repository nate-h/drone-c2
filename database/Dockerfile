# database/Dockerfile

# PostgreSQL 15 (multi-arch)
FROM postgres:15

# Install PostGIS extension
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        postgis \
        postgresql-15-postgis-3 && \
    rm -rf /var/lib/apt/lists/*

# Copy initialization scripts
COPY ./init/ /docker-entrypoint-initdb.d/
RUN chmod -R 755 /docker-entrypoint-initdb.d/
