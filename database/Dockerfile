# database/Dockerfile

FROM arm64v8/postgres

# Install PostGIS and dependencies
RUN apt-get update && \
    apt-get install -y postgis postgresql-15-postgis-3 && \
    rm -rf /var/lib/apt/lists/*


COPY ./init/ /docker-entrypoint-initdb.d/
RUN chmod -R 755 /docker-entrypoint-initdb.d/
