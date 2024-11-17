CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;


--------------------------------------------------------------------------------
-- Sites
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude FLOAT8 NOT NULL,
    longitude FLOAT8 NOT NULL,
    elevation INT -- Units: ft
);

-- Load data from the CSV file into the table.
COPY sites(name, city, country, latitude, longitude, elevation)
FROM '/docker-entrypoint-initdb.d/sites.csv'
DELIMITER ','
CSV HEADER;
